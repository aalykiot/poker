import React from 'react';
import Card from '../card/container';
import { PokerHand } from '../../util/poker';
import { setMode } from './actions';

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      raiseValue: 0,
    };
    this.updateInput = this.updateInput.bind(this);
    this.changeMode = this.changeMode.bind(this);
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

  changeMode() {
    const bet = this.props.player.get('bet');
    if (bet === 0) {
      this.props.dispatch(setMode('raising'));
    } else {
      this.props.dispatch(setMode('selecting'));
    }
  }

  next() {
    const mode = this.props.player.get('mode');
    if (mode === 'raising') {
      this.props.emit('bet', this.state.raiseValue);
      this.props.dispatch(setMode('waiting'));
    }
  }

  render() {
    const mode = this.props.player.get('mode');
    const hand = this.props.player.get('hand');
    const money = this.props.player.get('money');

    const waiting = (mode === 'waiting');
    const raising = (mode === 'raising');
    const selecting = (mode === 'selecting');

    const raiseButton = <button className="option-button" onClick={this.changeMode}>Raise</button>;
    const nextButton = <button className="option-button" onClick={this.next}>Next</button>;
    const foldButton = <button className="option-button">Fold</button>;

    const handElement = hand.map((card, index) =>
        <Card
          key={index}
          index={index}
          weight={card.get('rank')}
          suit={card.get('suit')}
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
        {!waiting && raising && nextButton}
        {!waiting && !raising && !selecting && raiseButton}
        {!waiting && foldButton}
        {waiting && <span className="hud-text"> Waitting for opponent to play...</span>}
      </div>
    );
  }
}

export default Player;
