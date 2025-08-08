import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Button } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import socket from '../services/socket';

const screenWidth = Dimensions.get('window').width;
const boardSize = screenWidth;
const cellSize = boardSize / 8;

export default function D3ChessBoard({ userId, roomId }) {
  const [board, setBoard] = useState([]);
  const [selected, setSelected] = useState(null);
  const [from, setFrom] = useState(null);
  const [nextPlay, setNextPlay] = useState(null);
  const [message, setMessage] = useState('');
  const [isFlipped, setIsFlipped] = useState(false); // 🔁 NEW: flip board state

  const handleCellPress = (pos) => {
    if (!from) {
      setFrom(pos);
      setSelected(pos);
    } else {
      const to = pos;
      socket.emit('chess_pieces_position', {
        roomId,
        userId,
        from,
        to,
      });
      setFrom(null);
      setSelected(null);
    }
  };

  useEffect(() => {
    if (!userId || !roomId) return;

    socket.emit('roomwiseboard', { roomId, userId });

    socket.on('board', ({ board, nextPlay }) => {
      setBoard(board);
      setNextPlay(nextPlay);
    });

    socket.on('gameStarted', () => {
      setMessage("Game started!");
    });

    return () => {
      socket.off('board');
      socket.off('gameStarted');
    };
  }, [userId, roomId]);

  // 🔁 Flip board rows and columns when isFlipped is true
  const displayedBoard = isFlipped
    ? [...board].reverse().map(row => [...row].reverse())
    : board;

  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.message}>Next Play: {nextPlay}</Text>

      {/* 🔁 Flip button */}
      <View style={{ marginBottom: 10 }}>
        <Button title="🔁 Flip Board" onPress={() => setIsFlipped(!isFlipped)} />
      </View>

      <Svg height={boardSize} width={boardSize}>
        {displayedBoard.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const position = Object.keys(cell)[0];
            const piece = cell[position];
            const isWhite = (rowIndex + colIndex) % 2 === 0;
            const isSelected = selected === position;

            return (
              <React.Fragment key={`${rowIndex}-${colIndex}`}>
                <Rect
                  x={colIndex * cellSize}
                  y={rowIndex * cellSize}
                  width={cellSize}
                  height={cellSize}
                  fill={isWhite ? '#EEE' : '#444'}
                  stroke={isSelected ? 'red' : 'none'}
                  strokeWidth={2}
                  onPress={() => handleCellPress(position)}
                />
                <SvgText
                  x={colIndex * cellSize + cellSize / 2}
                  y={rowIndex * cellSize + cellSize / 1.7}
                  fontSize={cellSize / 2.5}
                  fill="black"
                  textAnchor="middle"
                >
                  {piece}
                </SvgText>
              </React.Fragment>
            );
          })
        )}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
  },
  message: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
});
