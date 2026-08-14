const allEpisodes = getAllEpisodes();
const episodeList = document.querySelector(".episode-list");
const searchInput = document.querySelector("#search");
const episodeCount = document.querySelector("#episode-count");
const episodeSelect = document.querySelector("#episode-select");

function displayEpisodes(episodes) {
  episodeList.innerHTML = "";
  episodeCount.textContent = `Showing ${episodes.length} episodes`;
  episodes.forEach((episode) => {
    const episodeCard = createEpisodeCard(episode);
    episodeList.appendChild(episodeCard);
  });
}

function createEpisodeCard(episode) {
  const episodeCard = document
    .getElementById("episode-template")
    .content.cloneNode(true);

  episodeCard.querySelector("article").id = `episode-${episode.id}`;

  const episodeCode = `${episode.name} - S${episode.season.toString().padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}`;
  const summary = episode.summary;
  const image = episode.image.medium;

  episodeCard.querySelector("h3").textContent = episodeCode;
  episodeCard.querySelector("img").src = image;
  episodeCard.querySelector("p").innerHTML = summary;
  return episodeCard;
}

function populateEpisodeSelect() {
  allEpisodes.forEach((episode) => {
    const option = document.createElement("option");

    option.value = episode.id;
    option.textContent = `S${episode.season.toString().padStart(2, "0")}E${episode.number.toString().padStart(2, "0")} - ${episode.name}`;

    episodeSelect.appendChild(option);
  });
}

episodeSelect.addEventListener("change", function () {
  const selectedEpisodeId = episodeSelect.value;

  if (selectedEpisodeId) {
    const selectedEpisode = document.querySelector(
      `#episode-${selectedEpisodeId}`,
    );

    if (selectedEpisode) {
      selectedEpisode.scrollIntoView();
    }
  }
});

displayEpisodes(allEpisodes);
populateEpisodeSelect();

searchInput.addEventListener("input", function () {
  const searchTerm = searchInput.value;
  const filteredEpisodes = searchEpisodes(searchTerm);

  displayEpisodes(filteredEpisodes);
});

function searchEpisodes(searchTerm) {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
  return allEpisodes.filter((episode) => {
    return (
      episode.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      episode.summary.toLowerCase().includes(lowerCaseSearchTerm)
    );
  });
}
