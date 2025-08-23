// components/D3ChessBoard.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import socket from '../services/socket';

const screenWidth = Dimensions.get('window').width;
const cellSize = screenWidth / 8;
const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

const coordToIndex = (coord) => {
  if (!coord) return { row: -1, col: -1 };
  const file = coord[0];
  const rank = coord[1];
  const col = file.charCodeAt(0) - 'a'.charCodeAt(0);
  const row = 8 - parseInt(rank, 10);
  return { row, col };
};

const indexToCoord = (row, col) => files[col] + (8 - row);

const defaultBoard = [
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
];

export default function D3ChessBoard({ userId, roomId, getboard }) {
  const [board, setBoard] = useState(getboard && getboard.length ? getboard : defaultBoard);
  const [selectedCell, setSelectedCell] = useState(null);
  const [highlightedSquares, setHighlightedSquares] = useState([]);
  const [fromSquare, setFromSquare] = useState(null);
  const [kingInCheckSquare, setKingInCheckSquare] = useState(null);
  const [statusMsg, setStatusMsg] = useState('');
  const [isCheck, setIsCheck] = useState(false);

  useEffect(() => {
    socket.on('chess_pieces_position', (moves) => {
      setHighlightedSquares(moves || []);
    });

    socket.on('board', ({ board }) => {
      setBoard(board && board.length ? board : defaultBoard);
      setFromSquare(null);
      setHighlightedSquares([]);
    });

    socket.on('incheckOrCheckmat', (resp) => {
      if (resp.checkmate) {
        setStatusMsg(`${resp.color} is in Checkmate!`);
        setKingInCheckSquare(resp.kingPosition);
        setIsCheck(false);
      } else if (resp.check) {
        setStatusMsg(`${resp.color} is in Check!`);
        setKingInCheckSquare(resp.kingPosition);
        setIsCheck(true);
      } else {
        setStatusMsg('');
        setKingInCheckSquare(null);
        setIsCheck(false);
      }
    });

    return () => {
      socket.off('chess_pieces_position');
      socket.off('board');
      socket.off('incheckOrCheckmat');
    };
  }, []);

  const handleSquareClick = (row, col) => {
    const coord = indexToCoord(row, col);
    setSelectedCell({ row, col });

    if (!fromSquare) {
      const piece = board[row][col];
      if (piece) {
        const color = piece === piece.toLowerCase() ? 'black' : 'white';
        setFromSquare(coord);
        socket.emit('chess_pieces_position', { from: coord, color });
      }
    } else {
      const moveData = { roomid: roomId, userid: userId, from: fromSquare, to: coord };
      socket.emit('chess_game', moveData, (response) => {
        if (response.status !== 1) setStatusMsg(`❌ ${response.message}`);
      });

      setFromSquare(null);
      setHighlightedSquares([]);
    }
  };

  const renderPiece = (piece) => {
    if (!piece || piece === ' ') return null;
    const unicodePieces = {
      p: '♟', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚',
      P: '♙', R: '♖', N: '♘', B: '♗', Q: '♕', K: '♔',
    };
    return <Text style={styles.piece}>{unicodePieces[piece]}</Text>;
  };

  return (
    <View>
      <View style={styles.board}>
        {board.map((rowData, row) =>
          rowData.map((cell, col) => {
            const isLight = (row + col) % 2 === 0;
            const isSelected = selectedCell?.row === row && selectedCell?.col === col;

            const isHighlighted = highlightedSquares.some(h => {
              const { row: hr, col: hc } = coordToIndex(h);
              return hr === row && hc === col;
            });

            const isKingInCheck = kingInCheckSquare === indexToCoord(row, col);

            // Disable clicks on non-highlighted cells if in check
            const disabled = isCheck && !isHighlighted && !isKingInCheck;

            return (
              <TouchableOpacity
                key={`${row}-${col}`}
                onPress={() => !disabled && handleSquareClick(row, col)}
                style={[
                  styles.cell,
                  {
                    backgroundColor: isKingInCheck
                      ? '#ff4d4d'
                      : isSelected
                        ? '#ffe066'
                        : isLight
                          ? '#f0d9b5'
                          : '#b58863',
                    opacity: disabled ? 0.5 : 1,
                  },
                ]}
                disabled={disabled}
              >
                {renderPiece(cell)}
                {isHighlighted && <View style={styles.greenDot} />}
              </TouchableOpacity>
            );
          })
        )}
      </View>

      {statusMsg ? <Text style={styles.statusText}>{statusMsg}</Text> : null}
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
    width: cellSize * 0.25,
    height: cellSize * 0.25,
    borderRadius: (cellSize * 0.25) / 2,
    backgroundColor: 'green',
    position: 'absolute',
  },
  statusText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'red',
  },
});
