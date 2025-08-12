import Room from "../Room/room.js";
import User from "../user/user.js";
import GameHistory from '../Game/GameHistory.js'
import mongoose from 'mongoose';
const game_id = '688f6801df83a7dcda18f4eb'
const ObjectId = mongoose.Types.ObjectId;
const Chess = {}
const EMPTY = ' ';


// function getBoard() {




//     let board = [
//         ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
//         ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
//         [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
//         [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
//         [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
//         [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
//         ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
//         ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
//     ];



//     return board
// }




// let board = getBoard()

let board = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];
Chess.getVisualBoard = () => {
    let board = [
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
    ];
    const whiteMap = {
        'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙'
    };
    const blackMap = {
        'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
    };


    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const visualBoard = [];


    for (let row = 0; row < 8; row++) {
        const rank = 8 - row;
        const rowArray = [];
        for (let col = 0; col < 8; col++) {
            let file = files[col];
            let cell = board[row][col];
            let piece = whiteMap[cell] || blackMap[cell] || ' ';


            let position
            if (whiteMap[cell]) {
                position = file.toUpperCase() + rank
            } else if (blackMap[cell]) {
                position = file.toLowerCase() + rank
            } else {
                position = file + rank
            }




            rowArray.push({ [position]: piece });
        }


        visualBoard.push(rowArray);
    }


    return visualBoard;
}






Chess.getPositions = (getData, socket) => {
    let allow = []
    let pos = getData.from.toLowerCase(), type = 'from', color = getData.color;
    let boardBackposition = [
        ['a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8'],
        ['a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7'],
        ['a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6'],
        ['a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5'],
        ['a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4'],
        ['a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3'],
        ['a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2'],
        ['a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1']
    ]




    try {


        let col = pos[0].toLowerCase().charCodeAt(0) - 97;
        let row = 8 - parseInt(pos[1]);


        //  notassign = bookedPositions(row, col, color)


        let notassign = []


        if (type == 'from') {


            if (board[row][col] == 'p') {
                allow = runPawns(row, col, color, notassign)
            } else if (board[row][col] == 'n') {
                allow = runknights(row, col, color, notassign)
            } else if (board[row][col] == 'b') {
                allow = runbishops(row, col, color, notassign)
            } else if (board[row][col] == 'q') {
                allow = runqueen(row, col, color, notassign)
            } else if (board[row][col] == 'k') {
                allow = kingRun(row, col, color, notassign)
            } else if (board[row][col] == 'r') {
                allow = rooksallowedMovess(row, col, color, notassign)
            } else if (board[row][col] == 'P') {
                allow = runPawns(row, col, color, notassign)
            } else if (board[row][col] == 'N') {
                allow = runknights(row, col, color, notassign)
            } else if (board[row][col] == 'B') {
                allow = runbishops(row, col, color, notassign)
            } else if (board[row][col] == 'Q') {
                allow = runqueen(row, col, color, notassign)
            }
            else if (board[row][col] == 'K') {
                allow = kingRun(row, col, color, notassign)
            }
            else if (board[row][col] == 'R') {
                allow = rooksallowedMovess(row, col, color, notassign)
            }


        }


        console.log("allow", allow);


        let positions = []
        if (allow != undefined) {


            for (let single of allow) {
                if (color == 'while') {
                    positions.push(boardBackposition[parseInt(single[0])][parseInt(single[1])].toUpperCase())
                } else {
                    positions.push(boardBackposition[parseInt(single[0])][parseInt(single[1])])
                }
            }
        }


        console.log("positions", positions);
        socket.emit('chess_pieces_position', positions)
        return positions
    } catch (err) {
        console.log(err);


    }
}




let allow;


let notassign = []
const parsePosition = (pos, type, color) => {
    try {


        //pos like a2,a5,h2.....
        let col = pos[0].toLowerCase().charCodeAt(0) - 97; // get col  // charCodeAt returns the Unicode of the character at a specified index


        let row = 8 - parseInt(pos[1]);


        // chack board in book positions
        notassign = bookedPositions(row, col, color)


        // get old position / from to next all runing possitions
        if (type == 'from') {
            if (board[row][col] == 'p') {
                allow = runPawns(row, col, color, notassign)
            } else if (board[row][col] == 'n') {
                allow = runknights(row, col, color, notassign)
            } else if (board[row][col] == 'b') {
                allow = runbishops(row, col, color, notassign)
            }
            else if (board[row][col] == 'q') {
                allow = runqueen(row, col, color, notassign)
            }
            else if (board[row][col] == 'k') {
                allow = kingRun(row, col, color, notassign)


            }


            else if (board[row][col] == 'r') {
                allow = rooksallowedMovess(row, col, color, notassign)


            }


            else if (board[row][col] == 'P') {
                allow = runPawns(row, col, color, notassign)
            } else if (board[row][col] == 'N') {
                allow = runknights(row, col, color, notassign)
            } else if (board[row][col] == 'B') {
                allow = runbishops(row, col, color, notassign)
            }
            else if (board[row][col] == 'Q') {
                allow = runqueen(row, col, color, notassign)
            }
            else if (board[row][col] == 'K') {
                allow = kingRun(row, col, color, notassign)


            }
            else if (board[row][col] == 'R') {
                allow = rooksallowedMovess(row, col, color, notassign)


            }


        }




        // check new position are allow are not
        if (type == 'to') {
            if (notassign.length) {
                let index = notassign.indexOf(`${row}${col}`)
                console.log("index...v", index);


                if (index != -1) {
                    notassign.splice(index, 1)


                }
            }
            console.log("from__allow........", allow, allow?.indexOf(`${row}${col}`));


            if (allow?.indexOf(`${row}${col}`) == -1 || allow == undefined) {
                return [null, null]
            }
        }


        return { xy: [row, col], allow };
    } catch (err) {
        console.log(err);


    }
}


const bookedPositions = (row, col, color) => {
    let nearPos = [
        [{ x: 0 }, { y: - 1 }],
        [{ x: - 1 }, { y: - 1 }],
        [{ x: - 1 }, { y: 0 }],
        [{ x: - 1 }, { y: 1 }],
        [{ x: 0 }, { y: + 1 }],
        [{ x: 1 }, { y: + 1 }],
        [{ x: 1 }, { y: 0 }],
        [{ x: + 1 }, { y: - 1 }]
    ]


    for (let singlePos of nearPos) {
        row = row + singlePos[0].x
        col = col + singlePos[1].y


        if (row < 0 || col < 0) {
            continue
        }


        let boardValue = board[row][col]


        if (boardValue != EMPTY && boardValue != undefined) {


            if (boardValue == boardValue?.toLowerCase() && color == 'black') {
                continue
            } else if (boardValue == boardValue?.toUpperCase() && color == 'white') {
                continue


            }


            notassign.push(`${row}${col}`)
        }
    }


    return notassign
}
const move = (from, to, color) => {
    let data = {}
    let fromData = parsePosition(from, 'from', color);
    let toData = parsePosition(to, 'to', color);
    console.log("toData", toData);


    if (toData?.xy != null) {


        let [fx, fy] = fromData?.xy
        let [tx, ty] = toData?.xy


        data = {
            moves: toData.allow,
            from,
            to,


        }






        const piece = board[fx][fy]; // check old position and pices from board


        if (!piece || piece === EMPTY) return false;




        if (board[tx] == null || board[tx] == null) return false




        // assign new positions
        board[tx][ty] = piece;
        board[fx][fy] = EMPTY;






        return true;
    }


    return false


}


const pawnsState = {
    white: {
        "60": { moved: true },
        "61": { moved: true },
        "62": { moved: true },
        "63": { moved: true },
        "64": { moved: true },
        "65": { moved: true },
        "66": { moved: true },
        "67": { moved: true },
    },
    black: {
        "10": { moved: true },
        "11": { moved: true },
        "12": { moved: true },
        "13": { moved: true },
        "14": { moved: true },
        "15": { moved: true },
        "16": { moved: true },
        "17": { moved: true },
    }
};
const runPawns = (position_i, position_j, color, notassign) => {
    console.log("notassign", notassign);


    if (typeof notassign == 'undefined') {
        notassign = []
    }
    let interval1ts = pawnsState[color][`${position_i}${position_j}`]?.moved ? pawnsState[color][`${position_i}${position_j}`]?.moved : false
    let num = 8;
    let allowedMoves = [];


    try {
        let dir = color === 'white' ? -1 : 1;
        let startRow = color === 'white' ? 6 : 1;


        let i1 = position_i + dir;
        if (i1 >= 0 && i1 < num) {
            if (notassign.indexOf(`${i1}${position_j}`) == -1) {
                allowedMoves.push(`${i1}${position_j}`);


                const right = board[i1][parseInt(position_j) + 1];


                if (color == 'white') {
                    if (right != EMPTY && right != undefined) {
                        if (right == right.toLowerCase()) {
                            allowedMoves.push(`${i1}${parseInt(position_j) + 1}`);
                        }
                    }


                    const left = board[i1][parseInt(position_j) - 1];
                    if (left != EMPTY && left != undefined) {
                        if (left == left.toLowerCase()) {
                            allowedMoves.push(`${i1}${parseInt(position_j) - 1}`);
                        }


                    }
                } else {




                    if (right != EMPTY && right != undefined) {
                        if (right == right.toUpperCase()) {
                            allowedMoves.push(`${i1}${parseInt(position_j) + 1}`);
                        }
                    }


                    const left = board[i1][parseInt(position_j) - 1];
                    if (left != EMPTY && left != undefined) {
                        if (left == left.toUpperCase()) {
                            allowedMoves.push(`${i1}${parseInt(position_j) - 1}`);
                        }


                    }


                }


            }
        }


        console.log("allowedMoves", allowedMoves);




        if (interval1ts && position_i === startRow) {
            let i2 = position_i + 2 * dir;
            if (i2 >= 0 && i2 < num) {
                if (notassign.indexOf(`${i2}${position_j}`) == -1) {
                    allowedMoves.push(`${i2}${position_j}`);


                }
            }
        }




        return allowedMoves;
    } catch (err) {
        console.log("Error:", err);
        return [];
    }
};


const runknights = (position_i, position_j, color) => {
    let num = 8;
    try {


        console.log('position_i', position_i);
        console.log('position_j', position_j);




        let allowedMoves = [], str = ''
        for (let i = 0; i < num; i++) {
            for (let j = 0; j < num; j++) {
                let value = board[i][j]
                if (value != EMPTY && value != undefined && (value == value.toUpperCase() && color == 'white')) {
                    continue
                }
                else if (value != EMPTY && value != undefined && (value == value.toLowerCase() && color == 'black')) {
                    continue


                }




                if ((i <= (position_i + 2) && j <= (position_j + 2)) || (i <= (position_i - 2) && j <= (position_j - 2))) {


                    if (i == (position_i + 2) && ((j == position_j - 1) || j == position_j + 1)) {
                        str += `${i}${j},`
                        allowedMoves.push(`${i}${j}`)
                    } else if (j == (position_j + 2) && ((i == position_i - 1) || i == position_i + 1)) {
                        str += `${i}${j},`
                        allowedMoves.push(`${i}${j}`)


                    } else if (i == (position_i - 2) && ((j == position_j + 1) || j == position_j - 1)) {
                        str += `${i}${j},`
                        allowedMoves.push(`${i}${j}`)


                    } else if (j == (position_j - 2) && ((i == position_i + 1) || i == position_i - 1)) {
                        str += `${i}${j},`
                        allowedMoves.push(`${i}${j}`)


                    }
                    else {
                        str += '  ,'
                    }
                } else {




                    // allowedMoves.push(`${i}${j},`)
                    str += '  ,'
                }
            }
            str += '\n'
        }


        // console.log(allowedMoves);
        console.log(str);






        return allowedMoves
    } catch (err) {
        console.log(err);
    }
}


const kingRun = (position_i, position_j, color) => {
    let num = 8;
    try {




        console.log('position_i', position_i);
        console.log('position_j', position_j);




        let allowedMoves = [], str = ''
        for (let i = 0; i < num; i++) {
            for (let j = 0; j < num; j++) {
                let value = board[i][j]


                if (value != EMPTY && value != undefined && (value == value.toUpperCase() && color == 'white')) {
                    continue
                }
                else if (value != EMPTY && value != undefined && (value == value.toLowerCase() && color == 'black')) {
                    continue


                }








                if (i == position_i && j == position_j) {
                    str += `${i}${j},`
                    allowedMoves.push(`${i}${j}`)
                }


                else if ((i <= position_i + 1) && (j >= position_j - 1) && (j <= position_j + 1) && (i >= position_i - 1)) {
                    str += `${i}${j},`
                    allowedMoves.push(`${i}${j}`)
                }
                else {
                    str += `  ,`
                }
            }
            str += '\n'
        }
        console.log(allowedMoves);
        console.log(str);




        return allowedMoves
    } catch (err) {
        console.log(err);


    }
}


const runqueen = (position_i, position_j, color) => {
    const num = 8;
    const allowedMovess = [];


    const isSameColor = (piece) => {
        return (color === 'white' && piece === piece.toUpperCase()) ||
            (color === 'black' && piece === piece.toLowerCase());
    };


    const isOpponent = (piece) => {
        return (color === 'white' && piece === piece.toLowerCase()) ||
            (color === 'black' && piece === piece.toUpperCase());
    };


    // Directions rotated 90 degrees clockwise
    const directions = [
        [0, +1],   // up → right
        [+1, 0],   // right → down
        [0, -1],   // down → left
        [-1, 0],   // left → up
        [-1, +1],  // ↖ → ↗
        [+1, +1],  // ↗ → ↘
        [+1, -1],  // ↘ → ↙
        [-1, -1]   // ↙ → ↖
    ];


    for (const [dx, dy] of directions) {
        let i = position_i + dx;
        let j = position_j + dy;


        while (i >= 0 && i < num && j >= 0 && j < num) {
            const piece = board[i][j];


            if (piece === EMPTY) {
                allowedMovess.push(`${i}${j}`);
            } else if (isOpponent(piece)) {
                allowedMovess.push(`${i}${j}`);
                break;
            } else if (isSameColor(piece)) {
                break;
            }


            i += dx;
            j += dy;
        }
    }


    return allowedMovess;
};




const runbishops = (position_i, position_j, color) => {
    const num = 8;
    const allowedMovess = [];


    const isSameColor = (piece) => {
        if (piece === EMPTY || piece === undefined) return false;
        return (color === 'white' && piece === piece.toUpperCase()) ||
            (color === 'black' && piece === piece.toLowerCase());
    }


    const isOpponent = (piece) => {
        if (piece === EMPTY || piece === undefined) return false;
        return (color === 'white' && piece === piece.toLowerCase()) ||
            (color === 'black' && piece === piece.toUpperCase());
    }


    const directions = [
        [-1, +1], // ↗ Up-Right
        [-1, -1], // ↖ Up-Left
        [+1, +1], // ↘ Down-Right
        [+1, -1]  // ↙ Down-Left
    ];


    for (const [dx, dy] of directions) {
        let i = position_i + dx;
        let j = position_j + dy;


        while (i >= 0 && i < num && j >= 0 && j < num) {
            const piece = board[i][j];


            if (piece === EMPTY) {
                allowedMovess.push(`${i}${j}`);
            } else if (isOpponent(piece)) {
                allowedMovess.push(`${i}${j}`);
                break;
            } else if (isSameColor(piece)) {
                break;
            }


            i += dx;
            j += dy;
        }
    }


    return allowedMovess;
}
const rooksallowedMovess = (position_i, position_j, color) => {
    const num = 8;
    const allowedMoves = [];


    const isOpponent = (piece) => {
        if (piece === EMPTY || piece === undefined) return false;
        return (color === 'white' && piece === piece.toLowerCase()) ||
            (color === 'black' && piece === piece.toUpperCase());
    }


    // Move Up
    for (let i = position_i - 1; i >= 0; i--) {
        const piece = board[i][position_j];
        if (piece === EMPTY) {
            allowedMoves.push(`${i}${position_j}`);
        } else {
            if (isOpponent(piece)) allowedMoves.push(`${i}${position_j}`);
            break;
        }
    }


    // Move Down
    for (let i = position_i + 1; i < num; i++) {
        const piece = board[i][position_j];
        if (piece === EMPTY) {
            allowedMoves.push(`${i}${position_j}`);
        } else {
            if (isOpponent(piece)) allowedMoves.push(`${i}${position_j}`);
            break;
        }
    }


    // Move Left
    for (let j = position_j - 1; j >= 0; j--) {
        const piece = board[position_i][j];
        if (piece === EMPTY) {
            allowedMoves.push(`${position_i}${j}`);
        } else {
            if (isOpponent(piece)) allowedMoves.push(`${position_i}${j}`);
            break;
        }
    }


    // Move Right
    for (let j = position_j + 1; j < num; j++) {
        const piece = board[position_i][j];
        if (piece === EMPTY) {
            allowedMoves.push(`${position_i}${j}`);
        } else {
            if (isOpponent(piece)) allowedMoves.push(`${position_i}${j}`);
            break;
        }
    }


    return allowedMoves;
}


// You must define and share these between sockets
let nextPlay = 'white'; // Global turn tracker (ideally per room)

// Main function
// Chess.chessGamePlay = async (requestData, socket, io) => {
//     try {
//         const { roomId, userId, from, to } = requestData;

//         const room = await Room.findById(roomId);
//         if (!room) {
//             socket.emit('error', 'Room not found');
//             return;
//         }

//         const userIdStr = userId.toString();
//         let playerColor = null;

//         if (room.seatings['1']?.toString() === userIdStr) playerColor = 'white';
//         else if (room.seatings['2']?.toString() === userIdStr) playerColor = 'black';
//         else {
//             socket.emit('error', 'Player not in room');
//             return;
//         }

//         if (playerColor !== nextPlay) {
//             socket.emit('error', `It's not ${playerColor}'s turn.`);
//             return;
//         }

//         // Validate move format
//         if (!from || !to || from.length < 2 || to.length < 2) {
//             socket.emit('error', 'Invalid move input.');
//             return;
//         }

//         // ✅ Perform the move
//         const success = move(from.toLowerCase(), to.toLowerCase(), playerColor);

//         if (!success) {
//             socket.emit('error', 'Illegal move.');
//             return;
//         }

//         // 🧠 Update board and switch turn
//         const updatedBoard = await getVisualBoard();
//         nextPlay = (playerColor === 'white') ? 'black' : 'white';

//         // 🟢 Broadcast to both players
//         io.to(roomId.toString()).emit('opponent_move', {
//             board: updatedBoard,
//             nextPlay: nextPlay,
//             lastMove: { from, to },
//             movedBy: playerColor,
//         });

//     } catch (err) {
//         console.error("❌ Error in chessGamePlay:", err.message);
//         socket.emit('error', 'Server error');
//     }
// };

Chess.chessGamePlay = async (requestData, socket, io, callback) => {
    let response = {
        message: '',
        status: 0
    }
    try {
        console.log("requestDatarequestDatarequestDatarequestData", requestData);
        let roomid = requestData?.roomid
        let playerColor = null;
        response.roomid = roomid
        const room = await Room.findOne({ _id: ObjectId(roomid) }).populate('currentgamehistory');
        if (!room) {
            return callback({ status: 0, message: 'Room not found' });
        }
        const userIdStr = requestData.userid;
        if (room.users[0]?.toString() === userIdStr) playerColor = 'white';
        else if (room.users[1]?.toString() === userIdStr) playerColor = 'black';
        else { return callback({ status: 0, message: 'Player not in room' }); }
        let from = requestData.from, to = requestData.to; console.log("playerColorplayerColorplayerColor", playerColor);
        if (playerColor !== 'white' && playerColor !== 'black') {
            socket.emit('error', 'Invalid player color.'); return;
        }
        console.log("11111111111");
        console.log("playerColor", playerColor, nextPlay);
        // Check if it's the correct player's turn 
        if (playerColor !== nextPlay) {
            socket.emit('error', `It's not ${playerColor}'s turn.`); return;
        }
        // Validate move format 
        if (!from || !to || from.length !== 2 || to.length !== 2) {
            socket.emit('error', 'Invalid move input.'); return;
        }
        // chess pieces change position / move / play 
        const success = move(from.toLowerCase(), to.toLowerCase(), playerColor);
        if (success) {
            let newBoard = await getVisualBoard(roomid); // get board / updated board
            nextPlay = (playerColor === 'white') ? 'black' : 'white'; response.nextPlay = nextPlay
            response.status = 1
            // socket.emit('board', { board: newBoard, playerColor: nextPlay }); 
            io.to(roomid).emit('board', { board: newBoard, playerColor: nextPlay });
        } else {
            socket.emit('error', 'Illegal move.');
        }
        return callback(response)
    } catch (err) {
        console.log("err", err);
    }
}



Chess.chessPlayerConnect = async (reqData, socket, io) => {
    let response = { status: 0 };

    try {
        console.log("reqdaata", reqData);

        const user = await User.findById(reqData.id);
        if (!user) {
            response.message = 'User not found';
            return response;
        }


        user.current_game = game_id;
        await user.save();

        // ✅ Step 1: Try to find a room with only 1 player and "waiting" status

        let room = null

        console.log("reqData?.roomid != null && reqData?.roomid != 'undefined' && reqData?.roomid != undefined",reqData?.roomid,reqData?.roomid != null , reqData?.roomid != 'undefined' , reqData?.roomid != undefined);
        
        if (reqData?.roomid != null && reqData?.roomid != 'undefined' && reqData?.roomid != undefined) {
          room = await Room.findOne({ _id: reqData?.roomid });
           
            console.log("room",room);
            
        }
        console.log("roomroomroom11111",room);
        
        if(room == null){

            let rooms = await Room.find({
                $expr: { $lte: [{ $size: "$users" }, 2] }
            });

            for (let singleRoom of rooms) {
                if (singleRoom.users.length < 2 && singleRoom.users.indexOf(user.id.toString()) == -1) {
                    
                    singleRoom.users.push(user.id)
                    if (!singleRoom.seatings['1']) {
                        singleRoom.seatings['1'] = user.id.toString();
                    } else if (!singleRoom.seatings['2']) {
                        singleRoom.seatings['2'] = user.id.toString();
                    }
                    singleRoom.markModified('seatings');
                    singleRoom.gameStatus = 'in-progress';
                    await singleRoom.save();
                    
                    room = singleRoom
                    break
                }
            }
        }
        console.log("roomroomroom2222",room);

        if (room == null) {


            // ✅ Step 2: No room found => create a new one
            room = await Room.create({
                seatings: { 1: user.id.toString(), 2: "" },
                users: [user.id.toString()],
                maxPlayer: 2,
                roundCount: 0,
                gameStatus: 'waiting'
            });



            socket.join(room._id.toString());

            socket.emit('waitingForOpponent', {
                message: 'Waiting for opponent...',
                roomId: room._id
            });

            response.roomid = room._id.toString();
            response.status = 1;
        }
        else if (room._id) {
            socket.join(room._id.toString());

            // Notify both players (optional)
            io.to(room._id.toString()).emit('gameStarted', {
                message: 'Game started',
                roomId: room._id,
                players: room.users
            });

            response.roomid = room._id.toString();
            response.status = 1;

        }








        if (room.users.length === 2 && !room?.currentgamehistory ) {
            let gameHistory = await GameHistory.create({
                total_betting: 0,
                total_winning: 0,
                jackpot: 0,
            });
            if (gameHistory) {
                room.currentgamehistory = gameHistory.id; await room.save()
            }
            response.waiting = false;
            response.message = 'Both players connected. Game starting...';
        } else if (room.users.length === 1) {
            response.waiting = true;
            response.message = 'Waiting for opponent to join...';
        }


        io.in(room._id.toString()).emit('roominfo', response);
        return response;

    } catch (err) {
        console.log("Err", err);

        console.error("❌ Error in chessPlayerConnect:", err.message);
        response.message = "Internal server error";
        return response;
    }
};




const gamelist = async (reqData, socket) => {
    let response = {
        message: "",
        status: 0
    }
    try {


        let filter = {
            softdelete: false,
            status: true
        }
        let resp = await GameVariant.find(filter)


        response.list = resp
        response.status = 1
    } catch (err) {
        response.status = 0
        response.list = []
    }
    return response
}


export default Chess