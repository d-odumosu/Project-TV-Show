const appData = {
    shows: [],
    episodes: [],
    episodesCache: new Map(),
    selectedShow: '',
    selectedEpisode: '',
    searchTerm: '',
};

// --------------------------
// API / FETCH FUNCTIONS
// --------------------------

async function getShows() {
    const url = 'https://api.tvmaze.com/shows';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        appData.shows = await response.json();
        return true;
    } catch (error) {
        console.error(error.message);
        return false;
    }
}

async function getShowEpisodes(showId) {
    if (appData.episodesCache.has(appData.selectedShow)) {
        appData.episodes = appData.episodesCache.get(appData.selectedShow);
    } else {
        const url = `https://api.tvmaze.com/shows/${showId}/episodes`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            appData.episodes = await response.json();
            return true;
        } catch (error) {
            console.error(error.message);
            return false;
        }
    }
}
