// SocketChessBoard.jsx
import React, { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import Svg, { Rect, Text as SvgText, Circle } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import io from 'socket.io-client';

const { width } = Dimensions.get('window');
const boardSize = width - 40;
const cellSize = boardSize / 8;

// change to your backend socket URL
const SOCKET_URL = 'http://192.168.1.10:3000';

export default function SocketChessBoard() {
  const [board, setBoard] = useState(Array(8).fill(Array(8).fill(null)));

  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);

  // Socket connect
  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on('connect', () => {
      console.log('✅ Connected to socket server');
    });

    socket.on('boardState', (data) => {
      // data will be a 2D array representing board
      setBoard(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Gesture for rotation
  const panGesture = Gesture.Pan().onUpdate((e) => {
    rotateY.value = e.translationX / 5;
    rotateX.value = -e.translationY / 5;
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: 800 },
        { rotateX: `${rotateX.value}deg` },
        { rotateY: `${rotateY.value}deg` },
      ],
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[{ alignSelf: 'center', marginTop: 50 }, animatedStyle]}>
        <Svg width={boardSize} height={boardSize}>
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const isWhite = (rowIndex + colIndex) % 2 === 0;
              return (
                <React.Fragment key={`${rowIndex}-${colIndex}`}>
                  {/* Board cell */}
                  <Rect
                    x={colIndex * cellSize}
                    y={rowIndex * cellSize}
                    width={cellSize}
                    height={cellSize}
                    fill={isWhite ? '#f0d9b5' : '#b58863'}
                  />
                  {/* If piece present */}
                  {cell && (
                    <SvgText
                      x={colIndex * cellSize + cellSize / 2}
                      y={rowIndex * cellSize + cellSize / 1.5}
                      fontSize={24}
                      fontWeight="bold"
                      fill={isWhite ? '#000' : '#fff'}
                      textAnchor="middle"
                    >
                      {cell}
                    </SvgText>
                  )}
                </React.Fragment>
              );
            })
          )}
        </Svg>
      </Animated.View>
    </GestureDetector>
  );
}
