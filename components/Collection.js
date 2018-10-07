import React, { Component, Fragment } from 'react';

import api from 'index/api';
import { Node } from 'index/components';

class Collection extends Component {
  state = { loading: true, data: null };

  componentDidMount = () => this.fetchData();

  componentDidUpdate = prevProps => {
    if (this.props.id !== prevProps.id) this.fetchData();
  };

  fetchData = () => {
    this.setState({ loading: true }, async () => {
      const { _source: data } = await api.getElasticNode(
        this.props.id,
        this.props.csrfToken,
      );
      this.setState({ data, loading: false });
    });
  };

  render = () => {
    const { data, loading } = this.state;
    if (loading) return <div>loading</div>;
    const { content } = data;
    return (
      <Fragment>
        <div>collection!</div>
        {content.map(node => (
          <Node key={node} csrfToken={this.props.csrfToken} id={node} />
        ))}
      </Fragment>
    );
  };
}

export default Collection;
