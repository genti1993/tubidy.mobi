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
