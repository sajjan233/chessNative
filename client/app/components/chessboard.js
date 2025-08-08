

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import socket from '../services/socket';

const screenWidth = Dimensions.get('window').width;
const cellSize = screenWidth / 8;

export default function ChessBoard({ userId, roomId }) {
  const [board, setBoard] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [fromPosition, setFromPosition] = useState(null);
  const [nextPlay, setNextPlay] = useState(null);
  const [message, setMessage] = useState('');

  // 🟨 Handle cell click
  const handleCellPress = (row, col) => {
    const cellObj = board[row][col];
    const position = Object.keys(cellObj)[0];
    const piece = cellObj[position];

    if (!fromPosition) {
      // First click – select piece to move
      setFromPosition(position);
      setSelectedCell({ row, col });
      console.log(`✅ Selected FROM: ${position} (${piece})`);
    } else {
      // Second click – destination
      const toPosition = position;
      console.log(`🚀 Moving FROM ${fromPosition} TO ${toPosition}`);

      
      // Emit the move to server
      socket.emit('chess_pieces_position', {
        roomId,
        userId,
        from: fromPosition,
        to: toPosition,
      });

      // Reset selections
      setFromPosition(null);
      setSelectedCell(null);
    }
  };

  useEffect(() => {
    if (!userId || !roomId) return;
    console.log("♟️ Joining room:", roomId, "User:", userId);

    socket.emit('roomwiseboard', { roomId, userId });

    socket.on('board', (data) => {
      console.log('📦 Board received:', data.board);
      setBoard(data.board);
      setNextPlay(data.nextPlay);
    });

    socket.on('gameStarted', () => {
      console.log("🚀 Game started!");
      setMessage("Game started!");
    });

    return () => {
      socket.off('board');
      socket.off('gameStarted');
    };
  }, [userId, roomId]);

  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.message}>Next Play: {nextPlay}</Text>

      <View style={styles.board}>
        {board.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => {
              const position = Object.keys(cell)[0];
              const piece = cell[position];
              const isWhiteCell = (rowIndex + colIndex) % 2 === 0;
              const isSelected =
                selectedCell?.row === rowIndex && selectedCell?.col === colIndex;

              return (
                <TouchableOpacity
                  key={colIndex}
                  style={[
                    styles.cell,
                    isWhiteCell ? styles.whiteCell : styles.blackCell,
                    isSelected && styles.selectedCell,
                  ]}
                  onPress={() => handleCellPress(rowIndex, colIndex)}
                >
                  <Text style={styles.piece}>{piece}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    flex: 1,
  },
  message: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  board: {
    width: screenWidth,
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: '#444',
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
  whiteCell: {
    backgroundColor: '#EEE',
  },
  blackCell: {
    backgroundColor: '#888',
  },
  selectedCell: {
    borderWidth: 2,
    borderColor: 'red',
  },
  piece: {
    fontSize: 24,
  },
});
