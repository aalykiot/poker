import React from 'react';
import Card from '../card/container';

class Player extends React.Component {
  render() {
    const hand = this.props.player.get('hand');

    const handElement = (hand !== undefined) ? (
      hand.map((card, index) =>
        <Card
          key={ index }
          index={ index }
          weight={ card.get('rank') }
          suit={ card.get('suit') }
        />)
    ) : (<div></div>);

    return (
      <div className="playingCards simpleCards player-box">
        { handElement } <br/>
      </div>
    );
  }
}

export default Player;
