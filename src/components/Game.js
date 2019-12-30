import React from "react";
import Board from "./Board";
import { calculateWinner } from "../utils/game-logic";

function gameReducer(state, action) {
  const { squares, xIsNext } = state;
  switch (action.type) {
    case "SELECT_SQUARE": {
      const { square } = action;
      const winner = calculateWinner(squares);
      if (squares[square] || winner) {
        return state;
      }
      const newSquares = [...squares];
      newSquares[square] = xIsNext ? "X" : "O";
      return {
        ...state,
        squares: newSquares,
        xIsNext: !xIsNext
      };
    }

    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function Game() {
  const [state, dispatch] = React.useReducer(gameReducer, {
    squares: Array(9).fill(null),
    xIsNext: true
  });

  const { squares, xIsNext } = state;

  function selectSquare(square) {
    dispatch({ type: "SELECT_SQUARE", square });
  }
  const winner = calculateWinner(squares);

  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (squares.every(Boolean)) {
    status = `Scratch: Cat's game`;
  } else {
    status = `Next player: ${xIsNext ? "X" : "O"}`;
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={squares} />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <div>{xIsNext ? "X's" : "O's"} Turn</div>
      </div>
    </div>
  );
}

export default Game;
