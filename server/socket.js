import Chess from "./src/features/chess/socket.js";

// socket.js ✅ CORRECTED VERSION
export const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`🟢 New client connected: ${socket.id}`);













    socket.on('chess_game', async (requestData, callback) => {
      await chessGamePlay(requestData, socket, io, (response) => {
        console.log("response", response);
        callback(response)
      })
    })












    socket.on('chessPlayerConnect', async (reqData) => {
      console.log('reqData....', reqData);

      const res = await Chess.chessPlayerConnect(reqData, socket, io);
      console.log("Socket chess connect result:", res);
      socket.emit('roomInfo', res)
    });



    const gameBoards = {};

    socket.on('roomwiseboard', (getData) => {
      console.log("Roomwise board request:", getData);

      let board;

      if (gameBoards[getData.roomId]) {
        // ✅ Use existing board
        board = gameBoards[getData.roomId];
      } else {
        // ✅ Create new board for new room
        board = Chess.getVisualBoard();
        gameBoards[getData.roomId] = board;
      }

      let data = { board, nextPlay: 'white' };

      // Send to all clients in the same room
      io.to(getData.roomId).emit('board', data);
    });

    // socket.on('chess_pieces_position', (getData) => {
    //   let resp = Chess.getPositions(getData)
    //   socket.emit('chess_pieces_position', resp)
    // })


    socket.on('chess_pieces_position', async (reqData, callback) => {
      console.log("reqDatareqData.....////..", reqData);
      Chess.getPositions(reqData, socket, (response) => {
        console.log("reqData", reqData);
        callback(response)
      })
    })


    // socket.on('chess_game_play', async (reqData) => {
    //   const res = await Chess.chessGamePlay(reqData, socket, io);
    // });



    socket.on('disconnect', () => {
      console.log(`🔴 Client disconnected: ${socket.id}`);
    });


  });
};
