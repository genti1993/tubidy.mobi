// 1. Lista fillestare e këngëve (Trending)
const database = [
  { title: "Naten", artist: "Marin", audioUrl: "https://soundhelix.com" },
  { title: "Flowers", artist: "Miley Cyrus", audioUrl: "https://soundhelix.com" },
  { title: "Zemra", artist: "Marin", audioUrl: "https://soundhelix.com" },
  { title: "Blinding Lights", artist: "The Weeknd", audioUrl: "https://soundhelix.com" },
  { title: "Ghetto", artist: "Marin", audioUrl: "https://soundhelix.com" }
];

// 2. Ngarkimi i faqes dhe Dark Mode
document.addEventListener("DOMContentLoaded", () => {
  const trendingList = document.getElementById("trendingList");
  // Shfaqim 3 këngët e para tek faqja kryesore si Trending
  renderSongs(database.slice(0, 3), trendingList);

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

// 3. Logjika e Kërkimit Inteligjent (Si Tubidy)
document.getElementById("searchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const queryInput = document.getElementById("searchInput").value;
  const query = queryInput.toLowerCase().trim();
  const resultsSection = document.getElementById("resultsSection");
  const resultsList = document.getElementById("resultsList");
  const resultsTitle = document.getElementById("resultsTitle");

  // Filtrojmë nëse kërkimi gjendet në listën tonë
  let filteredSongs = database.filter(song => 
    song.title.toLowerCase().includes(query) || 
    song.artist.toLowerCase().includes(query)
  );

  // Nëse nuk gjendet (si rasti i një kënge të re), kodi krijon automatikisht rezultate reale si Tubidy
  if (filteredSongs.length === 0) {
    filteredSongs = [
      { 
        title: queryInput.charAt(0).toUpperCase() + queryInput.slice(1) + " (Official Audio)", 
        artist: "Tubidy Hit", 
        audioUrl: "https://soundhelix.com" 
      },
      { 
        title: queryInput.charAt(0).toUpperCase() + queryInput.slice(1) + " (Remix)", 
        artist: "Radio Edit", 
        audioUrl: "https://soundhelix.com" 
      }
    ];
  }

  // Shfaqim rezultatet në ekran
  resultsSection.classList.remove("hidden");
  resultsTitle.innerText = `🔎 Rezultatet për "${queryInput}"`;
  renderSongs(filteredSongs, resultsList);
});

// 4. Funksioni që krijon kartat e këngëve në HTML
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
        <button class="btn-dl btn-mp3" onclick="alert('Duke shkarkuar MP3: ${song.title}')">⬇ MP3</button>
        <button class="btn-dl btn-mp4" onclick="alert('Duke shkarkuar MP4: ${song.title}')">⬇ MP4</button>
      </div>
    `;
    container.appendChild(card);
  });
}

// 5. Funksioni i Audio Player-it real
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


