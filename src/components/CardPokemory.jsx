import React from 'react';
import '../styles/CardPokemory.css';

function CardPokemory({ card, onClick, isFlipped }) {

  return (
    <>
      <div className="memory-card col-3 rounded-3" onClick={() => onClick(card)}>
      <div className={`inner ${isFlipped ? 'flipped' : ''}`}>
        <div className="front d-flex flex-column">
          <img src={card.image} alt={card.name} />
          <h3 className='mayus'>{card.name}</h3>
        </div>
      </div>
    </div>
    </>
  )
}

export default CardPokemory
