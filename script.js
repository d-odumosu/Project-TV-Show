const episodesContainer = document.getElementById('episode-container');
const searchInput = document.getElementById('search');
const searchCount = document.getElementById('search-count');
const episodeSelect = document.getElementById('episode-select');
const statusMessage = document.getElementById('status-message');
const pageTitle = document.getElementById('page-title');


// Reference the show selector so users can choose a TV show.
const showSelect = document.getElementById('show-select');

function getEpisodes() {
    return appData.episodes;
}

function populateOption(episodes) {
    episodeSelect.innerHTML = '<option value="" selected>Select an episode</option>';
    episodes.forEach((episode) => {
        const episodeOption = document.createElement('option');
        episodeOption.textContent = `S${String(episode.season).padStart(2, '0')}
        E${String(episode.number).padStart(2, '0')} - ${episode.name}`;
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

// Add each TV show to the show selector in alphabetical order.
function populateShowOptions(shows) {
    const sortedShows = [...shows].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
    );

    sortedShows.forEach((show) => {
        const showOption = document.createElement('option');
        showOption.textContent = show.name;
        showOption.value = show.id;
        showSelect.appendChild(showOption);
    });
}

async function setup() {
    statusMessage.textContent = 'Shows loading...';
    // Fetch the list of shows when page first loads.
    const showsLoaded = await fetchShows();

     if (!showsLoaded) {
        statusMessage.textContent = 'Unable to load show, try again later';
        return;
     }
     // Populate the show selector with alphabetically sorted shows.
     populateShowOptions(appData.shows);

      // Wait for the user to choose a show before fetching episodes.
    statusMessage.textContent = 'Select a show to view episodes.';
}
// Fetch and display episodes when the user selects a different show.
showSelect.addEventListener('change', async () => {
    const selectedShowId = showSelect.value;

     // Refactor: update the page heading to match the selected show.
    const selectedShow = appData.shows.find(
        (show) => show.id === Number(selectedShowId)
    );

    if (selectedShow) {
        pageTitle.textContent = `${selectedShow.name} Episodes`;
    }

    statusMessage.textContent = 'Episodes loading...';

    const episodesLoaded = await fetchEpisodes(selectedShowId);
    if (!episodesLoaded) {
        statusMessage.textContent = 'Unable to load episodes, try again later';
        return;
    }

    statusMessage.textContent = '';

    const allEpisodes = getEpisodes();

     // Clear any previous search when changing shows.
    searchInput.value = '';
    searchCount.textContent = '';


    render(allEpisodes);
    populateOption(allEpisodes);
});

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
           (episode.summary || '').toLowerCase().includes(searchTerm)
    );
    if (searchTerm) {
        searchCount.textContent = `Displaying: ${filteredEpisodes.length}/${allEpisodes.length}`;
    } else {
        searchCount.textContent = '';
    }
    render(filteredEpisodes);
});

window.onload = setup;
