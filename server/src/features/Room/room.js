import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
    seatings: {
        type: Map,
        of: String, // user ID or empty string
        default: {
            1: '',
            2: ''
        }
    },
    users: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: [],
    },
    maxPlayer: {
        type: Number,
        default: 2,
    },
    roundCount: {
        type: Number,
        default: 0,
    },
    currentgamehistory : {
          type: mongoose.Schema.Types.ObjectId,
        ref: 'GameHistory',
    },
    gameStatus: {
        type: String,
        enum: ['waiting', 'in-progress', 'finished'],
        default: 'waiting'
    },
});
roomSchema.methods.toCustomJSON = function () {
    return {
        id: this._id,
        seatings: this.seatings,
        users: this.users,
        maxPlayer: this.maxPlayer,
        roundCount: this.roundCount,
        gameStatus: this.gameStatus
    }
}
const Room = mongoose.model('Room', roomSchema);
export default Room;


async function f() {
    let resp = await Room.deleteMany({})
    console.log(resp);
    
}

// f()
