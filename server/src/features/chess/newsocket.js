// import Chesspuzzle from "../models/ChessBoardPuzzle";
//  import GameHistory from "../models/GameHistory";
//   import Room from "../models/Room";
// import User from "../models/User";
// import PlayingData from '../models/PlayingData'
//  import GameVariant from "../models/GameVariants";
//   import ChessMoveHistory from '../models/ChessMovesHistory'
//    const ObjectId = require('mongoose').Types.ObjectId;
// const chess_game_id = '68885e04fc254dc8340ace86'; const EMPTY = ' ';
// let board = [
//     ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
//     ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
//     [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY], [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY], [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY], [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY], ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
//     ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
// ];
// const getBoard = async (roomid) => {
//     let response = {
//         message: '',
//         status: 0
//     }
//     try {
//         console.log("roomid", roomid);
//         const room = await Room.findOne(
//             { _id: ObjectId(roomid) },
//             { currentgamehistory: 1 }
//         ).populate({
//             path: 'currentgamehistory',
//             select: { chessboard: 1 },
//             populate: {
//                 path: 'chessboard',
//                 model: 'Chesspuzzle',
//                 select: { board: 1, status: 1, softdelete: 1 }
//             }
//         });
//         console.log("room", room);
//         if (!room) {
//             response.message = 'room not found'
//             response.status = 0
//             return response
//         } else {
//             if (room?.currentgamehistory?.chessboard?.status == true && room?.currentgamehistory?.chessboard?.softdelete == false) {
//                 board = room.currentgamehistory.chessboard.board  response.board =
//                     room.currentgamehistory.chessboard.board
//                 response.status = 1
//             } else {
//                 response.message = 'chess board not found'  response.status = 0
//             }
//         }
//         return response
//     } catch (err) {
//         console.log("err", err);
//         return response
//     }
// }
// const getVisualBoard = async () => {
//     console.log("board........v..........board........v........v", board);
//     const whiteMap = {
//         'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙'
//     };
//     const blackMap = {
//         'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
//     };
//     const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']; const visualBoard = [];
//     for (let row = 0; row < 8; row++) {
//         const rank = 8 - row;
//         const rowArray = [];
//         for (let col = 0; col < 8; col++) {
//             let file = files[col];
//             let cell = board[row][col];
//             let piece = whiteMap[cell] || blackMap[cell] || ' ';
//             let position
//             if (whiteMap[cell]) {
//                 position = file.toUpperCase() + rank
//             } else if (blackMap[cell]) {
//                 position = file.toLowerCase() + rank
//             } else {
//                 position = file + rank
//             }
//             rowArray.push({ [position]: piece });
//         }
//         visualBoard.push(rowArray);
//     }
//     return visualBoard;
// }
// const getPositions = (getData, socket) => {
//     let allow = []
//     let pos = getData.from.toLowerCase(), type = 'from', color = getData.color;
//     let boardBackposition = [
//         ['a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8'], ['a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7'], ['a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6'], ['a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5'], ['a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4'], ['a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3'], ['a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2'], ['a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1']
//     ]
//     try {
//         let col = pos[0].toLowerCase().charCodeAt(0) - 97; let row = 8 - parseInt(pos[1]);
//         // notassign = bookedPositions(row, col, color)  let notassign = [] 
//         if (type == 'from') {
//             if (board[row][col] == 'p') {
//                 allow = runPawns(row, col, color, notassign)
//             } else if (board[row][col] == 'n') {
//                 allow = runknights(row, col, color, notassign)
//             } else if (board[row][col] == 'b') {
//                 allow = runbishops(row, col, color, notassign)
//             } else if (board[row][col] == 'q') {
//                 allow = runqueen(row, col, color, notassign)
//             } else if (board[row][col] == 'k') {
//                 allow = kingRun(row, col, color, notassign)
//             } else if (board[row][col] == 'r') {
//                 allow = rooksallowedMovess(row, col, color, notassign)
//             } else if (board[row][col] == 'P') {
//                 allow = runPawns(row, col, color, notassign)
//             } else if (board[row][col] == 'N') {
//                 allow = runknights(row, col, color, notassign)
//             } else if (board[row][col] == 'B') {
//                 allow = runbishops(row, col, color, notassign)
//             } else if (board[row][col] == 'Q') {
//                 allow = runqueen(row, col, color, notassign)
//             }
//             else if (board[row][col] == 'K') {
//                 allow = kingRun(row, col, color, notassign)
//             }
//             else if (board[row][col] == 'R') {
//                 allow = rooksallowedMovess(row, col, color, notassign)
//             }
//         }
//         console.log("allow", allow);
//         if (socket) {
//             let positions = []
//             if (allow != undefined) {
//                 for (let single of allow) {
//                     if (color == 'while') {

//                         positions.push(boardBackposition[parseInt(single[0])][parseInt(single[1])].toUpperCase())
//                     } else {

//                         positions.push(boardBackposition[parseInt(single[0])][parseInt(single[1])])
//                     }
//                 }
//             }
//             console.log("positions", positions);
//             socket.emit('chess_pieces_position', positions)  return positions
//         } else {
//             return allow
//         }
//     } catch (err) {
//         console.log(err);
//     }
// }
// let allow;
// let notassign = []
// const parsePosition = (pos, type, color) => {
//     try {
//         //pos like position a2,a5,h2..... 
//         let col = pos[0].toLowerCase().charCodeAt(0) - 97; // get col  // charCodeAt returns the Unicode of the character at a specified index 
//         let row = 8 - parseInt(pos[1]);
//         // chack board in book positions 
//         notassign = bookedPositions(row, col, color)
//         console.log("boardboardboardboardboardboardboardboardboard", board);
//         // get old position / from to next all runing possitions  if (type == 'from') { 
//         if (board[row][col] == 'p') {
//             allow = runPawns(row, col, color, notassign)
//         } else if (board[row][col] == 'n') {
//             allow = runknights(row, col, color, notassign)
//         } else if (board[row][col] == 'b') {
//             allow = runbishops(row, col, color, notassign)
//         } else if (board[row][col] == 'q') {
//             allow = runqueen(row, col, color, notassign)
//         } else if (board[row][col] == 'k') {
//             allow = kingRun(row, col, color, notassign)
//         } else if (board[row][col] == 'r') {
//             allow = rooksallowedMovess(row, col, color, notassign)
//         } else if (board[row][col] == 'P') {
//             allow = runPawns(row, col, color, notassign)
//         } else if (board[row][col] == 'N') {
//             allow = runknights(row, col, color, notassign)
//         } else if (board[row][col] == 'B') {
//             allow = runbishops(row, col, color, notassign)
//         } else if (board[row][col] == 'Q') {
//             allow = runqueen(row, col, color, notassign)
//         } else if (board[row][col] == 'K') {
//             allow = kingRun(row, col, color, notassign)
//         } else if (board[row][col] == 'R') {
//             allow = rooksallowedMovess(row, col, color, notassign)
//         }
//     }
//  // check new position are allow are not 
//  if (type == 'to') {
//         if (notassign.length) {
//             let index = notassign.indexOf(`${row}${col}`)  console.log("index...v", index);
//             if (index != -1) {
//                 notassign.splice(index, 1)
//             }
//         }
//         console.log("from__allow........", allow, allow?.indexOf(`${row}${col}`));
//         if (allow?.indexOf(`${row}${col}`) == -1 || allow == undefined) {
//             return [null, null]
//         }
//     }
//     return { xy: [row, col], allow };
// } catch (err) {
//     console.log(err);
// } 
// }
// const bookedPositions = (row, col, color) => {
//     let nearPos = [
//         [{ x: 0 }, { y: - 1 }],
//         [{ x: - 1 }, { y: - 1 }],
//         [{ x: - 1 }, { y: 0 }],
//         [{ x: - 1 }, { y: 1 }],
//         [{ x: 0 }, { y: + 1 }],
//         [{ x: 1 }, { y: + 1 }],
//         [{ x: 1 }, { y: 0 }],
//         [{ x: + 1 }, { y: - 1 }]
//     ]
//     for (let singlePos of nearPos) {
//         row = row + singlePos[0].x
//         col = col + singlePos[1].y
//         if (row < 0 || col < 0) {
//             continue
//         }
//         let boardValue = board[row][col]
//         if (boardValue != EMPTY && boardValue != undefined) {
//             if (boardValue == boardValue?.toLowerCase() && color == 'black') {
//                 continue
//             } else if (boardValue == boardValue?.toUpperCase() && color == 'white') {
//                 continue
//             }
//             notassign.push(`${row}${col}`)
//         }
//     }
//     return notassign
// }
// const move = (from, to, color) => {
//     let data = {}
//     let fromData = parsePosition(from, 'from', color); let toData = parsePosition(to, 'to', color);
//     if (toData?.xy != null) {
//         let [fx, fy] = fromData?.xy
//         let [tx, ty] = toData?.xy
//         data = {
//             moves: toData.allow,
//             from,
//             to,
//         }
//         const piece = board[fx][fy]; // check old position and pices from board 
//         if (!piece || piece === EMPTY) return false;
//         if (board[tx] == null || board[tx] == null) return false
//         // assign new positions 
//         board[tx][ty] = piece;
//         board[fx][fy] = EMPTY;
//         return true;
//     }
//     return false
// }
// const pawnsState = {
//     white: {
//         "60": { moved: true },
//         "61": { moved: true },
//         "62": { moved: true },
//         "63": { moved: true },
//         "64": { moved: true },
//         "65": { moved: true },
//         "66": { moved: true },
//         "67": { moved: true },
//     },
//     black: {
//         "10": { moved: true },
//         "11": { moved: true },
//         "12": { moved: true },
//         "13": { moved: true },
//         "14": { moved: true },
//         "15": { moved: true },
//         "16": { moved: true },
//         "17": { moved: true },
//     }
// };
// const runPawns = (position_i, position_j, color, notassign) => {
//     console.log("notassign", notassign);
//     if (typeof notassign == 'undefined') {
//         notassign = []
//     }
//     let interval1ts =
//         pawnsState[color][`${position_i}${position_j}`]?.moved ? pawnsState[color][`${position_i}${position_j}`]?.moved : false  let num = 8;
//     let allowedMoves = [];
//     try {
//         let dir = color === 'white' ? -1 : 1;
//         let startRow = color === 'white' ? 6 : 1;
//         let i1 = position_i + dir;
//         if (i1 >= 0 && i1 < num) {
//             if (notassign.indexOf(`${i1}${position_j}`) == -1) {
//                 allowedMoves.push(`${i1}${position_j}`);
//                 const right = board[i1][parseInt(position_j) + 1];
//                 if (color == 'white') {
//                     if (right != EMPTY && right != undefined) {
//                         if (right == right.toLowerCase()) {
//                             allowedMoves.push(`${i1}${parseInt(position_j) + 1}`);
//                         }
//                     }
//                     const left = board[i1][parseInt(position_j) - 1]; if (left != EMPTY && left != undefined) {
//                         if (left == left.toLowerCase()) {
//                             allowedMoves.push(`${i1}${parseInt(position_j) - 1}`);
//                         }
//                     }
//                 } else {
//                     if (right != EMPTY && right != undefined) {
//                         if (right == right.toUpperCase()) {
//                             allowedMoves.push(`${i1}${parseInt(position_j) + 1}`);
//                         }
//                     }
//                     const left = board[i1][parseInt(position_j) - 1]; if (left != EMPTY && left != undefined) {
//                         if (left == left.toUpperCase()) {
//                             allowedMoves.push(`${i1}${parseInt(position_j) - 1}`);
//                         }
//                     }
//                 }
//             }
//         }
//         console.log("allowedMoves", allowedMoves);
//         if (interval1ts && position_i === startRow) {
//             let i2 = position_i + 2 * dir;
//             if (i2 >= 0 && i2 < num) {
//                 if (notassign.indexOf(`${i2}${position_j}`) == -1) {
//                     allowedMoves.push(`${i2}${position_j}`);
//                 }
//             }
//         }
//         return allowedMoves;
//     } catch (err) {
//         console.log("Error:", err);
//         return [];
//     }
// };
// const runknights = (position_i, position_j, color) => {
//     let num = 8;
//     try {
//         console.log('position_i', position_i);
//         console.log('position_j', position_j);
//         let allowedMoves = [], str = ''
//         for (let i = 0; i < num; i++) {
//             for (let j = 0; j < num; j++) {
//                 let value = board[i][j]
//                 if (value != EMPTY && value != undefined && (value == value.toUpperCase() && color == 'white')) {
//                     continue
//                 }
//                 else if (value != EMPTY && value != undefined && (value == value.toLowerCase() && color == 'black')) {
//                     continue
//                 }
//                 if ((i <= (position_i + 2) && j <= (position_j + 2)) || (i <= (position_i - 2) && j <= (position_j - 2))) {
//                     if (i == (position_i + 2) && ((j == position_j - 1) || j == position_j + 1)) {
//                         str += `${i}${j},`
//                         allowedMoves.push(`${i}${j}`)
//                     } else if (j == (position_j + 2) && ((i == position_i - 1) || i == position_i + 1)) {
//                         str += `${i}${j},`
//                         allowedMoves.push(`${i}${j}`)
//                     } else if (i == (position_i - 2) && ((j == position_j + 1) || j == position_j - 1)) {
//                         str += `${i}${j},`
//                         allowedMoves.push(`${i}${j}`)
//                     } else if (j == (position_j - 2) && ((i == position_i + 1) || i == position_i - 1)) {
//                         str += `${i}${j},`
//                         allowedMoves.push(`${i}${j}`)
//                     }
//                     else {
//                         str += ' ,'
//                     }
//                 } else {
//                     // allowedMoves.push(`${i}${j},`)  str += ' ,' 
//                 }
//             }
//             str += '\n'
//         }
//         // console.log(allowedMoves); 
//         console.log(str);
//         return allowedMoves
//     } catch (err) {
//         console.log(err);
//     }
// }
// // const runbishops = (position_i, position_j, color) => { // let num = 8; 
// // try { 
// // console.log('position_i', position_i); 
// // console.log('position_j', position_j); 
// // let str = '', allowedMovess = [], add = position_i + position_j, sub = position_i - position_j 
// // for (let i = 0; i < num; i++) { 
// // for (let j = 0; j < num; j++) { 
// // let value = board[i][j] 
// // if (value != EMPTY && value != undefined && (value == value.toUpperCase() && color == 'white')) { 
// // continue 
// // } 
// // else if (value != EMPTY && value != undefined && (value == value.toLowerCase() && color == 'black')) { // continue 
// // }
// // if ((i + j == add)) { 
// // str += `${i}${j},` 
// // allowedMovess.push(`${i}${j}`) // } 
// // else if ((i >= position_i + 1) && j >= position_j + 1) { 
// // str += `${i}${j},` 
// // allowedMovess.push(`${i}${j}`) 
// // position_i = i 
// // position_j = j 
// // } 
// // else if ((i - j == sub)) { 
// // str += `${i}${j},` 
// // allowedMovess.push(`${i}${j}`) 
// // } else { 
// // str += ` ,` 
// // } 
// // } 
// // str += '\n' 
// // } 
// // console.log(str); 
// // return allowedMovess 
// // } catch (err) { 
// // console.log(err); 
// // } 
// // }
// // const runqueen = (position_i, position_j, color) => { // let num = 8; 
// // try { 
// // //['00', '07', '70', '77'] 
// // console.log('position_i', position_i); 
// // console.log('position_j', position_j); 
// // let str = '', allowedMovess = [], add = position_i + position_j, sub = position_i - position_j 
// // for (let i = 0; i < num; i++) { 
// // for (let j = 0; j < num; j++) { 
// // let value = board[i][j] 
// // if (value != EMPTY && value != undefined && (value == value.toUpperCase() && color == 'white')) { 
// // continue 
// // } 
// // else if (value != EMPTY && value != undefined && (value == value.toLowerCase() && color == 'black')) { // continue 
// // } 
// // if ((i + j == add)) { 
// // str += `${i}${j},` 
// // allowedMovess.push(`${i}${j}`) // } 
// // else if ((i - j == sub)) { 
// // str += `${i}${j},` 
// // allowedMovess.push(`${i}${j}`) 
// // } 
// // else if ((i == position_i) || (j == position_j)) { // str += `${i}${j},` 
// // allowedMovess.push(`${i}${j}`)
// // } 
// // else { 
// // str += ` ,` 
// // } 
// // } 
// // str += '\n' 
// // } 
// // console.log(str); 
// // return allowedMovess 
// // } catch (err) { 
// // console.log("err", err); 
// // } 
// // } 
// const kingRun = (position_i, position_j, color) => {
//     let num = 8;
//     try {
//         console.log('position_i', position_i);
//         console.log('position_j', position_j);
//         let allowedMoves = [], str = ''
//         for (let i = 0; i < num; i++) {
//             for (let j = 0; j < num; j++) {
//                 let value = board[i][j]
//                 if (value != EMPTY && value != undefined && (value == value.toUpperCase() && color == 'white')) {
//                     continue
//                 }
//                 else if (value != EMPTY && value != undefined && (value == value.toLowerCase() && color == 'black')) {
//                     continue
//                 }
//                 if (i == position_i && j == position_j) {
//                     str += `${i}${j},`
//                     allowedMoves.push(`${i}${j}`)
//                 }
//                 else if ((i <= position_i + 1) && (j >= position_j - 1) && (j <= position_j + 1) && (i >= position_i - 1)) {
//                     str += `${i}${j},`
//                     allowedMoves.push(`${i}${j}`)
//                 }
//                 else {
//                     str += ` ,`
//                 }
//             }
//             str += '\n'
//         }
//         console.log(allowedMoves);
//         console.log(str);
//         return allowedMoves
//     } catch (err) {
//         console.log(err);
//     }
// }
// ////////////////////////////////////// 
// const runqueen = (position_i, position_j, color) => {
//     const num = 8;
//     const allowedMovess = [];
//     const isSameColor = (piece) => {
//         return (color === 'white' && piece === piece.toUpperCase()) || (color === 'black' && piece === piece.toLowerCase());
//     };
//     const isOpponent = (piece) => {
//         return (color === 'white' && piece === piece.toLowerCase()) || (color === 'black' && piece === piece.toUpperCase());
//     };
//     // Directions rotated 90 degrees clockwise 
//     const directions = [
//         [0, +1], // up → right 
//         [+1, 0], // right → down 
//         [0, -1], // down → left 
//         [-1, 0], // left → up 
//         [-1, +1], // ↖ → ↗ 
//         [+1, +1], // ↗ → ↘ 
//         [+1, -1], // ↘ → ↙ 
//         [-1, -1] // ↙ → ↖ 
//     ];
//     for (const [dx, dy] of directions) {
//         let i = position_i + dx;
//         let j = position_j + dy;
//         while (i >= 0 && i < num && j >= 0 && j < num) {
//             const piece = board[i][j];
//             if (piece === EMPTY) {
//                 allowedMovess.push(`${i}${j}`);
//             } else if (isOpponent(piece)) {
//                 allowedMovess.push(`${i}${j}`);
//                 break;
//             } else if (isSameColor(piece)) {
//                 break;
//             }
//             i += dx;
//             j += dy;
//         }
//     }
//     return allowedMovess;
// };
// const runbishops = (position_i, position_j, color) => {
//     const num = 8;
//     const allowedMovess = [];
//     const isSameColor = (piece) => {
//         if (piece === EMPTY || piece === undefined) return false; return (color === 'white' && piece === piece.toUpperCase()) || (color === 'black' && piece === piece.toLowerCase());
//     }
//     const isOpponent = (piece) => {
//         if (piece === EMPTY || piece === undefined) return false; return (color === 'white' && piece === piece.toLowerCase()) || (color === 'black' && piece === piece.toUpperCase());
//     }
//     const directions = [
//         [-1, +1], // ↗ Up-Right 
//         [-1, -1], // ↖ Up-Left 
//         [+1, +1], // ↘ Down-Right 
//         [+1, -1] // ↙ Down-Left 
//     ];
//     for (const [dx, dy] of directions) {
//         let i = position_i + dx;
//         let j = position_j + dy;
//         while (i >= 0 && i < num && j >= 0 && j < num) {
//             const piece = board[i][j];
//             if (piece === EMPTY) {
//                 allowedMovess.push(`${i}${j}`);
//             } else if (isOpponent(piece)) {
//                 allowedMovess.push(`${i}${j}`);
//                 break;
//             } else if (isSameColor(piece)) {
//                 break;
//             }
//             i += dx;
//             j += dy;
//         }
//     }
//     return allowedMovess;
// }
// const rooksallowedMovess = (position_i, position_j, color) => {
//     const num = 8;
//     const allowedMoves = [];
//     const isOpponent = (piece) => {
//         if (piece === EMPTY || piece === undefined) return false; return (color === 'white' && piece === piece.toLowerCase()) || (color === 'black' && piece === piece.toUpperCase());
//     }
//     // Move Up 
//     for (let i = position_i - 1; i >= 0; i--) {
//         const piece = board[i][position_j];
//         if (piece === EMPTY) {
//             allowedMoves.push(`${i}${position_j}`);
//         } else {
//             if (isOpponent(piece))
//                 allowedMoves.push(`${i}${position_j}`);
//             break;
//         }
//     }
//     // Move Down 
//     for (let i = position_i + 1; i < num; i++) {
//         const piece = board[i][position_j];
//         if (piece === EMPTY) {
//             allowedMoves.push(`${i}${position_j}`);
//         } else {
//             if (isOpponent(piece))
//                 allowedMoves.push(`${i}${position_j}`);
//             break;
//         }
//     }
//     // Move Left 
//     for (let j = position_j - 1; j >= 0; j--) {
//         const piece = board[position_i][j];
//         if (piece === EMPTY) {
//             allowedMoves.push(`${position_i}${j}`);
//         } else {
//             if (isOpponent(piece))
//                 allowedMoves.push(`${position_i}${j}`);
//             break;
//         }
//     }
//     // Move Right 
//     for (let j = position_j + 1; j < num; j++) {
//         const piece = board[position_i][j];
//         if (piece === EMPTY) {
//             allowedMoves.push(`${position_i}${j}`);
//         } else {
//             if (isOpponent(piece))
//                 allowedMoves.push(`${position_i}${j}`);
//             break;
//         }
//     }
//     return allowedMoves;
// }
// let nextPlay = 'white'; // Start with white 
// console.log("baord///////////baord", board);
// const chessGamePlay = async (requestData, socket, io, callback) => {
//     let response = {
//         message: '',
//         status: 0
//     }
//     try {
//         console.log("requestDatarequestDatarequestDatarequestData", requestData);
//         let roomid = requestData?.roomid
//         let playerColor = null;
//         response.roomid = roomid
//         const room = await Room.findOne({ _id: ObjectId(roomid) }).populate('currentgamehistory');
//         if (!room) {
//             return callback({ status: 0, message: 'Room not found' });
//         }
//         const userIdStr = requestData.userid;
//         if (room.users[0]?.toString() === userIdStr) playerColor = 'white';
//         else if (room.users[1]?.toString() === userIdStr) playerColor = 'black';
//         else { return callback({ status: 0, message: 'Player not in room' }); }
//         let from = requestData.from, to = requestData.to; console.log("playerColorplayerColorplayerColor", playerColor);
//         if (playerColor !== 'white' && playerColor !== 'black') {
//             socket.emit('error', 'Invalid player color.'); return;
//         }
//         console.log("11111111111");
//         console.log("playerColor", playerColor, nextPlay);
//         // Check if it's the correct player's turn 
//         if (playerColor !== nextPlay) {
//             socket.emit('error', `It's not ${playerColor}'s turn.`); return;
//         }
//         // Validate move format 
//         if (!from || !to || from.length !== 2 || to.length !== 2) {
//             socket.emit('error', 'Invalid move input.'); return;
//         }
//         // chess pieces change position / move / play 
//         const success = move(from.toLowerCase(), to.toLowerCase(), playerColor);
//         if (success) {
//             let newBoard = await getVisualBoard(roomid); // get board / updated board
//             nextPlay = (playerColor === 'white') ? 'black' : 'white'; response.nextPlay = nextPlay
//             response.status = 1
//             // socket.emit('board', { board: newBoard, playerColor: nextPlay }); 
//             io.to(roomid).emit('board', { board: newBoard, playerColor: nextPlay });
//         } else {
//             socket.emit('error', 'Illegal move.');
//         }
//         return callback(response)
//     } catch (err) {
//         console.log("err", err);
//     }
// }
// const chessPlayerConnect = async (reqData, socket, io) => {
//     const response = {
//         status: 0,
//         socketid: socket.id
//     };
//     try {
//         console.log("Incoming request:", reqData);
//         const user = await User.findById(reqData.id); if (!user) {
//             response.message = 'User not found';
//             return response;
//         }
//         // Optionally assign current game 
//         if (chess_game_id) {
//             user.current_game = chess_game_id;
//         }
//         let playerColor = 'black'; // default for first player  let rooms = await Room.find({ 
//         $expr: {
//             '$lte': [{ '$size': "$users" }, 1]
//         }
//     });
//     console.log("rooms", rooms);
//     let room = null
//     for (let singleRoom of rooms) {
//         if (singleRoom.users.length < 2) {
//             if (singleRoom.users.indexOf(reqData.id.toString()) == -1) {
//                 let seat = singleRoom.users.length + 1; singleRoom.users.push(user._id);
//                 if (!singleRoom.seatings) singleRoom.seatings = {}; playerColor = seat === 1 ? 'black' : 'white'; singleRoom.seatings[seat.toString()] = user._id.toString();
//                 singleRoom.markModified('seatings');
//                 await singleRoom.save();
//                 response.userid = user._id;
//                 room = singleRoom
//                 break;
//             } else {
//                 room = singleRoom
//             }
//         }
//     }
//     if (room == null) {
//         room = await Room.create({
//             seatings: {
//                 1: user._id.toString(),
//                 2: ''
//             },
//             users: [user._id],
//             currentTurn: 1,
//             potValue: 0,
//             maxPlayer: 2,
//             shuffle: 0,
//             roundCount: 0,
//             play: 0,
//             alreadyAssignedCards: [],
//             completeCardSeen: 0,
//             requiredBoat: false,
//         });
//     }
//     socket.join(room._id.toString());
//     response.roomid = room._id.toString();
//     await PlayingData.create({
//         userid: user._id,
//         socketid: socket.id,
//         roomid: room._id,
//         cardseen: false,
//         cards: [],
//         cardType: playerColor, // black or white  seat: room.users.length, 
//         roundCount: 6
//     });
//     if (room.users.length === 2) {
//         const randNum = parseInt(Math.random() * 1000);
//         let puzzle = await Chesspuzzle.findOne({
//             softdelete: false,
//             status: true,
//             $or: [
//                 { randomKey: { $gte: randNum } }, { randomKey: { $lte: randNum } } // fallback wrap-around 
//             ]
//         }, { 'randomKey': 1 })
//             .sort({
//                 randomKey: 1
//             })
//             .lean();
//         let gameHistory = await GameHistory.create({
//             total_betting: 0,
//             total_winning: 0,
//             game: chess_game_id,
//             jackpot: 0,
//             chessboard: puzzle._id,
//             gameVariant: ObjectId(reqData.gameid)
//         });
//         if (gameHistory) {
//             room.currentgamehistory = gameHistory.id; await room.save()
//         }
//         response.waiting = false;
//         response.message = 'Both players connected. Game starting...';
//     } else if (room.users.length === 1) {
//         response.waiting = true;
//         response.message = 'Waiting for opponent to join...';
//     }
//     response.status = 1;
//     response.color = playerColor;
//     io.in(room._id.toString()).emit('roominfo', response);
// } catch (error) {
//     console.error('chessPlayerConnect error:', error); response.message = error.message || 'Unexpected error occurred';
// }
// return response; 
// };
// const gamelist = async (reqData, socket) => {
//     let response = {
//         message: "",
//         status: 0
//     }
//     try {
//         let filter = {
//             softdelete: false,
//             status: true
//         }
//         let resp = await GameVariant.find(filter)
//         response.list = resp
//         response.status = 1
//     } catch (err) {
//         response.status = 0
//         response.list = []
//     }
//     return response
// }
// const autowhitePlay = (updatedBoard, keyValuePointes, black, white) => {
//     let boardBackposition = [
//         ['a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8'], ['a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7'], ['a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6'], ['a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5'], ['a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4'], ['a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3'], ['a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2'], ['a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1']
//     ]
//     if (!black && !white) {
//         white = [], black = []
//         for (let i = 0; i < 8; i++) {
//             for (let j = 0; j < 8; j++) {
//                 if (updatedBoard[i][j] != EMPTY && updatedBoard[i][j] == updatedBoard[i][j].toUpperCase()) {
//                     white.push(`${i}${j}`)
//                 } else if (updatedBoard[i][j] != EMPTY && updatedBoard[i][j] == updatedBoard[i][j].toLowerCase()) {
//                     black.push(`${i}${j}`)
//                 }
//             }
//         }
//     }
//     let blackpoint = 0, passfrom, passto;
//     for (let single of white) {
//         let from =
//             boardBackposition[parseInt(single[0])][parseInt(single[1])]
//         let resp = getPositions({ from: from, color: 'black' })  if (resp.length) {
//             for (let singleKey of resp) {
//                 if (black.indexOf(singleKey) != -1) {
//                     let getPoint =
//                         keyValuePointes[updatedBoard[parseInt(singleKey[0])][parseInt(singleKey[1])]]
//                     let getKeys =
//                         boardBackposition[parseInt(singleKey[0])][parseInt(singleKey[1])]
//                     if (getPoint >= blackpoint) {
//                         blackpoint = getPoint
//                         passfrom = from
//                         passto = getKeys
//                     }
//                 }
//             }
//         }
//     }
//     console.log("whitepoint.........passfrom..........passto/////////", blackpoint, passfrom, passto);
//     return {
//         blackpoint
//         , from: passfrom,
//         to: passto
//     }
// }
// const autoBlackPlay = (updatedBoard, keyValuePointes) => {
//     let boardBackposition = [
//         ['a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8'], ['a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7'], ['a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6'], ['a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5'], ['a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4'], ['a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3'], ['a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2'], ['a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1']
//     ]
//     let white = [], black = []
//     for (let i = 0; i < 8; i++) {
//         for (let j = 0; j < 8; j++) {
//             if (updatedBoard[i][j] != EMPTY && updatedBoard[i][j] == updatedBoard[i][j].toUpperCase()) {
//                 white.push(`${i}${j}`)
//             } else if (updatedBoard[i][j] != EMPTY &&
//                 updatedBoard[i][j] == updatedBoard[i][j].toLowerCase()) {
//                 black.push(`${i}${j}`)
//             }
//         }
//     }
//     let blackpoint = 0, whitepoint = 0, passfrom, passto, toValue; for (let single of black) {
//         let from =
//             boardBackposition[parseInt(single[0])][parseInt(single[1])]
//         let resp = getPositions({ from: from, color: 'black' })  if (resp.length) {
//             for (let singleKey of resp) {
//                 if (white.indexOf(singleKey) != -1) {
//                     let getPoint =
//                         keyValuePointes[updatedBoard[parseInt(singleKey[0])][parseInt(singleKey[1])]]
//                     let getKeys =
//                         boardBackposition[parseInt(singleKey[0])][parseInt(singleKey[1])]
//                     if (getPoint >= whitepoint) {
//                         whitepoint = getPoint
//                         passfrom = from
//                         passto = getKeys
//                         toValue = singleKey
//                     }
//                 }
//             }
//         }
//     }

//     console.log("whitepoint.........passfrom..........passto............", whitepoint, passfrom, passto, toValue);
//     // black = [passto]
//     let getResp = autowhitePlay(updatedBoard, keyValuePointes, [toValue], white)
//     // console.log("getResp", getResp); 
// }
// // whitepoint.........passfrom..........passto............ 5 c6 b5 31 // whitepoint.........passfrom..........passto//////////// 5 a3 b5 
// let keyValue = {
//     P: 1,
//     N: 3,
//     R: 5,
//     B: 5,
//     Q: 9,
//     K: 10,
// }
// autoBlackPlay(board, keyValue)
// /* 
// let board = [ 
// ['r', ' ', ' ', 'q', 'k', ' ', 'n', 'r'], 
// ['p', 'p', 'p', ' ', ' ', 'p', 'p', 'p'], 
// [' ', ' ', 'b', 'p', 'p', ' ', ' ', ' '], 
// [' ', 'B', ' ', ' ', ' ', ' ', ' ', ' '], 
// [' ', ' ', 'P', 'P', 'P', ' ', ' ', ' '], 
// ['N', ' ', ' ', ' ', ' ', 'N', ' ', ' '], 
// ['P', 'P', ' ', ' ', ' ', 'P', 'P', 'P'], 
// ['R', ' ', 'B', 'Q', 'K', ' ', ' ', 'R']  
// ]; 
// */
// module.exports = { chessGamePlay, getVisualBoard, getPositions, chessPlayerConnect, gamelist, getBoard }
