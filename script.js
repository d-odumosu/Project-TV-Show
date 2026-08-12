const allEpisodes = getAllEpisodes();
const episodeList = document.querySelector('.episode-list');

function displayEpisodes(episodes) {
episodes.forEach((episode) => {
    const episodeCard = createEpisodeCard(episode);
    episodeList.appendChild(episodeCard);
});
}

function createEpisodeCard(episode) {
    const episodeCard = document
        .getElementById('episode-template')
        .content.cloneNode(true);

    const episodeCode = `${episode.name} - S${episode.season.toString().padStart(2, '0')}E${episode.number.toString().padStart(2, '0')}`;
    const summary = episode.summary;
    const image = episode.image.medium;

    episodeCard.querySelector('h3').textContent = episodeCode;
    episodeCard.querySelector('img').src = image;
    episodeCard.querySelector('p').innerHTML = summary;
    return episodeCard;
}

displayEpisodes(allEpisodes);
