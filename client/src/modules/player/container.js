import { connect } from 'react-redux';
import Player from './component';
import socketConnection from '../../util/socket';

const mapStateToProps = state => ({
  player: state.player,
  mode: state.player.get('mode'),
  hand: state.player.get('hand'),
  selected: state.player.get('selected'),
  money: state.player.get('money'),
  bet: state.player.get('bet'),
  waiting: state.player.get('waiting'),
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  emit: socketConnection.emit,
});

export default connect(mapStateToProps, mapDispatchToProps)(Player);
