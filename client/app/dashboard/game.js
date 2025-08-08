// // app/dashboard/game.jsx
// import React, { useEffect, useState } from 'react';
// import { Text, View } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import socket from '../services/socket';
// import ChessBoard from '../components/chessboard.js';

// export default function GameScreen() {
//   const [userId, setUserId] = useState(null);
//   const [roomId, setRoomId] = useState(null); // ✅ Define roomId

//   useEffect(() => {
//     const connectAndJoinRoom = async () => {
//       try {
//         const userid = await AsyncStorage.getItem('userid');
      
        
//         if (!userid) {
//           console.warn("❌ User ID not found in storage");
//           return;
//         }

//         setUserId(userid); // ✅ Set the state

//         if (!socket.connected) {
//           socket.connect();
//         }

//         socket.on('connect', () => {
//           console.log('✅ Connected to socket with id:', socket.id);

//           // Send connect event to server
//           const reqData = { id: userid };
//           socket.emit('chessPlayerConnect', reqData);
//         });

//         // When server sends room info
//         socket.on('roomInfo', (data) => {

          
//           setRoomId(data?.roomid); // ✅ Save roomId from server
//         });

//         socket.on('disconnect', () => {
//           console.log('🔌 Disconnected from socket server');
//         });

//       } catch (error) {
//         console.error('🚨 Error during socket connection:', error);
//       }
//     };

//     connectAndJoinRoom();

//     return () => {
//       if (socket) {
//         socket.disconnect();
//         console.log('🔴 Socket disconnected');
//       }
//     };
//   }, []);

//   return (
//     <View style={{ flex: 1, paddingTop: 40, alignItems: 'center' }}>
//       <Text style={{ fontSize: 18, marginBottom: 20 }}>
//         ♟️ Welcome to the Chess Game
//       </Text>

//       {userId && roomId ? (
        
//         <ChessBoard userId={userId} roomId={roomId} />
//       ) : (
//         <Text>⏳ Waiting for game to initialize...</Text>
//       )}
//     </View>
//   );
// }



// app/dashboard/game.jsx
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import socket from '../services/socket';

// ✅ Import your D3ChessBoard component
import D3ChessBoard from '../components/D3ChessBoard';
import AnimatedChessBoard from '../components/AnimatedChessBoard';

export default function GameScreen() {
  const [userId, setUserId] = useState(null);
  const [roomId, setRoomId] = useState(null);

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

        socket.on('connect', () => {
          console.log('✅ Connected to socket with id:', socket.id);

          socket.emit('chessPlayerConnect', { id: userid });
        });

        socket.on('roomInfo', (data) => {
          setRoomId(data?.roomid);
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

      {userId && roomId ? (
        // ✅ Use the D3 version of the chessboard here
        <AnimatedChessBoard userId={userId} roomId={roomId} />
      ) : (
        <Text>⏳ Waiting for game to initialize...</Text>
      )}
    </View>
  );
}
