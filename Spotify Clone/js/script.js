console.log(`hello`);
let sound = new Audio();
let songs = [];
let cfolder;
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

async function getsongs(folder) {
    cfolder = folder
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
    let response = await a.text();

    let div = document.createElement(`div`);
    div.innerHTML = response;

    let links = div.getElementsByTagName(`a`);
    let songs = [];
    for (let index = 0; index < links.length; index++) {
        const link = links[index];
        if (link.href.endsWith(`.mp3`)) {
            songs.push(link.href.split(`/${folder}/`)[1]);
        }
    }

    let list = document.querySelector(".listsong ul");
    list.innerHTML = ""
    for (const song of songs) {
        let songname = song.replaceAll("%20", " ");
        list.innerHTML += `<li> 
            <img class="invert" src="img/playbtn.svg" alt=""> 
            <div class="songinfo">${songname}</div>
            <div class="playbtn">
                <span>Play Now</span>
                <img class="invert" src="img/play.svg" alt="">
            </div>
        </li>`;
    }

    Array.from(document.querySelectorAll(`.listsong li`)).forEach(e => {
        e.addEventListener(`click`, () => {
            let songname = e.querySelector(`.songinfo`).textContent.trim();
            playtime(songname);
            console.log("Playing:", songname);
        });
    });
    return songs;
}

const playtime = (track, pause = false) => {
    if (sound) {
        sound.pause();
        sound.currentTime = 0;
    }

    sound = new Audio(`/${cfolder}/${track}`);
    sound.play();
    document.querySelector(".info").innerHTML = decodeURI(track);
    document.querySelector(".playtime").innerHTML = "00:00 / 00:00";

    // Attach `timeupdate` event inside playtime() every time a new song loads
    sound.addEventListener("loadedmetadata", () => {
        sound.addEventListener("timeupdate", () => {
            // console.log("Updating Time:", sound.currentTime, "/", sound.duration);
            document.querySelector(".playtime").innerHTML =
                `${secondsToMinutesSeconds(sound.currentTime)} / ${secondsToMinutesSeconds(sound.duration)}`;
            const progressPercent = (sound.currentTime / sound.duration) * 100;
            document.querySelector(".duration").style.left = `${progressPercent}%`;

            document.querySelector(".linebar").addEventListener("click", e => {
                let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
                document.querySelector(".duration").style.left = percent + "%";
                sound.currentTime = ((sound.duration) * percent) / 100
            })
        });
    });
};

async function getalbum() {
    try {
        let a = await fetch(`http://127.0.0.1:3000/songs/`);
        let response = await a.text();
        let div = document.createElement(`div`);
        div.innerHTML = response;
        let anchors = div.getElementsByTagName(`a`);
        
        let array = Array.from(anchors);
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            
            if(e.href.includes("/songs")) {
                // Get the folder name correctly
                const parts = e.href.split("/");
                const folder = parts[parts.length - 2]; // Get second last part
                
                try {
                    let cardcontainer = document.querySelector(`.cardcontainer`);
                    let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`);
                    if (!a.ok) throw new Error(`HTTP error! status: ${a.status}`);
                    let response = await a.json();
                    console.log(response);
                    
                    // Create a proper card element with the 'card' class
                    const card = document.createElement('div');
                    card.className = 'card';
                    card.dataset.folder = folder; // Add folder to dataset
                    card.innerHTML = `
                        <div class="image">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                                <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                            </svg>
                            <img src="/songs/${folder}/cover.jpeg" alt="">
                        </div>
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    `;
                    
                    // Add click event directly to each card
                    card.addEventListener('click', async () => {
                        const songs = await getsongs(`songs/${folder}`);
                        playtime(songs[0])
                        // Do something with songs
                    });
                    
                    cardcontainer.appendChild(card);
                } catch (error) {
                    console.error(`Failed to fetch info.json for ${folder}:`, error);
                }
            }
        }
    } catch (error) {
        console.error('Failed to fetch songs list:', error);
    }
}
async function main() {

    songs = await getsongs("songs/cs");
    playtime(songs[0], true)

    getalbum()
    const playbutton = document.getElementById(`play`);
    if (playbutton) {
        playbutton.addEventListener('click', () => {
            if (sound) {
                if (sound.paused) {
                    sound.play();
                    playbutton.src = 'img/pause.svg';
                    console.log('Resumed playing');
                } else {
                    sound.pause();
                    playbutton.src = 'img/play.svg';
                    console.log('Paused');
                }
            } else {
                console.log('No audio is currently loaded');
            }
        });
    } else {
        console.error('Play button not found');
    }
    // hamburer
    document.querySelector(".hamburger").addEventListener(`click`, () => {
        document.querySelector(".left").style.left = `0`
    })

    document.querySelector(".close").addEventListener(`click`, () => {
        document.querySelector(".left").style.left = `-110%`
    })

    back.addEventListener("click", () => {
        if (!sound || !songs.length) return;

        sound.pause();
        console.log("Previous clicked");

        // Get current song filename more reliably
        const currentSongFile = sound.src.split('/').pop();
        let index = songs.indexOf(currentSongFile);

        if (index === -1) {
            console.error("Current song not found in playlist");
            return;
        }

        // Handle wrap-around (go to last song if at first song)
        const prevIndex = (index - 1 + songs.length) % songs.length;
        playtime(songs[prevIndex]);
    });

    // Next button functionality
    next.addEventListener("click", () => {
        if (!sound || !songs.length) return;

        sound.pause();
        console.log("Next clicked");

        const currentSongFile = sound.src.split('/').pop();
        let index = songs.indexOf(currentSongFile);

        if (index === -1) {
            console.error("Current song not found in playlist");
            return;
        }

        // Handle wrap-around (go to first song if at last song)
        const nextIndex = (index + 1) % songs.length;
        playtime(songs[nextIndex]);
    });
    document.querySelector(".timevol").getElementsByTagName("input")[0].addEventListener(`change`, (e) => {
        sound.volume = parseInt(e.target.value) / 100
    })
    document.querySelector(`.volume>img`).addEventListener(`click`, e=>{
if (e.target.src.includes(`img/volume.svg`)) {
    e.target.src = e.target.src.replace(`img/volume.svg`, `img/mute.svg`)
    sound.volume = 0;
    document.querySelector(`.volume`).getElementsByTagName(`input`)[0].value = 0;
}
else{
    e.target.src = e.target.src.replace(`img/mute.svg`,`img/volume.svg`)
    sound.volume = 0.10;
    document.querySelector(`.volume`).getElementsByTagName(`input`)[0].value = 10;

}
    })
}

main();

