import { Map, List, fromJS } from 'immutable';
import { Cards } from './poker';
import findWinner from './winner';

class Manager {
  constructor() {
    this.initialState = Map({
      clients: List([]),
      deck: fromJS(Cards),
      deckIndex: 0,
      pot: 0,
      winner: null,
      players: List([]),
      roundTrips: 0,
    });
    this.playerBlueprint = Map({
      id: null,
      hand: List([]),
      money: 1500,
      bet: 0,
    });
    this.state = this.initialState;
  }

  getState() { return this.state.toJS(); }

  execute(action, payload) {
    this.state = this.dispatch(action, payload);
  }

  dispatch(action, payload) {
    switch (action) {
      case 'ADD_PLAYER':
        return this.state
          .update('players', players => players.push(this.playerBlueprint.set('id', payload)))
          .update('clients', lst => lst.push(payload));

      case 'SHUFFLE_DECK':
        return this.state.update('deck', deck => deck.sortBy(Math.random)).set('deckIndex', 0);

      case 'DRAW_PLAYER_CARDS':
        return this.state
          .updateIn(['players', payload.index], player =>
            player
              .set('hand', this.state.get('deck')
                .slice(this.state.get('deckIndex'), this.state.get('deckIndex') + 5))
              .set('waiting', payload.waiting))
          .update('deckIndex', val => val + 5);

      case 'PLAYER_BETS':
        return this.state
          .updateIn(['players', payload.index], player =>
            player
              .update('bet', bet => bet + parseInt(payload.bet, 10))
              .update('money', money => money - parseInt(payload.bet, 10))
              .set('waiting', true))
          .updateIn(
            ['players', Math.abs(payload.index - 1)],
            player => player.set('waiting', (this.state.get('roundTrips') >= 3)),
          )
          .update('pot', pot => pot + payload.bet)
          .update('roundTrips', trips => trips + 1);

      case 'REPLACE_CARDS':
        return this.state.updateIn(['players', payload.index], player =>
          player.update('hand', hand => hand.filter((card, i) => {
            if (payload.cards.indexOf(i) === -1) return true;
            return false;
          }).concat(this.state.get('deck')
            .slice(this.state.get('deckIndex'), this.state.get('deckIndex') + payload.cards.length))))
          .update('deckIndex', val => val + payload.cards.length);

      case 'FIND_WINNER':
        const winnerIndex = findWinner(this.state.get('players').toJS());
        const isTie = (winnerIndex === -1);

        return this.state.set('winner', {
          isTie,
          index: (isTie) ? null : winnerIndex,
          socketId: (isTie) ? null : this.state.getIn(['clients', winnerIndex]),
        });

      case 'GIVE_EARNINGS':
        return this.state.updateIn(['players', this.state.get('winner').index], player => player
          .update('money', money => money + parseInt(this.state.get('pot'), 10)));

      case 'RETURN_BETS':
        return this.state
          .updateIn(['players', 0], player => player.update('money', money => money + player.bet))
          .updateIn(['players', 1], player => player.update('money', money => money + player.bet));

      case 'NEW_ROUND':
        return this.state
          .setIn(['players', 0, 'bet'], 0)
          .setIn(['players', 0, 'bet'], 0)
          .set('pot', 0)
          .set('winner', null)
          .set('roundTrips', 0);

      case 'RESET':
        return this.initialState;

      default:
        return this.state;
    }
  }
}

export default Manager;
