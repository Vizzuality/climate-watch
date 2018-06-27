import { PureComponent, createElement } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import actions from './ndcs-actions';
import reducers, { initialState } from './ndcs-reducers';

import Component from './ndcs-component';
import { getAnchorLinks } from './ndcs-selectors';

const mapStateToProps = (state, { route, location }) => ({
  anchorLinks: getAnchorLinks(route),
  query: location.search
});

class NDCContainer extends PureComponent {
  render() {
    return createElement(Component, this.props);
  }
}

export { actions, reducers, initialState };
export default withRouter(connect(mapStateToProps, actions)(NDCContainer));
