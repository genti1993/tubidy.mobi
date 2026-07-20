const database = [
  { title: "Flowers", artist: "Miley Cyrus" },
  { title: "Blinding Lights", artist: "The Weeknd" },
  { title: "Shape of You", artist: "Ed Sheeran" },
  { title: "Another Love", artist: "Tom Odell" },
  { title: "Mockingbird", artist: "Eminem" }
];

document.addEventListener("DOMContentLoaded", () => {
  const trendingList = document.getElementById("trendingList");
  renderSongs(database.slice(0, 3), trendingList);

  // Logjika e ndërrimit të Dark Mode
  const themeToggle = document.getElementById("themeToggle");
  themeToggle.addEventListener("click", () => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    } else {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    }
  });
});

document.getElementById("searchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const query = document.getElementById("searchInput").value.toLowerCase().trim();
  const resultsSection = document.getElementById("resultsSection");
  const resultsList = document.getElementById("resultsList");
  const resultsTitle = document.getElementById("resultsTitle");

  const filteredSongs = database.filter(song => 
    song.title.toLowerCase().includes(query) || 
    song.artist.toLowerCase().includes(query)
  );

  resultsSection.classList.remove("hidden");
  resultsList.innerHTML = "";

  if (filteredSongs.length > 0) {
    resultsTitle.innerText = `🔎 Rezultatet për "${document.getElementById("searchInput").value}"`;
    renderSongs(filteredSongs, resultsList);
  } else {
    resultsTitle.innerText = `❌ Nuk u gjet asnjë rezultat për "${document.getElementById("searchInput").value}"`;
  }
});

function renderSongs(songsArray, container) {
  container.innerHTML = "";
  songsArray.forEach(song => {
    const card = document.createElement("div");
    card.className = "song-card";
    card.innerHTML = `
      <div class="song-details-wrapper">
        <div class="music-icon">🎵</div>
        <div class="song-info">
          <div class="song-title">${song.title}</div>
          <div class="song-artist">${song.artist}</div>
        </div>
      </div>
      <div class="download-buttons">
        <button class="btn-dl btn-mp3" onclick="alert('Duke shkarkuar MP3: ${song.title}')">⬇ MP3</button>
        <button class="btn-dl btn-mp4" onclick="alert('Duke shkarkuar MP4: ${song.title}')">⬇ MP4</button>
      </div>
    `;
    container.appendChild(card);
  });
}

