// Refactor: store shows as well as episodes
const appData = {
    shows: [],
    episodes: [],
    episodeCache: {},
};

// Refactor: make the episode-fetching function reusable for any show.
async function fetchEpisodes(showId) {
    if (appData.episodeCache[showId]) {
        appData.episodes = appData.episodeCache[showId];
        return true;
    }

    const url = `https://api.tvmaze.com/shows/${showId}/episodes`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const episodes = await response.json();

        // Refactor: save the episodes so this show's URL is not fetched again.
        appData.episodeCache[showId] = episodes;
        appData.episodes = episodes;
        return true;
    } catch (error) {
        console.error(error.message);
        return false;
    }
}

// Fetch the list of TV shows from the TVMaze API.
async function fetchShows() {
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
