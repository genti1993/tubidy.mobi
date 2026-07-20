// 1. Lista fillestare e këngëve për faqen e parë (Trending)
const trendingDatabase = [
  { title: "Naten", artist: "Marin", audioUrl: "https://soundhelix.com" },
  { title: "Flowers", artist: "Miley Cyrus", audioUrl: "https://soundhelix.com" },
  { title: "Zemra", artist: "Marin", audioUrl: "https://soundhelix.com" }
];

document.addEventListener("DOMContentLoaded", () => {
  const trendingList = document.getElementById("trendingList");
  renderSongs(trendingDatabase, trendingList);

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

// 2. Kërkimi Real i Këngëve nga API (Sjell deri në 100 rezultate në kohë reale)
document.getElementById("searchForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const queryInput = document.getElementById("searchInput").value;
  const resultsSection = document.getElementById("resultsSection");
  const resultsList = document.getElementById("resultsList");
  const resultsTitle = document.getElementById("resultsTitle");

  resultsSection.classList.remove("hidden");
  resultsTitle.innerText = `🔎 Duke kërkuar për "${queryInput}"...`;
  resultsList.innerHTML = "<p style='text-align:center;'>Ju lutem prisni, po ngarkohen 100 këngë...</p>";

  try {
    // Këtu ndodhet lidhja me API dhe limiti është vendosur saktësisht limit=100
    const response = await fetch(`https://apple.com{encodeURIComponent(queryInput)}&media=music&limit=100`);
    const data = await response.json();

    resultsList.innerHTML = "";

    if (data.results && data.results.length > 0) {
      resultsTitle.innerText = `🔎 Rezultatet për "${queryInput}" (${data.results.length} këngë)`;
      
      // Përkthejmë të dhënat e API në strukturën e faqes tonë
      const formattedSongs = data.results.map(track => ({
        title: track.trackName,
        artist: track.artistName,
        audioUrl: track.previewUrl // Link real audio për dëgjim
      }));

      renderSongs(formattedSongs, resultsList);
    } else {
      resultsTitle.innerText = `❌ Nuk u gjet asnjë rezultat për "${queryInput}"`;
    }
  } catch (error) {
    resultsTitle.innerText = `❌ Ndodhi një gabim gjatë kërkimit`;
    resultsList.innerHTML = "";
  }
});

// 3. Funksioni që krijon kartat e këngëve në HTML
function renderSongs(songsArray, container) {
  container.innerHTML = "";
  songsArray.forEach(song => {
    const card = document.createElement("div");
    card.className = "song-card";
    
    card.onclick = (e) => {
      if (!e.target.classList.contains('btn-dl')) {
        playSong(song);
      }
    };

    card.innerHTML = `
      <div class="song-details-wrapper">
        <div class="music-icon">🎵</div>
        <div class="song-info">
          <div class="song-title">${song.title}</div>
          <div class="song-artist">${song.artist}</div>
        </div>
      </div>
      <div class="download-buttons">
        <button class="btn-dl btn-mp3" onclick="alert('Duke përgatitur shkarkimin MP3 për: ${song.title}')">⬇ MP3</button>
        <button class="btn-dl btn-mp4" onclick="alert('Duke përgatitur shkarkimin MP4 për: ${song.title}')">⬇ MP4</button>
      </div>
    `;
    container.appendChild(card);
  });
}

// 4. Funksioni i Audio Player-it real
function playSong(song) {
  const playerContainer = document.getElementById("audioPlayerContainer");
  const audioTrack = document.getElementById("realAudioPlayer");
  const playerTitle = document.getElementById("playerTitle");
  const playerArtist = document.getElementById("playerArtist");

  playerContainer.classList.remove("hidden");
  playerTitle.innerText = song.title;
  playerArtist.innerText = song.artist;
  audioTrack.src = song.audioUrl;
  audioTrack.play();
}


