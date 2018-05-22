import React from 'react';
import _ from 'lodash';
import Card from '../card/container';
import { PokerHand } from '../../util/poker';

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      raising: false,
      selecting: false,
      raiseValue: 0,
    };
    this.updateInput = this.updateInput.bind(this);
    this.raise = this.raise.bind(this);
  }

  updateInput(event, money) {
    const val = (event.target.value === '') ? 0 : parseInt(event.target.value, 10);
    if (val >= money) {
      this.setState({ raiseValue: money });
    } else {
      this.setState({ raiseValue: val });
    }
  }

  raise() {
    this.setState({ raising: true });
  }

  render() {
    const {
      raising,
      selecting,
    } = this.state;

    const waiting = (this.props.turn === this.props.player.get('id'));
    const hand = this.props.player.get('hand');
    const money = this.props.player.get('money');

    const handElement = (hand.size !== 0) ? (
      hand.map((card, index) =>
        <Card
          key={index}
          index={index}
          weight={card.get('rank')}
          suit={card.get('suit')}
        />)
    ) : (
      _.times(5, index => <div key={index} className="card back">*</div>)
    );

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
    const raiseButton = <button className="option-button" onClick={this.raise}>Raise</button>;
    const nextButton = <button className="option-button">Next</button>;
    const foldButton = <button className="option-button">Fold</button>;

    return (
      <div className="playingCards simpleCards player-box">
        {labelElement}<br/>
        {handElement} <br/><br/>
        {!raising && moneyElement}
        {waiting && <span className="hud-text"> Waitting for opponent to play...</span>}
        {!waiting && raising && inputElement}
        {!waiting && raising && nextButton}
        {!waiting && !raising && !selecting && raiseButton}
        {!waiting && foldButton}
      </div>
    );
  }
}

export default Player;
