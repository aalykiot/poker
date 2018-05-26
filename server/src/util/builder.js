export default (state, index, send = null) => ({
  table: {
    pot: state.pot,
    winner: state.winner,
  },
  player: { ...state.players[index] },
  opponent: {
    ...state.players[Math.abs(index - 1)],
    waiting: undefined,
    hand: (send !== null) ? state.players[Math.abs(index - 1)].hand : [],
  },
});
