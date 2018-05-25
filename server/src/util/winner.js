import transform from './transform';
import { PokerResults } from './poker';

export default function (players) {
  const p1s = PokerResults(players[0].hand);
  const p2s = PokerResults(players[1].hand);

  const player1Score = (20 * parseInt(transform(p1s.handRate), 10)) + parseInt(p1s.handWeight, 10);
  const player2Score = (20 * parseInt(transform(p2s.handRate), 10)) + parseInt(p2s.handWeight, 10);

  const final = player1Score - player2Score;

  if (final === 0) return -1;
  if (final > 0) return 0;
  return 1;
}
