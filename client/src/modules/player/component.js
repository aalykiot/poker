import React from 'react';
import _ from 'lodash';
import Card from '../card/container';
import { PokerHand } from '../../util/poker';

class Player extends React.Component {
  render() {
    const hand = this.props.player.get('hand');

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

    return (
      <div className="playingCards simpleCards player-box">
        {labelElement}<br/>
        {handElement} <br/>
      </div>
    );
  }
}

export default Player;
