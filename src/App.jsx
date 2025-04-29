import React, { useEffect, useState } from 'react';
import './App.css';
import Title from './components/Title';
import CardPokemory from './components/CardPokemory';
import Score from './components/Score';

function App() {
  const [offset, setOffset] = useState(0);
  const [level, setLevel] = useState(1);
  const POKEMON_API = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${level}`;

  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [score, setScore] = useState(0);
  const [step, setStep] = useState(0);
  const [bestScore, setBestScore] = useState(
    Number(localStorage.getItem('bestScore')) || 0
  );

  useEffect(() => {
    fetchPokemons();
  },[offset, level]);

  useEffect(() => {
    if (matched.length === level) {
      setTimeout(() => setStep(2), 500);
    }
  }, [matched, level]);

  const fetchPokemons = async () => {
    const res = await fetch(POKEMON_API);
    const data = await res.json();

    const promises = data.results.map(async (pokemon) => {
      const res = await fetch(pokemon.url);
      const pokeData = await res.json();
      return {
        name: pokeData.name,
        image: pokeData.sprites.front_default,
        id: pokeData.id,
      };
    });

    const results = await Promise.all(promises);

    const duplicated = [...results, ...results].map((card, index) => ({
      ...card,
      uniqueKey: `${card.id}-${index}`,
    }));

    setCards(shuffleArray(duplicated));
    setFlipped([]);
    setMatched([]);
    setScore(0);
  };

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const handleCardClick = (card) => {
    if (
      flipped.length === 1 &&
      flipped[0].uniqueKey === card.uniqueKey
    ) {
      return; 
    }

    if (flipped.length === 1) {
      const first = flipped[0];
      const second = card;

      const newFlipped = [first, second];
      setFlipped(newFlipped);

      if (first.name === second.name) {
        setMatched((prev) => [...prev, first.name]);
        const newScore = score + 1;
        setScore(newScore);

        if (newScore > bestScore) {
          setBestScore(newScore);
          localStorage.setItem('bestScore', newScore);
        }

        setTimeout(() => setFlipped([]), 1000);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    } else {
      setFlipped([card]);
    }

  };

  // inizare a andare avanti con la validazione
  const nextStep = () => {
      setStep(step + 1);
  };

  const getRandomOffset = () => Math.floor(Math.random() * 1000);

const handleResetGame = () => {
  setOffset(getRandomOffset());
  setTimeout(() => setStep(1), 1000);
};

const increaseLimit = () => {
  setLevel((prevLevel) => {
    const newLevel = Math.min(prevLevel + 1, 100);
    return newLevel;
  });
  setOffset(getRandomOffset()); 
  setTimeout(() => setStep(1), 1000);
};


  return (
    <>
      <Title />
      <div className="app">
        <Score score={score} bestScore={bestScore} />
        { step === 0 &&( <img onClick={nextStep} className='curso w-25 rounded-4' src="/images/inizia_gioco.jpg" alt="" />)}
        { step === 1 && (
          <div className='container'>
            <h2>LIVELLO  {level}</h2>
            <div className="row g-4 my-5">
              {cards.map((card) => (
                <CardPokemory
                  key={card.uniqueKey}
                  card={card}
                  onClick={handleCardClick}
                  isFlipped={
                    flipped.find((c) => c.uniqueKey === card.uniqueKey) ||
                    matched.includes(card.name)
                  }
                />
              ))}
            </div>
          </div>
        )}
        { step === 2 &&( 
        <div className="end-screen">
            <h2>Congratulazioni! Hai completato il livello {level}.</h2>
            <div className="container mt-4 mb-5 d-flex justify-content-center">
              <button className='btn' onClick={handleResetGame}>Riavvia Gioco</button>
              <button className='ms-5 livello' onClick={increaseLimit}>
                <span>PROSSIMO LIVELLO</span>
              </button>
            </div>

          </div>
        )}


      </div>
    </>
  );
}

export default App;
