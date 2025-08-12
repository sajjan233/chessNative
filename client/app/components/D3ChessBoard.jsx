// components/ChessBoard.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import socket from '../services/socket';

const screenWidth = Dimensions.get('window').width;
const cellSize = screenWidth / 8;

export default function ChessBoard({ userId, roomId }) {
  const [board, setBoard] = useState([]); // 2D board array
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);

  // Socket events
  useEffect(() => {
    console.log("🔌 Connecting to chess board...");

    // Listen for updated board from server
    socket.on('board', ({ board: newBoard }) => {
      console.log("♟️ Board received from server:", newBoard);
      setBoard(newBoard);
      setLoading(false);
    });

    // Listen for server updates after a move
    socket.on('chess_pieces_position', (updatedBoard) => {
      console.log("♟️ Updated board after move:", updatedBoard);
      setBoard(updatedBoard);
    });

    // Initial join
    socket.emit('joinRoom', { userId, roomId });

    // Request initial board
    socket.emit('getBoard', { roomId });

    return () => {
      socket.off('board');
      socket.off('chess_pieces_position');
    };
  }, [userId, roomId]);

  const handleCellPress = (row, col) => {
    const pos = `${String.fromCharCode(97 + col)}${8 - row}`; // e.g., a8, h1
    if (!from) {
      setFrom(pos);
    } else if (!to) {
      setTo(pos);

      // Emit move when both from and to are selected
      const moveData = { from: from, to: pos, roomId };
      console.log("📤 Sending move:", moveData);
      socket.emit('chess_pieces_position', moveData);

      // Reset for next move
      setFrom(null);
      setTo(null);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Loading chessboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {board.map((rowArray, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {rowArray.map((cell, colIndex) => {
            const isDark = (rowIndex + colIndex) % 2 === 1;
            const pos = `${String.fromCharCode(97 + colIndex)}${8 - rowIndex}`;
            const isSelected = pos === from || pos === to;
            return (
              <TouchableOpacity
                key={colIndex}
                style={[
                  styles.cell,
                  { backgroundColor: isDark ? '#769656' : '#eeeed2' },
                  isSelected && { backgroundColor: '#f6f669' },
                ]}
                onPress={() => handleCellPress(rowIndex, colIndex)}
              >
                <Text style={styles.piece}>{cell || ''}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: '#000',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: cellSize,
    height: cellSize,
    justifyContent: 'center',
    alignItems: 'center',
  },
  piece: {
    fontSize: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
