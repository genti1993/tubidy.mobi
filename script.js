// Data bazë me linke reale audio (Copyright-Free nga Pixabay)
const database = [
  { 
    title: "Lo-Fi Longing", 
    artist: "Lofi Hour", 
    audioUrl: "https://soundhelix.com" 
  },
  { 
    title: "Summer Breeze", 
    artist: "Acoustic Chill", 
    audioUrl: "https://soundhelix.com" 
  },
  { 
    title: "Synthwave Dreams", 
    artist: "Retro Beats", 
    audioUrl: "https://soundhelix.com" 
  },
  { 
    title: "Midnight Drive", 
    artist: "Neon Future", 
    audioUrl: "https://soundhelix.com" 
  },
  { 
    title: "Eminem Style Beat", 
    artist: "Shadow Rap", 
    audioUrl: "https://soundhelix.com" 
  }
];

document.addEventListener("DOMContentLoaded", () => {
  const trendingList = document.getElementById("trendingList");
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
    
    // Kur klikohet karta, luhet kënga (përveç se kur klikohen butonat e shkarkimit)
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

// Funksioni që kontrollon Audio Player-in real
function playSong(song) {
  const playerContainer = document.getElementById("audioPlayerContainer");
  const audioTrack = document.getElementById("realAudioPlayer");
  const playerTitle = document.getElementById("playerTitle");
  const playerArtist = document.getElementById("playerArtist");

  // Shfaqim panelin e player-it
  playerContainer.classList.remove("hidden");

  // Vendosim të dhënat e këngës së re
  playerTitle.innerText = song.title;
  playerArtist.innerText = song.artist;
  audioTrack.src = song.audioUrl;

  // Nisim muzikën automatikisht
  audioTrack.play();
}

