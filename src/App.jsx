import Confetti from "react-confetti";
import { useState, useEffect } from 'react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import "./index.css";

import cedric from "./assets/cedric.jpg";
import hermione from "./assets/hermione.jpg";
import ron from "./assets/ron.jpg";
import dobby from "./assets/dobby.jpg";
import chang from "./assets/chang.jpg";
import ginny from "./assets/ginny.jpg";
import malfoy from "./assets/malfoy.jpg";
import voldemort from "./assets/voldemort.jpg";
import win from "./assets/win.png";

const symbols = [
  cedric,
  hermione,
  ron,
  dobby,
  chang,
  ginny,
  malfoy,
  voldemort
];

  const formatTime = (seconds)=> {
    const min = String(Math.floor(seconds/60)).padStart(2,'0');
    const sec = String(seconds % 60).padStart(2,'0');
    return `${min}:${sec}`;
  };
  
const shuffleCards = () => {
  return [...symbols, ...symbols]
    .sort(() => Math.random() - 0.5)
    .map((symbol,index)=> ({
      id:index,symbol,flipped:false
    }));
};

  
function App(){

  const [cards, setCards] = useState(() => shuffleCards());
  const [flippedIndexes, setFlippedIndexes] = useState([]);
  const [moves,setMoves] = useState(0);
  const [time,setTime] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const[gameWon, setGameWon] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // useEffect(()=>{
  //   const interval = setInterval(()=>{
  //     setTime(prev => prev + 1);
  //   },1000);
  //   return () => clearInterval(interval);
  // },[]);
  useEffect(() => {

  if (!gameStarted || isPaused || gameWon) return;

  const interval = setInterval(() => {
    setTime(prev => prev + 1);
  }, 1000);

  return () => clearInterval(interval);

}, [gameStarted, isPaused, gameWon]);
  

  useEffect(() => {
  if (matchedPairs === symbols.length) {
    setTimeout(() => {
      setGameWon(true);
    }, 300);
  }
  }, [matchedPairs, moves, time]);

  const checkMatch = (indexes, currentCards) => {
    const [first, second] = indexes;
    setMoves(prev => prev +1);
    if (currentCards[first].symbol === currentCards[second].symbol){
      setMatchedPairs(prev => prev + 1);
      setFlippedIndexes([]);
    } else{
      const newCards = cards.map((card,i) =>
        i === first || i === second ? {...card,flipped: false} : card);
        setCards(newCards);
        setFlippedIndexes([]);
    }
  };

  const handleClick = (index) => {
    if (isPaused) return;
    if (!gameStarted) return;
  if(cards[index].flipped) return;
  if (flippedIndexes.length === 2) return;
  const newCards = cards.map((card,i) =>
  i === index ? { ...card, flipped: true} : card
  );
  const newFlipped = [...flippedIndexes, index];

    setCards(newCards);
    setFlippedIndexes(newFlipped);

    if(newFlipped.length === 2){
      setTimeout(() => checkMatch(newFlipped, newCards), 800);
    }
    if (gameWon) return;
  };

  const startGame = () => {
    setCards(shuffleCards());
    setMoves(0);
    setTime(0);
    setMatchedPairs(0);
    setFlippedIndexes([]);
    setGameWon(false);
    setGameStarted(false);
    setIsPaused(false);
  };
  
  return (
  <>
    {gameWon && <Confetti />}

    <div className="game_container">

      <h1 className="title">
        Wizard Memory Game
      </h1>

      {!gameStarted && (
        <button
          className="start_btn"
          onClick={() => {
            startGame();
            setGameStarted(true);
          }}
        >
          Start Game
        </button>
      )}

      <div className="game_grid">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className="card"
            onClick={() => handleClick(index)}
          >
            <div
              className={`card_inner ${
                card.flipped ? "flipped" : ""
              }`}
            >
              <div className="card_front">
                <img
                  src={"cardbg.png"}
                  alt="Harry Potter Card"
                  className="card_image"
                />
              </div>

              <div className="card_back">
                <img
                  src={card.symbol}
                  alt="character"
                  className="character_img"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {gameWon && (
  <div className="win_overlay">

    <div className="win_card">

      <img
        src={win}
        alt="Win Card"
        className="win_bg"
      />

      <div className="win_content">
        <h2>YOU WIN !!</h2>

<p className="subtitle">
  The Sorting Hat is impressed.
</p>

<p className="stats">
  Moves: {moves}
</p>

<p className="stats">
  Time: {formatTime(time)}
</p>

        <button onClick={startGame}>
          Play Again
        </button>
      </div>

    </div>

  </div>
)}

      <div className="controls">

        <button onClick={startGame}>
          Restart
        </button>

        <div className="timer_box">
          <div className="moves">
            Moves: {moves}
          </div>

          <div className="timer">
            {formatTime(time)}
          </div>

          <div className="timer_label">
            Time
          </div>
        </div>

        <button
          onClick={() =>
            setIsPaused(!isPaused)
          }
        >
          {isPaused ? "Resume" : "Pause"}
        </button>

      </div>

    </div>
  </>
);
}
export default App;