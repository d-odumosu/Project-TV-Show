// --------------------------
// DOM ELEMENTS
// --------------------------

const episodesContainer = document.getElementById('episode-container');
const searchInput = document.getElementById('search');
const searchCount = document.getElementById('search-count');
const episodeSelect = document.getElementById('episode-select');
const statusMessage = document.getElementById('status-message');
const totalEpisode = document.getElementById('totalEpisode');
const searchContainer = document.getElementById('search-container');
const showSelect = document.getElementById('show-select');
searchContainer.hidden = true;

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
//        RENDERING
// --------------------------
function render(episodes) {
    episodesContainer.textContent = '';
    episodes.forEach((episode) => {
        const episodeCard = document
            .getElementById('episode-template')
            .content.cloneNode(true);
        const episodeCode = `${episode.name} - S${episode.season.toString().padStart(2, '0')}E${episode.number.toString().padStart(2, '0')}`;
        const summary = episode.summary || 'No summary available.';
        const image = episode.image?.medium;
        episodeCard.querySelector('.episode-title').textContent = episodeCode;

        if (image) {
            episodeCard.querySelector('.episode-image').src = image;
        } else {
            episodeCard.querySelector('.episode-image').remove();
        }
        episodeCard.querySelector('.episode-description').innerHTML = summary;
        episodesContainer.appendChild(episodeCard);
    });
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
    appData.shows.sort((showA, showB) => {
        return showA.name.toLowerCase().localeCompare(showB.name.toLowerCase());
    });
    populateDropdown(appData.shows, showSelect, (show) => show.name);
}

// --------------------------
// EVENT LISTENERS
// --------------------------
showSelect.addEventListener('change', async () => {
    appData.selectedShow = showSelect.value;
    await getShows(appData.selectedShow);
    episodeSelect.textContent = '';
    populateDropdown(
        appData.episodes,
        episodeSelect,
        (episode) =>
            `S${String(episode.season).padStart(2, '0')}E${String(episode.number).padStart(2, '0')} - ${episode.name}`
    );
    searchContainer.hidden = false;
    totalEpisode.textContent = `Displaying: ${appData.episodes.length}/${appData.episodes.length}`;
    render(appData.episodes);
});

episodeSelect.addEventListener('change', async () => {
    appData.selectedEpisode = episodeSelect.value;
    await getShowEpisodes(appData.selectedEpisode);

    const episode = appData.episodes.find((episode) => {
        return appData.episodes.id === Number(appData.selectedEpisode);
    });
    if (episode) {
        totalEpisode.textContent = `Displaying: ${[episode].length}/${appData.episodes.length}`;
        render([episode]);
    }
});

searchInput.addEventListener('input', () => {
    appData.searchTerm = searchInput.value.toLowerCase();
    const filteredEpisodes = appData.episodes.filter(
        (episode) =>
            episode.name.toLowerCase().includes(appData.searchTerm) ||
            (episode.summary || '').toLowerCase().includes(appData.searchTerm)
    );
    if (appData.searchTerm) {
        searchCount.textContent = `Displaying: ${filteredEpisodes.length}/${appData.episodes.length}`;
    } else {
        searchCount.textContent = '';
    }
    render(filteredEpisodes);
});

window.onload = setup;
