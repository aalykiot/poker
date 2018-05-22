import React from 'react';
import _ from 'lodash';
import Card from '../card/container';

class Opponent extends React.Component {
  render() {
    const hand = this.props.opponent.get('hand');

    const handElement = (hand.size !== 0) ? (
      hand.map((card, index) =>
        <Card
          key={ index }
          index={ index }
          weight={ card.get('rank') }
          suit={ card.get('suit') }
        />)
    ) : (
      _.times(5, () => <div className="card back">*</div>)
    );

    return (
      <div className="playingCards simpleCards player-box">
        { handElement } <br/>
      </div>
    );
  }
}

export default Opponent;
