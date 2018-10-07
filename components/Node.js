import React, { Component, Fragment } from 'react';

import api from 'index/api';
import css from 'index/components/node.style.css';

class Node extends Component {
  state = { loading: true, data: null, preview: true };

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

  toggleView = () =>
    this.setState(prevState => ({ preview: !prevState.preview }));

  render = () => {
    const { data, loading, preview } = this.state;
    if (loading) return <div>loading</div>;
    const { thumbnail } = data;
    if (preview) {
      return (
        <div onClick={this.toggleView}>
          preview!!
          <div>{this.props.id}</div>
          <img src={thumbnail} />
        </div>
      );
    }
    return (
      <div className={css.wrapper}>
        full
        <button onClick={this.toggleView}>X</button>
        <div>{this.props.id}</div>
        <img src={thumbnail} />
      </div>
    );
  };
}

export default Node;
