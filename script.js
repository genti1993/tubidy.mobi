// ==========================================
// 1. KONFIGURIMI DHE DATABAZA FILLISTARE
// ==========================================

// VENDOS KËTU ÇELËSIN TËND FALAS NGA GOOGLE CLOUD
const YOUTUBE_API_KEY = "ZËVENDËSO_KËTË_ME_API_KEY_TËND_REAL"; 

// Këngët Trending për faqen e parë (Hite fillestare)
const trendingDatabase = [
  { title: "Marin - Naten", artist: "YouTube Hit", videoId: "dQw4w9WgXcQ" },
  { title: "Miley Cyrus - Flowers", artist: "YouTube Hit", videoId: "G7KNmW9a75Y" },
  { title: "Marin - Zemra", artist: "YouTube Hit", videoId: "kJQP7kiw5Fk" }
];

// ==========================================
// 2. INTEGRIMI I YOUTUBE PLAYER API (LOJTARI)
// ==========================================

let player; // Variabla globale për kontrollin e lojtarit

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
  // Sigurohemi që elementi ekziston në HTML përpara se të krijojmë lojtarin
  if (!document.getElementById('youtube-audio-player')) {
    console.error("Gabim: Elementi <div id='youtube-audio-player'></div> nuk u gjet në HTML!");
    return;
  }

  player = new YT.Player('youtube-audio-player', {
    height: '315',
    width: '100%',
    videoId: trendingDatabase[0].videoId, // Zgjedh saktë këngën e parë [0] nga lista
    playerVars: {
      'playsinline': 1,
      'autoplay': 0, // Mos e nis automatikisht sa hapet faqja
      'controls': 1  // Shfaq kontrollet zyrtare të YouTube
    }
  });
}

// Funksioni që ndryshon këngën dhe e luan atë kur klikohet në listë
function luajKengen(videoId) {
  if (player && player.loadVideoById) {
    player.loadVideoById(videoId);
  } else {
    console.error("Lojtari i YouTube nuk është gati ende ose ka dështuar të ngarkohet!");
  }
}

// ==========================================
// 3. SHFAQJA E KËNGËVE NË INTERFACË (DOM)
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  // Shfaqim këngët trending sapo hapet faqja
  shfaqKengat(trendingDatabase);

  // Lidhja e eventit të kërkimit pasi DOM është gati
  const searchForm = document.getElementById("searchForm");
  if (searchForm) {
    searchForm.addEventListener("submit", kryejKerkim);
  }
});

// Funksion universal për të shfaqur listën e këngëve në HTML
function shfaqKengat(kengat) {
  const resultsList = document.getElementById("resultsList");
  if (!resultsList) return;
  
  resultsList.innerHTML = ""; // Pastrojmë listën e vjetër

  if (kengat.length === 0) {
    resultsList.innerHTML = "<p style='text-align:center;'>Nuk u gjet asnjë këngë.</p>";
    return;
  }

  kengat.forEach(kenga => {
    // Krijojmë elementin e listës për çdo këngë
    const li = document.createElement("li");
    li.className = "song-item"; 
    li.style.cursor = "pointer";
    li.style.padding = "10px";
    li.style.borderBottom = "1px solid #eee";
    
    li.innerHTML = `<strong>${kenga.artist}</strong> - ${kenga.title}`;
    
    // Kur klikohet rreshti, luan këngën përkatëse në player
    li.addEventListener("click", () => {
      luajKengen(kenga.videoId);
    });

    resultsList.appendChild(li);
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

  const resultsSection = document.getElementById("resultsSection");
  const resultsList = document.getElementById("resultsList");
  const resultsTitle = document.getElementById("resultsTitle");

  if (resultsSection) resultsSection.classList.remove("hidden");
  if (resultsTitle) resultsTitle.innerText = `🔎 Duke kërkuar në YouTube për "${queryInput}"...`;
  if (resultsList) resultsList.innerHTML = "<p style='text-align:center;'>Ju lutem prisni, po ngarkohet YouTube...</p>";

  // Kontrolli nëse është vendosur API Key
  if (YOUTUBE_API_KEY === "ZËVENDËSO_KËTË_ME_API_KEY_TËND_REAL") {
    if (resultsTitle) resultsTitle.innerText = "❌ Gabim në Konfigurim";
    if (resultsList) resultsList.innerHTML = "<p style='text-align:center; color:red;'>Ju lutem vendosni një YouTube API Key të vlefshëm në rreshtin 6 të skedarit script.js!</p>";
    return;
  }

  // URL e kërkimit zyrtar të YouTube
  const url = `https://googleapis.com{encodeURIComponent(queryInput)}&type=video&key=${YOUTUBE_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    // Mapojmë të dhënat që vijnë nga YouTube
    const kengatEGjetura = data.items.map(item => {
      return {
        title: item.snippet.title,
        artist: item.snippet.channelTitle,
        videoId: item.id.videoId
      };
    });

    // Përditësojmë titullin dhe shfaqim këngët e reja
    if (resultsTitle) resultsTitle.innerText = `🎶 Rezultatet për: "${queryInput}"`;
    shfaqKengat(kengatEGjetura);

  } catch (error) {
    console.error("Gabim gjatë kërkimit:", error);
    if (resultsTitle) resultsTitle.innerText = "❌ Ndodhi një gabim";
    if (resultsList) resultsList.innerHTML = `<p style='text-align:center; color:red;'>Nuk u morën dot të dhënat. Sqarim: ${error.message}</p>`;
  }
}
