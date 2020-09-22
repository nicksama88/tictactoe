const divGameBoard = document.querySelector("#gameBoard");
const startMod = document.querySelector("#modal-game-start");
const endMod = document.querySelector("#modal-game-end");
const message = document.querySelector("#message");
const winner = document.querySelector("#winner-text");

// player structs to track name and icon
const player = (name, icon, pColor) => {

    const getName = () => name;
    const getIcon = () => icon;
    const getColor = () => pColor;

    const setName = (newName) => {
        name = newName;
    };

    return {getName, getIcon, getColor, setName}

}

const gameBoard = (() => {

    // initialize board
    const boardArray = ['', '', '', '', '', '', '', '', ''];

    const clearBoard = () => {
        boardArray.forEach((part, index, tempArray) => {
            tempArray[index] = '';
        });
        let divNodeList = document.querySelectorAll(".gridBox");
        divNodeList.forEach(
            function(currentValue) {
                currentValue.textContent = "";
            }
        );
    };

    const getBoard = () => boardArray;

    const addIcon = (icon, index, playerColor) => {
        boardArray[index] = icon;
        let box = document.querySelector("#div" + index);
        box.textContent = icon;
        box.style.color = playerColor
    };

    const buildBoard = () => {
            boardArray.forEach((element, index) => {
                let gridBox = document.createElement("div");
                gridBox.setAttribute("id", "div" + index);
                gridBox.setAttribute("class", "gridBox");
                gridBox.textContent = element;
                divGameBoard.append(gridBox);
        });
    }
    return {clearBoard, getBoard, addIcon, buildBoard};

});

const game = (() => {

    // set default player values
    const player1 = player(document.querySelector("#input-p1").placeholder, "X", "red");
    const player2 = player(document.querySelector("#input-p2").placeholder, "O", "blue");
    let currentPlayer = player1;
    const board = gameBoard();

    const startGame = () => {

        // use entered names; but if blank keep default values
        let p1NameInput = document.querySelector("#input-p1").value;
        let p2NameInput = document.querySelector("#input-p2").value;
        if (p1NameInput !== "") {
            player1.setName(p1NameInput);
        }
        if (p2NameInput !== "") {
            player2.setName(p2NameInput);
        }

        message.textContent = currentPlayer.getName() + "'s turn (" + currentPlayer.getIcon() + ")";
        message.classList.add("red");
        startMod.style.display = "none";
        divGameBoard.style.display = "grid";
        board.buildBoard()
        
        // add event listeners for clicks to board
        const gridBoxArray = document.querySelectorAll(".gridBox");
        gridBoxArray.forEach(boxDiv => {
            boxDiv.addEventListener('click', function() {
                playRound("" + boxDiv.id);
            });
        });

    };

    const playRound = (gridID) => {

        let gridDiv = document.querySelector("#" + gridID);
        if (gridDiv.textContent !== "") {
            alert("space already taken, please choose another space");
        } else {
            gridDiv.textContent = currentPlayer.getIcon();
            board.addIcon(currentPlayer.getIcon(), gridID[gridID.length - 1], currentPlayer.getColor());

            if (checkForWinner()) {
                displayWinner(currentPlayer, currentPlayer === player1? "red":"blue");
            } else {
                if (checkForTie()) {
                    endMod.style.display = "grid";
                    winner.textContent = "Look's like a Tie...";
                }
            }
        
            switchPlayer();
            message.textContent = currentPlayer.getName() + "'s turn (" + currentPlayer.getIcon() + ")";
        };
    };

    const switchPlayer = () => {
        if (currentPlayer === player1) {
            currentPlayer = player2;
            message.classList.remove("red");
            message.classList.add("blue");
        } else {
            currentPlayer = player1;
            message.classList.remove("blue");
            message.classList.add("red");
        };
    };

    const checkForWinner = () => {

        // check all possible winning combinations
        let boardArray = board.getBoard();
        if (
            boardArray[0] !== "" && boardArray[0] === boardArray[1] && boardArray[0] === boardArray[2] ||
            boardArray[3] !== "" && boardArray[3] === boardArray[4] && boardArray[3] === boardArray[5] ||
            boardArray[6] !== "" && boardArray[6] === boardArray[7] && boardArray[6] === boardArray[8] ||
            boardArray[0] !== "" && boardArray[0] === boardArray[3] && boardArray[0] === boardArray[6] ||
            boardArray[1] !== "" && boardArray[1] === boardArray[4] && boardArray[1] === boardArray[7] ||
            boardArray[2] !== "" && boardArray[2] === boardArray[5] && boardArray[2] === boardArray[8] ||
            boardArray[0] !== "" && boardArray[0] === boardArray[4] && boardArray[0] === boardArray[8] ||
            boardArray[2] !== "" && boardArray[2] === boardArray[4] && boardArray[2] === boardArray[6]
        ) {
            return true;
        } else {
            return false;
        }
    };

    const checkForTie = () => {
        return !board.getBoard().includes("");
    }

    const displayWinner = (player, color) => {
        endMod.style.display = "grid";
        winner.textContent = player.getName() + " Wins!";
        winner.style.color = color;
    }

    const clearBoard = () => {
        board.clearBoard();
    }

    const resetGame = () => {
        board.clearBoard();
        endMod.style.display = "none";
    }

    return {startGame, resetGame};

});

const playGame = game();