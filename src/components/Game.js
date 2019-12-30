import React from "react";
import Board from "./Board";
import { calculateWinner } from "../utils/game-logic";

function historyReducer(state, action) {
  const { history, entryNumber } = state;
  switch (action.type) {
    case "ADD_ENTRY": {
      const newHistory = history.slice(0, entryNumber + 1);
      newHistory[newHistory.length] = action.newEntry;
      return {
        history: newHistory,
        entryNumber: newHistory.length - 1
      };
    }
    case "GO_TO_ENTRY": {
      return {
        ...state,
        entryNumber: action.entryNumber
      };
    }
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

function useHistory(initialHistory = [], initialEntryNumber = 0) {
  const [state, dispatch] = React.useReducer(historyReducer, {
    history: initialHistory,
    entryNumber: initialEntryNumber
  });
  const { history, entryNumber } = state;
  const current = history[entryNumber];
  const goToEntry = newEntryNumber =>
    dispatch({ type: "GO_TO_ENTRY", entryNumber: newEntryNumber });
  const addEntry = newEntry => dispatch({ type: "ADD_ENTRY", newEntry });
  return { history, entryNumber, current, goToEntry, addEntry };
}

function useGame() {
  const { history, entryNumber, current, goToEntry, addEntry } = useHistory([
    { squares: Array(9).fill(null) }
  ]);
  const xIsNext = entryNumber % 2 === 0;
  const { squares } = current;

  function selectSquare(square) {
    if (calculateWinner(squares) || squares[square]) {
      return;
    }
    const newSquares = [...squares];
    newSquares[square] = xIsNext ? "X" : "O";

    addEntry({ squares: newSquares });
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

  return { history, squares, selectSquare, goToStep: goToEntry, status };
}

function Game() {
  const { history, squares, selectSquare, goToStep, status } = useGame();

  const moves = history.map((step, stepNumber) => {
    const desc = stepNumber ? `Go to move #${stepNumber}` : "Go to game start";

    return (
      <li key={stepNumber}>
        <button onClick={() => goToStep(stepNumber)}>{desc}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={squares} />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

export default Game;
