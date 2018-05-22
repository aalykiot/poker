import { connect } from 'react-redux';
import Player from './component';

const mapStateToProps = state => ({
  opponent: state.opponent,
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Player);
