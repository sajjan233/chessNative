// components/AnimatedChessBoard.jsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import socket from '../services/socket';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import {
  GestureDetector,
  Gesture,
} from 'react-native-gesture-handler';

const screenWidth = Dimensions.get('window').width;
const boardSize = screenWidth;
const cellSize = boardSize / 8;

export default function AnimatedChessBoard({ userId, roomId }) {
  const [board, setBoard] = useState([]);

  // 👇 Rotation values (drag angle)
  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);

  // 👇 Gesture to detect drag
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      rotateY.value = withSpring(rotateY.value + e.changeX / 2);
      rotateX.value = withSpring(rotateX.value - e.changeY / 2);
    });

  // 👇 Apply transform using animated style
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: 1000 }, // 👈 for 3D effect
        { rotateX: `${rotateX.value}deg` },
        { rotateY: `${rotateY.value}deg` },
      ],
    };
  });

  useEffect(() => {
    if (!userId || !roomId) return;
    socket.emit('roomwiseboard', { roomId, userId });

    socket.on('board', ({ board }) => {
      setBoard(board);
    });

    return () => {
      socket.off('board');
    };
  }, [userId, roomId]);

  return (
    <View style={styles.container}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.boardWrapper, animatedStyle]}>
          <Svg width={boardSize} height={boardSize}>
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => {
                const position = Object.keys(cell)[0];
                const piece = cell[position];
                const isWhite = (rowIndex + colIndex) % 2 === 0;

                return (
                  <React.Fragment key={`${rowIndex}-${colIndex}`}>
                    <Rect
                      x={colIndex * cellSize}
                      y={rowIndex * cellSize}
                      width={cellSize}
                      height={cellSize}
                      fill={isWhite ? '#EEE' : '#444'}
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
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boardWrapper: {
    width: boardSize,
    height: boardSize,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 12,
    overflow: 'hidden',
  },
});
