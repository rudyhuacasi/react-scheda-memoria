const Score = ({ score, bestScore }) => (
  <div className="scoreboard">
    <p>Puntaje: {score}</p>
    <p>Mejor Puntaje: {bestScore}</p>
  </div>
);

export default Score;