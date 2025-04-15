import React from 'react';
import '../styles/CardPokemory.css';

function CardPokemory({ card, onClick, isFlipped }) {

  return (
    <>
      <div className="memory-card" onClick={() => onClick(card)}>
      <div className={`inner ${isFlipped ? 'flipped' : ''}`}>
        <div className="front">
          <img src={card.image} alt={card.name} />
        </div>
      </div>
    </div>
    </>
  )
}

export default CardPokemory
