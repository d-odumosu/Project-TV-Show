// --------------------------
// DOM ELEMENTS
// --------------------------

const episodeContainer = document.getElementById('episode-container');
const searchInput = document.getElementById('search-input');
const searchCount = document.getElementById('search-count');
const episodeSelect = document.getElementById('episode-select');
const statusMessage = document.getElementById('status-message');
const totalEpisodes = document.getElementById('total-episodes');
const searchContainer = document.getElementById('search-container');
const showSelect = document.getElementById('show-select');
searchContainer.hidden = true;

const image =
    appState.episodes.image?.medium ??
    '/Users/tairatodumosu/CYF/Project-TV-Show/placeholder.png';

// ---------------------------
// POPULATES SHOWS & EPISODES
// ---------------------------
function populateDropdown(optionData, selectElement, getText) {
    optionData.forEach((optionDatum) => {
        const option = document.createElement('option');
        option.value = optionDatum.id;
        option.textContent = getText(optionDatum);
        selectElement.appendChild(option);
    });
}

// --------------------------
//        HELPER FUNCTIONS
// --------------------------
function getImageUrl(item) {
    return item.image?.medium ?? './images/placeholder.png';
}

function createEpisodeCard(episode) {
    const episodeCard = document
        .getElementById('episode-template')
        .content.cloneNode(true);
    episodeCard.querySelector('.episode-title').textContent =
        `${episode.name} - S${episode.season.toString().padStart(2, '0')}E${episode.number.toString().padStart(2, '0')}`;
    episodeCard.querySelector('.episode-description').textContent =
        episode.summary ?? 'No summary available.';
    episodeCard.querySelector('.episode-image').src = getImageUrl(episode);
    return episodeCard;
}

// --------------------------
// INITIALISE APP
// --------------------------
async function setup() {
    statusMessage.textContent = 'Episodes loading...';
    const success = await getShows();
    if (success) {
        statusMessage.textContent = '';
    } else {
        statusMessage.textContent = 'Unable to load episodes, try again later';
        return;
    }
    appState.shows.sort((showA, showB) => {
        return showA.name.toLowerCase().localeCompare(showB.name.toLowerCase());
    });
    populateDropdown(appState.shows, showSelect, (show) => show.name);
}

// --------------------------
// EVENT LISTENERS
// --------------------------
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
    searchContainer.hidden = false;
    totalEpisodes.textContent = `Displaying: ${appState.episodes.length}/${appState.episodes.length}`;
    render(appState.episodes);
});

episodeSelect.addEventListener('change', async () => {
    appState.selectedEpisode = episodeSelect.value;
    await getShowEpisodes(appState.selectedEpisode);

    const foundEpisode = appState.episodes.find((episode) => {
        return episode.id === Number(appState.selectedEpisode);
    });
    if (foundEpisode) {
        totalEpisodes.textContent = `Displaying: ${[foundEpisode].length}/${appState.episodes.length}`;
        render([foundEpisode]);
    }
});

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
    render(filteredEpisodes);
});

window.onload = setup;
