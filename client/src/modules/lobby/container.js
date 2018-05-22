import { connect } from 'react-redux';
import Lobby from './component';

const mapStateToProps = state => ({
  status: state.lobby.get('status'),
  joined: state.table.get('joined'),
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Lobby);
