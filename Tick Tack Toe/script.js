console.log('Running');

let turn = "X";
let isgameover = false;

// Function to change turns between X and O
const changeturn = () => {
    return turn === "X" ? "O" : "X";
}

// Function to check win conditions
const checkwin = () => {
    let boxtxts = document.querySelectorAll('.boxtxt');
    let wins = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    
    for (let win of wins) {
        if (boxtxts[win[0]].innerText && 
            boxtxts[win[0]].innerText === boxtxts[win[1]].innerText && 
            boxtxts[win[0]].innerText === boxtxts[win[2]].innerText) {
            
            document.querySelector('.turntext').textContent = `${boxtxts[win[0]].innerText} Wins!`;
            isgameover = true;
            
            // Highlight winning boxes
            win.forEach(index => {
                boxtxts[index].parentElement.classList.add('winner');
            });
            
            return true;
        }
    }
    
    // Check for draw
    let isDraw = true;
    boxtxts.forEach(box => {
        if (box.innerText === '') {
            isDraw = false;
        }
    });
    
    if (isDraw && !isgameover) {
        document.querySelector('.turntext').textContent = "Game Draw!";
        isgameover = true;
        return true;
    }
    
    return false;
}

// Function to reset the game
const resetGame = () => {
    document.querySelectorAll('.boxtxt').forEach(box => {
        box.innerText = '';
        box.parentElement.classList.remove('winner');
    });
    turn = "X";
    isgameover = false;
    document.querySelector('.turntext').textContent = "Turn for X";
}

// Add event listeners
document.addEventListener('DOMContentLoaded', () => {
    let boxes = document.querySelectorAll(".box");
    
    Array.from(boxes).forEach((element) => {
        let boxtxt = element.querySelector(".boxtxt");
        
        element.addEventListener('click', () => {
            if(boxtxt.innerText === '' && !isgameover) {
                boxtxt.innerText = turn;
                if (!checkwin()) {
                    turn = changeturn();
                    document.querySelector('.turntext').textContent = `Turn for ${turn}`;
                }
            }
        });
    });
    
    document.getElementById('reset-btn').addEventListener('click', resetGame);
});