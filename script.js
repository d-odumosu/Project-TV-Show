// --------------------------
// DOM ELEMENTS
// --------------------------

// Store references to elements that already exist in the HTML
const episodeContainer = document.getElementById('episode-container');
const searchInput = document.getElementById('episode-search-input');
const searchCount = document.getElementById('search-count');
const episodeSelect = document.getElementById('episode-select');
const statusMessage = document.getElementById('status-message');
const totalEpisodes = document.getElementById('total-episodes');

const showSelect = document.getElementById('show-select');
const showContainer = document.getElementById('show-container');
const showControls = document.getElementById('show-controls');
const episodeControls = document.getElementById('episode-controls');
const showView = document.getElementById('show-view');
const episodeView = document.getElementById('episode-view');

// --------------------------
// HELPER FUNCTIONS
// --------------------------
/*
 * Creates and adds options to a select dropdown.
 */
function populateDropdown(optionData, selectElement, getText) {
    optionData.forEach((optionDatum) => {
        const option = document.createElement('option');
        option.value = optionDatum.id;
        option.textContent = getText(optionDatum);
        selectElement.appendChild(option);
    });
}
/*
 * Returns an item's image URL.
 * Uses a placeholder image if no image is available.
 */
function getImageUrl(item) {
    return item.image?.medium ?? './images/placeholder.png';
}
function switchView(view) {
    // Update app state
    appState.currentView = view;
    if (view === 'shows') {
        showView.hidden = false;
        episodeView.hidden = true;
    } else if (view === 'episodes') {
        episodeView.hidden = false;
        showView.hidden = true;
    }
}
// --------------------------
// RENDER FUNCTIONS
// --------------------------

/*
 * Clears the container and renders a list of cards.
 */
function render(data, createCard, container) {
    container.textContent = '';
    data.forEach((datum) => {
        const card = createCard(datum);
        container.appendChild(card);
    });
}
/*
 * Creates an episode card using episode data.
 */
function createEpisodeCard(episode) {
    const episodeCard = document
        .getElementById('episode-template')
        .content.cloneNode(true);
    episodeCard.querySelector('.episode-title').textContent =
        `${episode.name} - S${episode.season.toString().padStart(2, '0')}E${episode.number.toString().padStart(2, '0')}`;
    episodeCard.querySelector('.episode-description').textContent =
        episode.summary ?? 'No summary available.';
    episodeCard.querySelector('.episode-image').src = getImageUrl(episode);
    episodeCard.querySelector('.episode-image').alt = episode.name;
    return episodeCard;
}

function createShowCard(show) {
    const showCard = document
        .getElementById('show-template')
        .content.cloneNode(true);
    const showTitle = showCard.querySelector('.show-title');
    const showImage = showCard.querySelector('.show-image');
    const showSummary = showCard.querySelector('.show-summary');
    const showRating = showCard.querySelector('.show-rating');
    const showGenres = showCard.querySelector('.show-genres');
    const showStatus = showCard.querySelector('.show-status');
    const showRuntime = showCard.querySelector('.show-runtime');
    const ratingLabel = document.createElement('strong');
    const genresLabel = document.createElement('strong');
    const statusLabel = document.createElement('strong');
    const runtimeLabel = document.createElement('strong');

    showTitle.textContent = show.name;
    showTitle.dataset.showId = show.id;
    showImage.src = getImageUrl(show);
    showImage.dataset.showId = show.id;
    showImage.alt = show.name;
    ratingLabel.textContent = 'Rated:';
    genresLabel.textContent = 'Genres:';
    statusLabel.textContent = 'Status:';
    runtimeLabel.textContent = 'Runtime:';

    showSummary.innerHTML = show.summary ?? 'No summary available.';
    showRating.appendChild(ratingLabel);
    showGenres.appendChild(genresLabel);
    showStatus.appendChild(statusLabel);
    showRuntime.appendChild(runtimeLabel);

    showRating.append(` ${show.rating?.average ?? 'Not rated'}`);
    showGenres.append(` ${show.genres.join(', ')}`);
    showStatus.append(` ${show.status}`);
    showRuntime.append(` ${show.runtime}`);
    return showCard;
}
// --------------------------
// LOADING FUNCTIONS
// --------------------------

/*
 * Handles loading states and error messages.
 * Can run functions that load shows or episodes.
 */
async function handleLoading(
    loadingFunction,
    loadingMessage,
    errorMessage,
    showId
) {
    statusMessage.textContent = loadingMessage;
    const success = await (!showId
        ? loadingFunction()
        : loadingFunction(showId));
    if (success) {
        statusMessage.textContent = '';
    } else {
        statusMessage.textContent = errorMessage;
    }
}
// --------------------------
// SHOW CLICK HANDLER
// --------------------------

/*
 * Gets the ID of the clicked show,
 * loads that show's episodes,
 * and renders the episodes.
 */
async function handleShowClick(event) {
    let showId = event.target.dataset.showId;
    await handleLoading(
        getShowEpisodes,
        'Episodes loading...',
        'Unable to load episodes. Please try again later.',
        showId
    );
    switchView('episodes');
    render(appState.episodes, createEpisodeCard, episodeContainer);
}
// --------------------------
// APP INITIALISATION
// --------------------------

/*
 * Loads all shows when the application starts,
 * sorts them, populates the show dropdown,
 * renders the show cards, and adds click listeners.
 */
async function setup() {
    await handleLoading(
        getShows,
        'Shows loading...',
        'Unable to load shows. Please try again later.'
    );
    appState.shows.sort((showA, showB) => {
        return showA.name.toLowerCase().localeCompare(showB.name.toLowerCase());
    });
    populateDropdown(appState.shows, showSelect, (show) => show.name);
    switchView('shows');
    render(appState.shows, createShowCard, showContainer);
    const showTitles = document.querySelectorAll('.show-title');
    showTitles.forEach((showTitle) => {
        showTitle.addEventListener('click', handleShowClick);

        const showImages = document.querySelectorAll('.show-image');
        showImages.forEach((showImage) => {
            showImage.addEventListener('click', handleShowClick);
        });
    });
}

// --------------------------
// EVENT LISTENERS
// --------------------------

/*
 * Loads episodes when a show is selected
 * from the show dropdown.
 */
showSelect.addEventListener('change', async () => {
    appState.selectedShow = showSelect.value;
    await getShowEpisodes(appState.selectedShow);
    episodeSelect.textContent = '';
    populateDropdown(
        appState.episodes,
        episodeSelect,
        (episode) =>
            `S${String(episode.season).padStart(2, '0')}E${String(episode.number).padStart(2, '0')} - ${episode.name}`
    );
    totalEpisodes.textContent = `Displaying: ${appState.episodes.length}/${appState.episodes.length}`;
    render(appState.episodes, createEpisodeCard, episodeContainer);
});
/*
 * Displays the selected episode.
 */
episodeSelect.addEventListener('change', async () => {
    appState.selectedEpisode = episodeSelect.value;
    await getShowEpisodes(appState.selectedEpisode);

    const foundEpisode = appState.episodes.find((episode) => {
        return episode.id === Number(appState.selectedEpisode);
    });
    if (foundEpisode) {
        totalEpisodes.textContent = `Displaying: ${[foundEpisode].length}/${appState.episodes.length}`;
        render([foundEpisode], createEpisodeCard, episodeContainer);
    }
});
/*
 * Filters and displays episodes based on the search input.
 */
searchInput.addEventListener('input', () => {
    appState.searchTerm = searchInput.value.toLowerCase();
    const filteredEpisodes = appState.episodes.filter(
        (episode) =>
            episode.name.toLowerCase().includes(appState.searchTerm) ||
            (episode.summary || '').toLowerCase().includes(appState.searchTerm)
    );
    if (appState.searchTerm) {
        searchCount.textContent = `Displaying: ${filteredEpisodes.length}/${appState.episodes.length}`;
    } else {
        searchCount.textContent = '';
    }
    render(filteredEpisodes, createEpisodeCard, episodeContainer);
});

// --------------------------
// START APPLICATION
// --------------------------

/*
 * Runs setup when the page has finished loading.
 */

window.onload = setup;
