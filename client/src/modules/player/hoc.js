import React, { Component } from 'react';

const attachStateToComponent = (WrappedComponent) => {
  class HOC extends Component {
    constructor(props) {
      super(props);
      this.state = {
        raiseValue: 0,
      };

      this.updateInput = this.updateInput.bind(this);
      this.clearValue = this.clearValue.bind(this);
    }

    updateInput(event, money) {
      const val = (event.target.value === '') ? 0 : parseInt(event.target.value, 10);
      if (val >= money) {
        this.setState({ raiseValue: money });
      } else {
        this.setState({ raiseValue: val });
      }
    }

    clearValue() {
      this.setState({ raiseValue: 0 });
    }

    render() {
      return <WrappedComponent
                raiseValue = {this.state.raiseValue}
                clearValue = {this.clearValue}
                updateInput = {this.updateInput}
                {...this.props}
              />;
    }
  }

  return HOC;
};

export default attachStateToComponent;
