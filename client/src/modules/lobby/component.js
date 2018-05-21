import React from 'react';
import Table from '../table/container';
import '../../stylesheets/app.css';

const Lobby = ({
    status,
    joined
}) => {

    return (!joined) ? (
            <div className="lobby-container">
                  <div className="text">{ status }</div>
            </div>
    ) : (
            <Table/>
    );

}

export default Lobby;
