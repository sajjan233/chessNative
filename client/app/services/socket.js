// services/socket.js

// React Native polyfills (must be first)
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

// Import socket.io-client
import { io } from 'socket.io-client';
console.log("socccckeeeeeeet");
//http://3.108.254.144:5000/
//http://localhost:5000/
// Create and configure socket instance
const socket = io('http://localhost:5000/', {
  transports: ['websocket'],  // Force websocket transport
  autoConnect: false,         // Connect manually when needed
});

// Export the socket instance
export default socket;
