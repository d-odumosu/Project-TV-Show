const episodesContainer = document.getElementById('episode-container');
const searchInput = document.getElementById('search');
const searchCount = document.getElementById('search-count');
const episodeSelect = document.getElementById('episode-select');

function getEpisodes() {
    return appData.episodes;
}

function populateOption(episodes) {
    episodes.forEach((episode) => {
        const episodeOption = document.createElement('option');
        episodeOption.textContent = `S${String(episode.season).padStart(2, '0')}E${String(episode.number).padStart(2, '0')} - ${episode.name}`;
        episodeOption.value = episode.id;
        episodeSelect.appendChild(episodeOption);
    });
}

function render(episodes) {
    episodesContainer.textContent = '';
    episodes.forEach((episode) => {
        const episodeCard = document
            .getElementById('episode-template')
            .content.cloneNode(true);
        const episodeCode = `${episode.name} - S${episode.season.toString().padStart(2, '0')}E${episode.number.toString().padStart(2, '0')}`;
        const summary = episode.summary;
        const image = episode.image.medium;

        episodeCard.querySelector('.episode-title').textContent = episodeCode;
        episodeCard.querySelector('.episode-image').src = image;
        episodeCard.querySelector('.episode-description').innerHTML = summary;
        episodesContainer.appendChild(episodeCard);
    });
}

async function setup() {
    await getData(); // wait for fetched data

    const allEpisodes = appData.episodes;
    render(allEpisodes);
    populateOption(allEpisodes);
}

let selectedEpisode = '';
episodeSelect.addEventListener('change', function () {
    selectedEpisode = episodeSelect.value;
    const allEpisodes = getEpisodes();
    const episode = allEpisodes.find((episode) => {
        return episode.id === Number(selectedEpisode);
    });
    if (episode) {
        render([episode]);
    } else if (selectedEpisode === '') {
        render(allEpisodes);
    }
});

let searchTerm = '';
searchInput.addEventListener('input', () => {
    searchTerm = searchInput.value.toLowerCase();
    const allEpisodes = getEpisodes();
    const filteredEpisodes = allEpisodes.filter(
        (episode) =>
            episode.name.toLowerCase().includes(searchTerm) ||
            episode.summary.toLowerCase().includes(searchTerm)
    );
    if (searchTerm) {
        searchCount.textContent = `Displaying: ${filteredEpisodes.length}/${allEpisodes.length}`;
    } else {
        searchCount.textContent = '';
    }
    render(filteredEpisodes);
});

window.onload = setup;
