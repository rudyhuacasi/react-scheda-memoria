const Score = ({ score, bestScore }) => (
  <div className="scoreboard container d-flex justify-content-between my-5">
    <h1>Punteggio: {score}</h1>
    <h1>Miglior Punteggio: {bestScore}</h1>
  </div>
);

export default Score;