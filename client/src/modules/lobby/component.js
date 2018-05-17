import React from 'react';

import '../../stylesheets/app.css';

const Lobby = ({
    status,
    joined 
}) => {

    return (joined) ? (
            <div className="lobby-container">
                <div>
                    <div className="text">{status}</div>
                </div>
            </div>
    ) : (
            <div className="lobby-container">
                <div>
                    <div className="text">This is the table area</div>
                </div>
            </div>
    );

}

export default Lobby;