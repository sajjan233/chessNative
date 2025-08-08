import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import socket from './services/socket';

export default function ChessGame() {
  const [connected, setConnected] = useState(false);
  const [move, setMove] = useState(null);

  useEffect(() => {
    socket.connect();

    socket.on('connect', () => {
      console.log('✅ Connected to socket server');
      setConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected');
      setConnected(false);
    });

   
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('move');
      socket.disconnect();
    };
  }, []);

  const sendMove = () => {
    const moveData = { from: 'e2', to: 'e4' };
    socket.emit('move', moveData);
    console.log('📤 Sent move', moveData);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>{connected ? '🟢 Connected' : '🔴 Not connected'}</Text>
      <Button title="Send Move (e2 → e4)" onPress={sendMove} />
      {move && (
        <Text style={{ marginTop: 20 }}>
          Last move: {move.from} → {move.to}
        </Text>
      )}
    </View>
  );
}
