import { connect } from 'react-redux';

import Table from './component';

const mapStateToProps = state => ({
  potValue: state.table.get('pot'),
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Table);
