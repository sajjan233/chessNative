import mongoose from 'mongoose';

const gameHistorySchema = new mongoose.Schema({
    gameid: {
               type: [mongoose.Schema.Types.ObjectId],
               ref: 'game',
    },
    total_betting: {
        type: Number,
        default: 0
    },
    total_winning: {
        type: Number,
        default: 0
    },
    jackpot: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

gameHistorySchema.methods.toCustomJSON = function () {
    return {
        id: this._id,
        gameid: this.gameid,
        total_betting: this.total_betting,
        total_winning: this.total_winning,
        jackpot: this.jackpot,
        createdAt: this.createdAt
    }
};

const GameHistory = mongoose.model('GameHistory', gameHistorySchema);

export default GameHistory;
