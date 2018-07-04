import { connect } from 'react-redux';
import Opponent from './component';

const mapStateToProps = state => ({
  opponent: state.opponent,
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Opponent);
