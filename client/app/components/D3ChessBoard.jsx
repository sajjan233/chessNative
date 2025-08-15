// components/D3ChessBoard.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import socket from '../services/socket';

const screenWidth = Dimensions.get('window').width;
const cellSize = screenWidth / 8;
const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

// Convert chess notation like "f6" to row/col indexes
const coordToIndex = (coord) => {
  const file = coord[0];
  const rank = coord[1];
  const col = file.charCodeAt(0) - 'a'.charCodeAt(0);
  const row = 8 - parseInt(rank, 10);
  return { row, col };
};

// Convert row/col to chess notation like e2
const indexToCoord = (row, col) => {
  return files[col] + (8 - row);
};

export default function D3ChessBoard({ userId, roomId ,getboard }) {
  const [selectedCell, setSelectedCell] = useState(null);
  const [highlightedSquares, setHighlightedSquares] = useState([]);
  const [fromSquare, setFromSquare] = useState(null); // store first click

  useEffect(() => {
    // Receive highlighted moves from server
    socket.on('chess_pieces_position', (data) => {
      setHighlightedSquares(data || []);
    });

    // Receive updated board after a move
    socket.on('board', ({ board, playerColor }) => {
      console.log('♟ Board updated:', board, 'Next turn:', playerColor);
    });

    return () => {
      socket.off('chess_pieces_position');
      socket.off('board');
    };
  }, []);

  

  const handleSquareClick = (row, col) => {
    const coord = indexToCoord(row, col);
    setSelectedCell({ row, col });

    // If no "from" selected yet, select piece and request possible moves
    if (!fromSquare) {
      const piece = getboard[row][col];
      if (piece) {
        const color = piece === piece.toLowerCase() ? 'black' : 'white';
        setFromSquare(coord);

        // Ask server for possible moves (optional)
        socket.emit('chess_pieces_position', { from: coord, color }, (res) => {
          console.log('📥 Move highlights response:', res);
        });
      }
    } else {
      // Second click: send move to server
      
       moveData = {
        roomid: roomId,
        userid: userId,
        from: fromSquare,
        to: coord
      };

      console.log('📤 Sending move:', moveData);
      socket.emit('chess_game', moveData, (response) => {
        console.log('📥 Move response from server:', response);
        if (response.status === 1) {
          console.log('✅ Move successful, Next turn:', response.nextPlay);
        } else {
          console.log('❌ Move failed:', response.message);
        }
      });

      // Reset selection
      setFromSquare(null);
      setHighlightedSquares([]);
    }
  };

  const renderPiece = (piece) => {
    if (!piece) return null;
    const unicodePieces = {
      p: '♟', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚',
      P: '♙', R: '♖', N: '♘', B: '♗', Q: '♕', K: '♔',
    };
    return <Text style={styles.piece}>{unicodePieces[piece]}</Text>;
  };

  return (
    <View style={styles.board}>
      {getboard.map((rowData, row) =>
        rowData.map((cell, col) => {
          const isLight = (row + col) % 2 === 0;
          const isSelected = selectedCell?.row === row && selectedCell?.col === col;
          const isHighlighted = highlightedSquares.some(h => {
            const { row: hr, col: hc } = coordToIndex(h);
            return hr === row && hc === col;
          });

          return (
            <TouchableOpacity
              key={`${row}-${col}`}
              onPress={() => handleSquareClick(row, col)}
              style={[
                styles.cell,
                { backgroundColor: isSelected ? 'yellow' : isLight ? '#f0d9b5' : '#b58863' },
              ]}
            >
              {renderPiece(cell)}
              {isHighlighted && <View style={styles.greenDot} />}
            </TouchableOpacity>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    width: screenWidth,
    height: screenWidth,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: cellSize,
    height: cellSize,
    justifyContent: 'center',
    alignItems: 'center',
  },
  piece: {
    fontSize: cellSize * 0.6,
  },
  greenDot: {
    width: cellSize * 0.3,
    height: cellSize * 0.3,
    borderRadius: (cellSize * 0.3) / 2,
    backgroundColor: 'green',
    position: 'absolute',
  },
});
