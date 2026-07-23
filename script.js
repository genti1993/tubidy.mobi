// ==========================================
// 1. KONFIGURIMI DHE DATABAZA FILLISTARE
// ==========================================

// VENDOS KËTU ÇELËSIN TËND FALAS NGA GOOGLE CLOUD
const YOUTUBE_API_KEY = "ZËVENDËSO_KËTË_ME_API_KEY_TËND_REAL"; 

// Këngët Trending për faqen e parë (Hite fillestare)
const trendingDatabase = [
  { title: "Marin - Naten", artist: "YouTube Hit", videoId: "6_3B8G_l9wM" },
  { title: "Miley Cyrus - Flowers", artist: "YouTube Hit", videoId: "G7KNmW9a75Y" },
  { title: "Marin - Zemra", artist: "YouTube Hit", videoId: "0_L_p4Sgt9U" }
];

// ==========================================
// 2. INTEGRIMI I YOUTUBE PLAYER API
// ==========================================

let player; 

// Ngarkojmë scriptin e YouTube në mënyrë asinkrone
const tag = document.createElement('script');
tag.src = "https://youtube.com"; 
const firstScriptTag = document.getElementsByTagName('script')[0];
if (firstScriptTag && firstScriptTag.parentNode) {
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
} else {
  document.head.appendChild(tag);
}

// Ky funksion thirret automatikisht kur API e YouTube është gati
function onYouTubeIframeAPIReady() {
  if (!document.getElementById('youtube-audio-player')) return;

  player = new YT.Player('youtube-audio-player', {
    height: '100%',
    width: '100%',
    videoId: trendingDatabase[0].videoId, // Nis me videon e parë (Marin - Naten)
    playerVars: {
      'playsinline': 1,
      'autoplay': 0, 
      'controls': 1  
    }
  });
}

// Funksioni që ndryshon këngën në player
function ndryshoKengen(videoId, emriKenges) {
  const resultsTitle = document.getElementById("resultsTitle");
  if (resultsTitle) {
    resultsTitle.innerHTML = `Duke luajtur: ${emriKenges}`;
  }

  if (player && player.loadVideoById) {
    player.loadVideoById(videoId);
  } else {
    console.error("Lojtari i YouTube nuk është gati ende!");
  }
}

// ==========================================
// 3. SHFAQJA E KËNGËVE NË INTERFACË (DOM)
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  // Shfaqim këngët trending sapo hapet faqja
  shfaqKengat(trendingDatabase);

  // Lidhja e eventit të kërkimit
  const searchForm = document.getElementById("searchForm");
  if (searchForm) {
    searchForm.addEventListener("submit", kryejKerkim);
  }
});

// Funksion universal që ndërton strukturën e këngëve
function shfaqKengat(kengat) {
  const resultsList = document.getElementById("resultsList");
  if (!resultsList) return;
  
  resultsList.innerHTML = ""; 

  if (kengat.length === 0) {
    resultsList.innerHTML = "<p style='text-align:center;'>Nuk u gjet asnjë këngë.</p>";
    return;
  }

  kengat.forEach(kenga => {
    const div = document.createElement("div");
    div.className = "song-item";
    div.style.marginBottom = "15px";
    div.style.padding = "15px";
    div.style.background = "#fff";
    div.style.border = "1px solid #eee";
    div.style.borderRadius = "6px";
    div.style.fontFamily = "Arial, sans-serif";
    
    div.innerHTML = `
      <span>🎵 <strong>${kenga.title}</strong></span><br>
      <small style="color: gray;">${kenga.artist}</small><br style="margin-bottom: 8px;">
      <button class="play-btn" style="background: #28a745; color: white; border: none; padding: 6px 12px; cursor: pointer; border-radius: 4px; font-weight: bold; margin-right: 5px;">▶ Luaj</button>
      <button style="background: #007bff; color: white; border: none; padding: 6px 12px; border-radius: 4px; margin-right: 5px; cursor: pointer;">⬇ MP3</button>
      <button style="background: #dc3545; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">⬇ MP4</button>
    `;

    // Lidhja e butonit Luaj me lojtarin e YouTube
    const playBtn = div.querySelector(".play-btn");
    playBtn.addEventListener("click", () => {
      ndryshoKengen(kenga.videoId, kenga.title);
    });

    resultsList.appendChild(div);
  });
}

// ==========================================
// 4. KËRKIMI REAL NGA YOUTUBE API
// ==========================================

async function kryejKerkim(e) {
  e.preventDefault();
  
  const searchInput = document.getElementById("searchInput");
  if (!searchInput) return;
  
  const queryInput = searchInput.value.trim();
  if (!queryInput) return;

  const resultsList = document.getElementById("resultsList");
  const resultsTitle = document.getElementById("resultsTitle");

  if (resultsTitle) resultsTitle.innerText = `🔎 Duke kërkuar për "${queryInput}"...`;
  if (resultsList) resultsList.innerHTML = "<p style='text-align:center;'>Ju lutem prisni, po ngarkohet YouTube...</p>";

  // Kontrolli nëse është vendosur API Key
  if (YOUTUBE_API_KEY === "ZËVENDËSO_KËTË_ME_API_KEY_TËND_REAL") {
    if (resultsTitle) resultsTitle.innerText = "❌ Gabim në Konfigurim";
    if (resultsList) resultsList.innerHTML = "<p style='text-align:center; color:red;'>Ju lutem vendosni një YouTube API Key të vlefshëm në rreshtin 6 të skedarit script.js!</p>";
    return;
  }

  const url = `https://googleapis.com{encodeURIComponent(queryInput)}&type=video&key=${YOUTUBE_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    // Mapojmë të dhënat që vijnë në kohë reale nga kërkimi
    const kengatEGjetura = data.items.map(item => {
      return {
        title: item.snippet.title,
        artist: item.snippet.channelTitle,
        videoId: item.id.videoId
      };
    });

    if (resultsTitle) resultsTitle.innerText = `Duke luajtur: Marin - Naten`; 
    shfaqKengat(kengatEGjetura); 

  } catch (error) {
    console.error("Gabim gjatë kërkimit:", error);
    if (resultsTitle) resultsTitle.innerText = "❌ Ndodhi një gabim";
    if (resultsList) resultsList.innerHTML = `<p style='text-align:center; color:red;'>Nuk u morën dot të dhënat. Sqarim: ${error.message}</p>`;
  }
}
