import React from 'react';
import Pot from '../../components/pot';
import Player from '../player/container';
import Opponent from '../opponent/container';

const Table = ({ potValue }) => (
      <div className="container">
        <Opponent />
        <Pot value={potValue} />
        <Player />
      </div>
);

export default Table;
