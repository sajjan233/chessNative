import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: Boolean,
    default: false  // false = waiting/finished, true = in-progress
  }
});

// Optional method to return clean JSON
gameSchema.methods.toCustomJSON = function () {
  return {
    id: this._id,
    name: this.name,
    status: this.status
  };
};

const Game = mongoose.model('Game', gameSchema);
export default Game;
