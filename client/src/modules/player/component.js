import React from 'react';
import Card from '../../components/card';
import { PokerHand, hasAce } from '../../util/poker';

const Player = (props) => {
  const changeModeTo = (mode) => {
    props.dispatch(props.setMode(mode));
  };

  const next = () => {
    if (props.mode === 'raising') {
      if (props.raiseValue === 0) return;
      props.emit('bet', props.raiseValue);
      props.clearValue();
      props.dispatch(props.wait());
      changeModeTo('idle');
    } else {
      props.emit('replace', props.selected.toJS());
      props.dispatch(props.clearSelected());
      changeModeTo('raising');
    }
  };

  const manageCard = (index, selected) => {
    if (props.mode !== 'selecting') return;
    const limit = (hasAce(props.hand)) ? 4 : 3;
    const { size } = props.selected;
    if (!selected) {
      if (size < limit) props.dispatch(props.selectCard(index));
    } else {
      props.dispatch(props.deselectCard(index));
    }
  };

  const raising = (props.mode === 'raising');
  const selecting = (props.mode === 'selecting');

  const nextButton = <button className="option-button" onClick={next}>Next</button>;
  const foldButton = <button className="option-button">Fold</button>;

  const actionButton = (props.mode === 'idle' && props.bet > 0) ? (
    <button className="option-button" onClick={() => changeModeTo('selecting')}>Select</button>
  ) : (
    <button className="option-button" onClick={() => changeModeTo('raising')}>Raise</button>
  );

  const handElement = props.hand.map((card, index) =>
      <Card
        key={index}
        index={index}
        selected={props.selected.indexOf(index) >= 0}
        weight={card.get('rank')}
        suit={card.get('suit')}
        manageCard={manageCard}
      />);

  const labelElement = (props.hand.size !== 0) ? (
    <span className="result">{PokerHand(props.hand).type}</span>
  ) : (
    <span className="result"></span>
  );

  const moneyElement = <span className="bet-box">{props.money} $</span>;

  const inputElement = <input
    type="text"
    className="input-box"
    onChange={event => props.updateInput(event, props.money)}
    value={props.raiseValue.toString()}
    placeholder="0"
  />;

  const renderWinnerElement = () => {
    const { winner } = props;
    switch (winner) {
      case 'None':
        return (<span className="hud-text"> Looks like a tie!</span>);
      case props.player.get('id'):
        return (<span className="hud-text"> Congratulations you win!</span>);
      default:
        return (<span className="hud-text"> So sorry! Opponent beat you :(</span>);
    }
  };

  return (
    <div className="playingCards simpleCards player-box">
      {labelElement}<br/>
      {handElement} <br/><br/>
      {!raising && moneyElement}
      {!props.waiting && raising && inputElement}
      {!props.waiting && (raising || selecting) && nextButton}
      {!props.waiting && !raising && !selecting && actionButton}
      {!props.waiting && foldButton}
      {props.waiting && !props.winner
        && <span className="hud-text"> Waiting for opponent to play...</span>
      }
      {props.winner && renderWinnerElement()}
    </div>
  );
};

export default Player;
