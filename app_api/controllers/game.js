var mongoose = require("mongoose");
var gameModel = mongoose.model("Game");

var sendJSONresponse = function (res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.gameRead = function (req, res) {
  if (req.params && req.params.id !== undefined) {
    gameModel
      .findById(req.params.id)
      .then((game) => {
        if (!game) {
          sendJSONresponse(res, 404, {
            message: "game not found",
          });
          return;
        }
        console.log(game);
        sendJSONresponse(res, 200, game);
      })
      .catch((err) => {
        console.log(err);
        sendJSONresponse(res, 404, err);
        return;
      });
  }
};

module.exports.gameCreateOne = function (req, res) {
  gameModel.findOneAndUpdate(
    { player2: null, player1: { $ne: req.body.email } },
    {
      $set: {
        player2: req.body.email,
      },
    },
    { new: true },
    function (err, resp) {
      if (err) {
        console.log(err);
        sendJSONresponse(res, 400, err);
      }
      if (resp === null) {
        gameModel.create(
          {
            player1: req.body.email,
            player2: null,
            board: [0, 0, 0, 0, 0, 0, 0, 0, 0],
            turn: req.body.email,
            gameOver: false,
            winner: null,
            chancesLeft: 9,
          },
          function (err, game) {
            if (err) {
              console.log(err);
              sendJSONresponse(res, 400, err);
            } else {
              console.log(game);
              sendJSONresponse(res, 201, game);
            }
          }
        );
      } else {
        console.log("are we here?", resp);
        sendJSONresponse(res, 201, resp);
      }
    }
  );
};

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

var isGameWon = function (board) {
  let winner = 0;
  winningConditions.forEach((condition) => {
    if (winner === 0) {
      const firstSpot = board[condition[0]];
      const gameWon = condition.every((value) => firstSpot === board[value]);
      if (gameWon) {
        winner = firstSpot;
      }
    }
  });
  return winner;
};

// Request:
// Game ID
// Spot index
// Symbol (1 X or 2 O)
// Email

module.exports.gameUpdateOne = function (req, res) {
  console.log("Updating a game entry with id of " + req.body.gameId);
  console.log(req.body);

  let newBoard = req.body.board;
  newBoard[req.body.index] = req.body.symbol;
  const chancesLeft = req.body.chancesLeft - 1;

  const winner = isGameWon(newBoard);
  console.log("winner", winner);

  if (winner !== 0) {
    gameModel.findOneAndUpdate(
      { _id: req.body.gameId },
      {
        $set: {
          board: newBoard,
          chancesLeft: chancesLeft,
          winner: req.body.email,
          gameOver: true,
        },
      },
      { new: true },
      function (err, response) {
        if (err) {
          sendJSONresponse(res, 400, err);
        } else {
          sendJSONresponse(res, 201, response);
        }
      }
    );
  }

  if (winner === 0 && chancesLeft === 0) {
    gameModel.findOneAndUpdate(
      { _id: req.body.gameId },
      {
        $set: {
          board: newBoard,
          chancesLeft: chancesLeft,
          gameOver: true,
        },
      },
      { new: true },
      function (err, response) {
        if (err) {
          sendJSONresponse(res, 400, err);
        } else {
          sendJSONresponse(res, 201, response);
        }
      }
    );
  }

  if (winner === 0 && chancesLeft > 0) {
    gameModel.findOneAndUpdate(
      { _id: req.body.gameId },
      {
        $set: {
          board: newBoard,
          chancesLeft: chancesLeft,
          turn: req.body.nextTurn,
        },
      },
      { new: true },
      function (err, response) {
        if (err) {
          sendJSONresponse(res, 400, err);
        } else {
          sendJSONresponse(res, 201, response);
        }
      }
    );
  }
};
