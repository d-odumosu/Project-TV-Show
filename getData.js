const appData = {
    episodes: [],
};
async function getData() {
    const url = 'https://api.tvmaze.com/shows/82/episodes';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        appData.episodes = await response.json();
        console.log(appData.episodes);
    } catch (error) {
        console.error(error.message);
    }
}
