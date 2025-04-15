import React, { useEffect, useState } from 'react';
import './App.css';
import Title from './components/Title';
import CardPokemory from './components/CardPokemory';
import Score from './components/Score';

function App() {
  const [offset, setOffset] = useState(0);
  const POKEMON_API = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=2`;

  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(
    Number(localStorage.getItem('bestScore')) || 0
  );

  useEffect(() => {
    fetchPokemons();
  }, [offset]);

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

  const handleResetGame = () => {
    setOffset((prevOffset) => prevOffset + 8); // Aumentar el offset en 8 cada vez
  };

  return (
    <>
      <Title />
      <div className="app">
        <Score score={score} bestScore={bestScore} />
        <button onClick={handleResetGame}>Reiniciar Juego</button>
        <div className="card-grid">
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
    </>
  );
}

export default App;
