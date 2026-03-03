console.log("Let's Write JavaScript");

let currentsong = new Audio();
let songs = [];
let currentIndex = 0;
let currFolder;

function formatTime(seconds) {
    let secs = Math.floor(seconds);
    let mins = Math.floor(secs / 60);
    let remSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remSecs.toString().padStart(2, "0")}`;
}

async function getsongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/").pop());
        }
    }
    return songs;
}

const playMusic = (track, pause = false) => {
    let cleanTrack = decodeURIComponent(track)
        .replaceAll("\\", "/")
        .trim();

    if (!cleanTrack.startsWith(`/${currFolder}/`)) {
        cleanTrack = `/${currFolder}/` + cleanTrack;
    }

    currentsong.src = cleanTrack;
    currentsong.load();

    const playButton = document.querySelector(".songbuttons #play");

    if (!pause) {
        currentsong.play().catch(err => console.log("Play failed:", err));
        playButton.classList.remove("fa-circle-play");
        playButton.classList.add("fa-circle-pause");
    } else {
        // ✅ start in paused mode (show play icon)
        playButton.classList.add("fa-circle-play");
        playButton.classList.remove("fa-circle-pause");
    }

    let cleanName = cleanTrack.split("/").pop().replace(".mp3", "");
    document.querySelector(".songinfo").innerHTML = cleanName;
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function displayAlbums() {
    let cardContainer = document.querySelector(".cardcontainer");
    cardContainer.innerHTML = "";

    // Folder list manually because browser can't read directory structure directly
    let folders = ["cs",  "ncs","Alubu","lo-fi", "Party Songs", "arjit", "Shreya Ghoshal Hits","Jubin Nautiyal", "Lata Mangeshkar", "Kishore Kumar", "Phonk","The Weeknd", "Taylor Swift", "ED Sheeran",  "Billie Eilish"];

    for (let folder of folders) {
        try {
            // fetch info.json of each folder
            let info = await fetch(`songs/${folder}/info.json`).then(res => res.json());

            // create card dynamically
            cardContainer.innerHTML += `
                <div data-folder="${folder}" class="card">
                    <div class="play">
                        <i class="fa-solid fa-circle-play"></i>
                    </div>
                    <img src="songs/${folder}/${info.cover}" alt="${info.title}">
                    <h2>${info.title}</h2>
                    <p>${info.description}</p>
                </div>`;
        } catch (err) {
            console.error(`Error loading info.json for ${folder}:`, err);
        }





        // ✅ Attach click event for each playlist card
Array.from(document.getElementsByClassName("card")).forEach(card => {
    card.addEventListener("click", async () => {
        let folder = card.getAttribute("data-folder");

        // If this folder is already playing, toggle pause/play
        if (currFolder === `songs/${folder}` && !currentsong.paused) {
            currentsong.pause();
            document.querySelector(".songbuttons #play").classList.remove("fa-circle-pause");
            document.querySelector(".songbuttons #play").classList.add("fa-circle-play");
            card.querySelector(".play i").classList.remove("fa-circle-pause");
            card.querySelector(".play i").classList.add("fa-circle-play");
            return;
        }

        // Reset all cards’ icons to play
        document.querySelectorAll(".card .play i").forEach(icon => {
            icon.classList.remove("fa-circle-pause");
            icon.classList.add("fa-circle-play");
        });

        // Set current folder and get songs
        songs = await getsongs(`songs/${folder}`);
        currFolder = `songs/${folder}`;
        currentIndex = 0;

        // Play first song
        playMusic(songs[currentIndex]);
        card.querySelector(".play i").classList.remove("fa-circle-play");
        card.querySelector(".play i").classList.add("fa-circle-pause");

        // Update song list in sidebar
        let songul = document.querySelector(".songlist ul");
        songul.innerHTML = "";
        for (const song of songs) {
            let songName = decodeURIComponent(song).split(/[/\\]/).pop().replace(".mp3", "");
            songul.innerHTML += `
                <li>
                    <i class="fa-solid fa-music"></i>
                    <div class="info">
                        <div>${songName}</div>
                        <div>Rubu</div>
                    </div>
                    <div class="playnow">
                        <span>Play Now</span>
                        <i class="fa-solid fa-circle-play"></i>
                    </div>
                </li>`;
        }

        // Song click listeners
        Array.from(document.querySelectorAll(".songlist li")).forEach((e, i) => {
            e.addEventListener("click", () => {
                currentIndex = i;
                playMusic(songs[i]);
            });
        });
    });
});

    }

    // ✅ Reattach click events to the newly created cards
    Array.from(document.getElementsByClassName("card")).forEach(card => {
        card.addEventListener("click", async () => {
            let folder = card.getAttribute("data-folder");
            songs = await getsongs(`songs/${folder}`);
            currentIndex = 0;
            playMusic(songs[currentIndex]); // play first song in that folder

            // Update sidebar list
            let songul = document.querySelector(".songlist ul");
            songul.innerHTML = "";
            for (const song of songs) {
                let songName = decodeURIComponent(song).split(/[/\\]/).pop().replace(".mp3", "");
                songul.innerHTML += `
                    <li>
                        <i class="fa-solid fa-music"></i>
                        <div class="info">
                            <div>${songName}</div>
                            <div>Rubu</div>
                        </div>
                        <div class="playnow">
                            <span>Play Now</span>
                            <i class="fa-solid fa-circle-play"></i>
                        </div>
                    </li>`;
            }

            // Add click listeners to the new songs
            Array.from(document.querySelectorAll(".songlist li")).forEach((e, i) => {
                e.addEventListener("click", () => {
                    currentIndex = i;
                    playMusic(songs[i]);
                });
            });
        });
    });
}


    // ✅ reattach click events to new cards
    Array.from(document.getElementsByClassName("card")).forEach(card => {
        card.addEventListener("click", async () => {
            let folder = card.getAttribute("data-folder");
            songs = await getsongs(`songs/${folder}`);
            currentIndex = 0;
            playMusic(songs[currentIndex]); // play first song in that folder

            // update song list in sidebar
            let songul = document.querySelector(".songlist ul");
            songul.innerHTML = "";
            for (const song of songs) {
                let songName = decodeURIComponent(song).split(/[/\\]/).pop().replace(".mp3", "");
                songul.innerHTML += `
                    <li>
                        <i class="fa-solid fa-music"></i>
                        <div class="info">
                            <div>${songName}</div>
                            <div>Rubu</div>
                        </div>
                        <div class="playnow">
                            <span>Play Now</span>
                            <i class="fa-solid fa-circle-play"></i>
                        </div>
                    </li>`;
            }

            // add click listeners for songs
            Array.from(document.querySelectorAll(".songlist li")).forEach((e, i) => {
                e.addEventListener("click", () => {
                    currentIndex = i;
                    playMusic(songs[i]);
                });
            });
        });
    });



async function main() {
    songs = await getsongs("songs/ncs");  // MAIN TO CHANGE THE FOLDER
    playMusic(songs[0], true); // ✅ Load but keep paused
    currentIndex = 0;

    //display all the albums on the page
    displayAlbums()
    


    let songul = document.querySelector(".songlist ul");
    for (const song of songs) {
        let songName = decodeURIComponent(song).split(/[/\\]/).pop().replace(".mp3", "");
        songul.innerHTML += `
        <li>
            <i class="fa-solid fa-music"></i>
            <div class="info">
                <div>${songName}</div>
                <div>Rubu</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <i class="fa-solid fa-circle-play"></i>
            </div>
        </li>`;
    }

    

    Array.from(document.querySelectorAll(".songlist li")).forEach((e, i) => {
        e.addEventListener("click", () => {
            currentIndex = i;
            playMusic(songs[i]);
        });
    });
    //mentioning the id's for play,previous and next
    const playButton = document.querySelector(".songbuttons #play");
    const prevButton = document.querySelector(".songbuttons #previous");
    const nextButton = document.querySelector(".songbuttons #next");
    //playbutton
    playButton.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
            playButton.classList.remove("fa-circle-play");
            playButton.classList.add("fa-circle-pause");
        } else {
            currentsong.pause();
            playButton.classList.remove("fa-circle-pause");
            playButton.classList.add("fa-circle-play");
        }
    });
    //listen for time update event
    currentsong.addEventListener("timeupdate", () => {
        const current = formatTime(currentsong.currentTime);
        const duration = formatTime(currentsong.duration || 0);
        document.querySelector(".songtime").innerHTML = `${current} / ${duration}`;
        document.querySelector(".circle").style.left =
            (currentsong.currentTime / currentsong.duration) * 100 + "%";
    });
    //Add event listner to the seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = (currentsong.duration * percent) / 100;
    });
    //previous button
    prevButton.addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = songs.length - 1;
        }
        playMusic(songs[currentIndex]);
    });
    //next button
    nextButton.addEventListener("click", () => {
        if (currentIndex < songs.length - 1) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        playMusic(songs[currentIndex]);
    });

    currentsong.addEventListener("ended", () => {
        if (currentIndex < songs.length - 1) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        playMusic(songs[currentIndex]);
    });

    // add an event listener to the volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/100")
        currentsong.volume = parseInt(e.target.value) / 100
    })


    // Load playlist whenever a card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(card => {
        card.addEventListener("click", async () => {
            let folder = card.getAttribute("data-folder");
            songs = await getsongs(`songs/${folder}`);
            currentIndex = 0;
            playMusic(songs[currentIndex]); // start playing first song of that folder

            // update the song list dynamically in the left side
            let songul = document.querySelector(".songlist ul");
            songul.innerHTML = "";
            for (const song of songs) {
                let songName = decodeURIComponent(song).split(/[/\\]/).pop().replace(".mp3", "");
                songul.innerHTML += `
                <li>
                    <i class="fa-solid fa-music"></i>
                    <div class="info">
                        <div>${songName}</div>
                        <div>Rubu</div>
                    </div>
                    <div class="playnow">
                        <span>Play Now</span>
                        <i class="fa-solid fa-circle-play"></i>
                    </div>
                </li>`;
            }

            // re-attach event listeners to each new list item
            Array.from(document.querySelectorAll(".songlist li")).forEach((e, i) => {
                e.addEventListener("click", () => {
                    currentIndex = i;
                    playMusic(songs[i]);
                });
            });
        });
    });

}



main();
