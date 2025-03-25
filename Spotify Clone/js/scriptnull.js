console.log('Checking 123!'); // Just a log to check if the script is running

let currentAudio = null; // Variable to track the currently playing audio

// Function to fetch songs from the server
async function getsongs() {
    // Fetch the list of songs from the server
    let response = await fetch(`http://127.0.0.1:3000/songs/`);
    let data = await response.text(); // Get the response as text
    console.log(data); // Log the response to check what we got

    // Create a temporary div to hold the response HTML
    let div = document.createElement(`div`);
    div.innerHTML = data; // Put the response HTML into the div

    // Get all <a> tags from the div
    let links = div.getElementsByTagName("a");
    let songs = []; // Array to store song names

    // Loop through all <a> tags
    for (let index = 0; index < links.length; index++) {
        const link = links[index];
        // Check if the link ends with .mp3
        if (link.href.endsWith(`.mp3`)) {
            // Extract the song name from the link and add it to the songs array
            songs.push(link.href.split('/songs/')[1]);
        }
    }
    return songs; // Return the list of songs
}

// Function to play a song
const playmusic = (track) => {
    // If a song is already playing, stop it
    if (currentAudio) {
        currentAudio.pause(); // Pause the current song
        currentAudio.currentTime = 0; // Reset the playback position
    }

    // Create a new Audio object with the song path
    currentAudio = new Audio(`/songs/${track}`); // Store the new audio object
    currentAudio.play(); // Play the song
    console.log(`Playing: ${track}`); // Log the song being played
};

// Main function to load songs and handle clicks
async function main() {
    // Get the list of songs
    let songs = await getsongs();

    // Find the <ul> inside .listsong where we'll add the songs
    let songsList = document.querySelector(`.listsong`)?.getElementsByTagName(`ul`)[0];

    // Check if the <ul> exists
    if (!songsList) {
        console.error("Could not find .listsong or its <ul> element");
        return;
    }

    // Loop through the songs and add them to the list
    for (const song of songs) {
        // Replace %20 with spaces in the song name
        let songName = song.replace(/%20/, " ");

        // Add the song to the list as an <li> element
        songsList.innerHTML = songsList.innerHTML + `<li> 
            <img class="invert" src="playbtn.svg" alt=""> 
            <div class="songinfo">${songName}</div>
            <div class="playbtn">
                <span>Play Now</span>
                <img class="invert" src="play.svg" alt="">
            </div>
        </li>`;
    }

    // Add click event listeners to each <li> to play the song when clicked
    Array.from(document.querySelector(`.listsong`).getElementsByTagName('li')).forEach(li => {
        li.addEventListener(`click`, () => {
            // Get the song name from the .songinfo element
            let songName = li.querySelector(".songinfo").textContent.trim();
            console.log(`Selected song: ${songName}`); // Log the selected song
            playmusic(songName); // Play the selected song
        });
    });

    // Add click event listener to the play/pause button
    const playButton = document.getElementById('play'); // Select the play button by its ID
    if (playButton) {
        playButton.addEventListener('click', () => {
            if (currentAudio) { 
                if (currentAudio.paused) {
                    currentAudio.play();
                    play.src = 'pause.svg'  // Play the audio if it's paused
                    console.log('Resumed playing');
                } else {
                    currentAudio.pause();
                    play.src = 'play.svg' // Pause the audio if it's playing
                    console.log('Paused');
                }
            } else {
                console.log('No audio is currently loaded');
            }
        });
    } else {
        console.error('Play button not found');
    }
}

// Run the main function after the page is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    main();
});