export default (state, index, opponentHand = false) => ({
  table: {
    pot: state.pot,
    winner: state.winner,
    turn: state.turn,
  },
  player: { ...state.players[index] },
  opponent: {
    ...state.players[Math.abs(index - 1)],
    hand: (opponentHand === true) ? state.players.hand[Math.abs(index - 1)] : [],
  },
});
