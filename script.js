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
/* Stilimi i butonit Dark Mode */
.theme-toggle {
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: #ffffff;
  border: 1px solid #edf0f4;
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  transition: background-color 0.2s, transform 0.2s;
  z-index: 10;
}

.theme-toggle:hover {
  transform: scale(1.1);
}

html.dark .theme-toggle {
  background-color: #18181c;
  border-color: #26262b;
}
