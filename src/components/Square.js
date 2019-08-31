import React from "react";

const Square = ({ value }) => {
  return (
    <button className="square" onClick={() => alert("click")}>
      {value}
    </button>
  );
};

export default Square;
