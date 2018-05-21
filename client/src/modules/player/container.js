import { connect } from 'react-redux';
import Player from './component';

const mapStateToProps = state => ({
  player: state.player
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Player);
