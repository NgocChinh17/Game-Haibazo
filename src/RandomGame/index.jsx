import React, { useState, useEffect } from "react";
import { Button, Input, message } from "antd";

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const RandomGame = () => {
  const [points, setPoints] = useState(0);
  const [numbers, setNumbers] = useState([]);
  const [positions, setPositions] = useState([]);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [nextNumber, setNextNumber] = useState(1);
  const [gameStatus, setGameStatus] = useState("");

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 0.1);
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleStart = () => {
    if (points > 0) {
      const generatedNumbers = Array.from({ length: points }, (_, index) => index + 1);
      setNumbers(shuffleArray(generatedNumbers));

      const numberWidth = 100;
      const numberHeight = 250;
      const uniquePositions = [];
      const usedCoordinates = new Set();

      while (uniquePositions.length < points) {
        const left = Math.random() * (777 - numberWidth);
        const top = Math.random() * (650 - numberHeight);
        const key = `${left.toFixed(2)},${top.toFixed(2)}`;

        if (!usedCoordinates.has(key)) {
          usedCoordinates.add(key);
          uniquePositions.push({ left, top });
        }
      }

      setPositions(uniquePositions);
      setIsPlaying(true);
      setTime(0);
      setNextNumber(1);
      setGameStatus("");
    }
  };

  const handleNumberClick = (num) => {
    if (num === nextNumber) {
      const index = numbers.indexOf(num);
      if (index !== -1) {
        setNumbers((prevNumbers) => prevNumbers.filter((n) => n !== num));
        setPositions((prevPositions) => prevPositions.filter((_, idx) => idx !== index));
        setNextNumber((prev) => prev + 1);

        if (numbers.length === 1) {
          message.success(
            `Congratulations! You've won! Time: ${time.toFixed(1)} seconds.`
          );
          setGameStatus("ALL CLEARED");
          setIsPlaying(false);
        }
      }
    } else {
      message.error("You clicked the wrong number! Game Over.");
      setGameStatus("Game Over");
      setIsPlaying(false);
    }
  };

  return (
    <div
      style={{
        border: "1px solid #333",
        width: 800,
        height: "95vh",
        margin: "20px 0 0 20px",
      }}
    >
      <div>
        <h2
          style={{
            margin: "10px 0 10px 10px",
            color:
              gameStatus === "ALL CLEARED"
                ? "green"
                : gameStatus === "Game Over"
                ? "red"
                : "black",
          }}
        >
          {gameStatus || "LET'S PLAY"}
        </h2>
        <p style={{ margin: "0 0 10px 10px" }}>
          Points:
          <span>
            <Input
              type="number"
              min={0}
              style={{ width: 200, marginLeft: 30 }}
              onChange={(e) => setPoints(Number(e.target.value))}
            />
          </span>
        </p>
        <p style={{ margin: "0 0 10px 10px" }}>Time: {time.toFixed(1)}s</p>
        <div>
          <Button
            type="primary"
            style={{ width: 80, margin: "0 0 10px 10px" }}
            onClick={handleStart}
          >
            {isPlaying ? "Restart" : "Start"}
          </Button>
        </div>
      </div>
      <div
        style={{
          border: "1px solid #333",
          width: 777,
          height: "70vh",
          margin: "0 10px 10px 10px",
          position: "relative",
        }}
      >
        {numbers.length > 0
          ? numbers.map((num, index) => (
              <div
                key={num}
                onClick={() => handleNumberClick(num)}
                style={{
                  position: "absolute",
                  left: positions[index]?.left,
                  top: positions[index]?.top,
                  width: "50px",
                  height: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  fontWeight: "bold",
                  background: "#f0f0f0",
                  border: "1px solid #333",
                  borderRadius: "50%",
                  cursor: "pointer",
                  zIndex: points - num + 1,
                }}
              >
                {num}
              </div>
            ))
          : "Random Numbers will appear here!"}
      </div>
    </div>
  );
};

export default RandomGame;
