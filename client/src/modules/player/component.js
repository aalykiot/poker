import React from 'react';
import Card from '../card/container';
import { PokerHand, hasAce } from '../../util/poker';

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
    this.props.dispatch(this.props.setMode(mode));
  }

  next() {
    if (this.props.mode === 'raising') {
      if (this.state.raiseValue === 0) return;
      this.props.emit('bet', this.state.raiseValue);
      this.setState({ raiseValue: 0 });
      this.props.dispatch(this.props.wait());
      this.changeModeTo('idle');
    } else {
      this.props.emit('replace', this.props.selected.toJS());
      this.props.dispatch(this.props.clearSelected());
      this.changeModeTo('raising');
    }
  }

  manageCard(index, selected) {
    if (this.props.mode !== 'selecting') return;
    const limit = (hasAce(this.props.hand)) ? 4 : 3;
    const { size } = this.props.selected;
    if (!selected) {
      if (size < limit) this.props.dispatch(this.props.selectCard(index));
    } else {
      this.props.dispatch(this.props.deselectCard(index));
    }
  }

  render() {
    const raising = (this.props.mode === 'raising');
    const selecting = (this.props.mode === 'selecting');

    const nextButton = <button className="option-button" onClick={this.next}>Next</button>;
    const foldButton = <button className="option-button">Fold</button>;

    const actionButton = (this.props.mode === 'idle' && this.props.bet > 0) ? (
      <button className="option-button" onClick={() => this.changeModeTo('selecting')}>Select</button>
    ) : (
      <button className="option-button" onClick={() => this.changeModeTo('raising')}>Raise</button>
    );

    const handElement = this.props.hand.map((card, index) =>
        <Card
          key={index}
          index={index}
          selected={this.props.selected.indexOf(index) >= 0}
          weight={card.get('rank')}
          suit={card.get('suit')}
          manageCard={this.manageCard}
        />);

    const labelElement = (this.props.hand.size !== 0) ? (
      <span className="result">{PokerHand(this.props.hand).type}</span>
    ) : (
      <span className="result"></span>
    );

    const moneyElement = <span className="bet-box">{this.props.money} $</span>;

    const inputElement = <input
      type="text"
      className="input-box"
      onChange={event => this.updateInput(event, this.props.money)}
      value={this.state.raiseValue.toString()}
      placeholder="0"
    />;

    return (
      <div className="playingCards simpleCards player-box">
        {labelElement}<br/>
        {handElement} <br/><br/>
        {!raising && moneyElement}
        {!this.props.waiting && raising && inputElement}
        {!this.props.waiting && (raising || selecting) && nextButton}
        {!this.props.waiting && !raising && !selecting && actionButton}
        {!this.props.waiting && foldButton}
        {this.props.waiting && <span className="hud-text"> Waitting for opponent to play...</span>}
      </div>
    );
  }
}

export default Player;
