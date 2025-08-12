import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import socket from '../services/socket';
import D3ChessBoard from '../components/D3ChessBoard';

export default function GameScreen() {
  const [userId, setUserId] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [boardData, setBoardData] = useState(null);

  useEffect(() => {
    const connectAndJoinRoom = async () => {
      try {
        const userid = await AsyncStorage.getItem('userid');

        if (!userid) {
          console.warn("❌ User ID not found in storage");
          return;
        }

        setUserId(userid);

        if (!socket.connected) {
          socket.connect();
        }

        socket.on('connect', async () => {
          console.log('✅ Connected to socket with id:', socket.id);
          const roomid = await AsyncStorage.getItem('roomid');
          socket.emit('chessPlayerConnect', { id: userid, roomid: roomid });
        });

        socket.on('roomInfo', async (data) => {
          console.log("📦 roomInfo received:", data);

          let GETroomid = await AsyncStorage.getItem('roomid');
          if (GETroomid === 'undefined' || GETroomid == null) {
            GETroomid = data?.roomid;
            setRoomId(GETroomid);
            await AsyncStorage.setItem('roomid', GETroomid);
          }

          // ✅ Now that we have the room, request the board
          socket.emit('roomwiseboard', { roomId: GETroomid, userId: userid });
        });

        // ✅ Listen for the board data
        socket.on('board', (data) => {
          console.log("♟️ Board received:", data);
          setBoardData(data);
        });

        socket.on('disconnect', () => {
          console.log('🔌 Disconnected from socket server');
        });

      } catch (error) {
        console.error('🚨 Error during socket connection:', error);
      }
    };

    connectAndJoinRoom();

    return () => {
      if (socket) {
        socket.off('board');
        socket.off('roomInfo');
        socket.disconnect();
        console.log('🔴 Socket disconnected');
      }
    };
  }, []);

  return (
    <View style={{ flex: 1, paddingTop: 40, alignItems: 'center' }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>
        ♟️ Welcome to the Chess Game
      </Text>

      {boardData ? (
        <D3ChessBoard userId={userId} roomId={roomId} getboard={boardData.board} />
      ) : (
        <Text>Loading board...</Text>
      )}
    </View>
  );
}
