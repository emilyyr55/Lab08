var mongoose = require("mongoose");

var gameSchema = new mongoose.Schema({
  player1: String,
  player2: String,
  board: [],
  turn: String,
  gameOver: Boolean,
  winner: String,
  chancesLeft: Number,
});

mongoose.model("Game", gameSchema);
