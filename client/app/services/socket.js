// services/socket.js

// React Native polyfills (must be first)
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

// Import socket.io-client
import { io } from 'socket.io-client';
import { BaseURL } from '../comman';
console.log("socccckeeeeeeet");

// Create and configure socket instance
const socket = io(BaseURL(), {
  transports: ['websocket'],  // Force websocket transport
  autoConnect: false,         // Connect manually when needed
});

// Export the socket instance
export default socket;
