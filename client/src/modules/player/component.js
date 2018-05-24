import React from 'react';
import Card from '../card/container';
import { PokerHand, hasAce } from '../../util/poker';
import {
  setMode,
  wait,
  selectCard,
  deselectCard,
} from './actions';

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      raiseValue: 0,
    };
    this.updateInput = this.updateInput.bind(this);
    this.changeModeTo = this.changeModeTo.bind(this);
    this.manageCard = this.manageCard.bind(this);
    this.next = this.next.bind(this);
  }

  updateInput(event, money) {
    const val = (event.target.value === '') ? 0 : parseInt(event.target.value, 10);
    if (val >= money) {
      this.setState({ raiseValue: money });
    } else {
      this.setState({ raiseValue: val });
    }
  }

  changeModeTo(mode) {
    this.props.dispatch(setMode(mode));
  }

  next() {
    const mode = this.props.player.get('mode');
    if (mode === 'raising') {
      this.props.emit('bet', this.state.raiseValue);
      this.props.dispatch(wait());
      this.changeModeTo('idle');
    } else {
      // Send request to for new cards (WIP)
      this.changeModeTo('reasing');
    }
  }

  manageCard(index, selected) {
    if (this.props.player.mode !== 'selecting') return;
    const limit = (hasAce(this.props.player.get('hand'))) ? 4 : 3;
    const { size } = this.props.player.get('selected');
    if (!selected) {
      if (size < limit) this.props.dispatch(selectCard(index));
    } else {
      this.props.dispatch(deselectCard(index));
    }
  }

  render() {
    const mode = this.props.player.get('mode');
    const hand = this.props.player.get('hand');
    const money = this.props.player.get('money');
    const bet = this.props.player.get('bet');
    const waiting = this.props.player.get('waiting');

    const raising = (mode === 'raising');
    const selecting = (mode === 'selecting');

    const nextButton = <button className="option-button" onClick={this.next}>Next</button>;
    const foldButton = <button className="option-button">Fold</button>;

    const actionButton = (mode === 'idle' && bet > 0) ? (
      <button className="option-button" onClick={() => this.changeModeTo('selecting')}>Select</button>
    ) : (
      <button className="option-button" onClick={() => this.changeModeTo('raising')}>Raise</button>
    );

    const handElement = hand.map((card, index) =>
        <Card
          key={index}
          index={index}
          selected={this.props.player.get('selected').indexOf(index) >= 0}
          weight={card.get('rank')}
          suit={card.get('suit')}
          manageCard={this.manageCard}
        />);

    const labelElement = (hand.size !== 0) ? (
      <span className="result">{PokerHand(hand).type}</span>
    ) : (
      <span className="result"></span>
    );

    const moneyElement = <span className="bet-box">{money} $</span>;

    const inputElement = <input
      type="text"
      className="input-box"
      onChange={event => this.updateInput(event, money)}
      value={this.state.raiseValue.toString()}
      placeholder="0"
    />;

    return (
      <div className="playingCards simpleCards player-box">
        {labelElement}<br/>
        {handElement} <br/><br/>
        {!raising && moneyElement}
        {!waiting && raising && inputElement}
        {!waiting && (raising || selecting) && nextButton}
        {!waiting && !raising && !selecting && actionButton}
        {!waiting && foldButton}
        {waiting && <span className="hud-text"> Waitting for opponent to play...</span>}
      </div>
    );
  }
}

export default Player;
