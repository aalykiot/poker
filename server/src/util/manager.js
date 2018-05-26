import { Map, List, fromJS } from 'immutable';
import { Cards } from './poker';

class Manager {
  constructor() {
    this.clients = List([]);
    this.initialState = Map({
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

  getClients() { return this.clients.toJS(); }

  clearClients() { this.clients = this.clients.clear(); }

  registerClient(client) { this.clients = this.clients.push(client); }

  getState() { return this.state.toJS(); }

  execute(action, payload) {
    this.state = this.dispatch(action, payload);
  }

  dispatch(action, payload) {
    switch (action) {
      case 'ADD_PLAYER':
        return this.state.update('players', players => players.push(this.playerBlueprint.set('id', payload)));

      case 'SHUFFLE_DECK':
        return this.state.update('deck', deck => deck.sortBy(Math.random));

      case 'ANOTHER_ROUNDTRIP':
        return this.state.update('roundTrips', trips => trips + 1);

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
          .updateIn(['players', Math.abs(payload.index - 1)], player => player.set('waiting', false))
          .update('pot', pot => pot + payload.bet)
          .update('roundTrips', trips => trips + 1);


      case 'RESET':
        return this.initialState;

      default:
        return this.state;
    }
  }
}

export default Manager;
