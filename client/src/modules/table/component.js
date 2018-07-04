import React from 'react';
import Pot from '../../components/pot';
import Player from '../player/index';
import Opponent from '../opponent/index';

const Table = ({ potValue }) => (
      <div className="container">
        <Opponent />
        <Pot value={potValue} />
        <Player />
      </div>
);

export default Table;
