// ✅ Final Express + Socket.IO server
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import passport from 'passport';
import cors from 'cors';

import router from './src/routes/index.js';
import { initializeSocket } from './socket.js';
import './src/config/passport.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

const server = createServer(app); // 👈 Wrap Express in HTTP server

// ✅ Initialize socket server ONCE
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// ✅ Pass io to your socket setup
initializeSocket(io);

// ✅ MongoDB connection
const { MONGODB_PROD, MONGODB_STAGING, PORT, NODE_ENV } = process.env;
const mongodbUrl = NODE_ENV === 'Production' ? MONGODB_PROD : MONGODB_STAGING;

mongoose.connect(mongodbUrl, {})
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Routes
app.use('/', router);

// ✅ Static files (for web React build)
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../client/build')));

// ✅ Start server
server.listen(PORT || 3000, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
