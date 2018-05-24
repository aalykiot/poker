import { connect } from 'react-redux';
import Player from './component';
import socketConnection from '../../util/socket';

const mapStateToProps = state => ({
  player: state.player,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  emit: socketConnection.emit,
});

export default connect(mapStateToProps, mapDispatchToProps)(Player);
