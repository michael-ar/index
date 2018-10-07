import React, { Component, Fragment } from 'react';
import firebase from 'firebase';

import api from 'index/api';
import { redirect } from 'index/utils';
import { Collection } from 'index/components';

class App extends Component {
  state = { collection: 'node[766fd1c9-06ff-49e7-8bef-5a60d03ef5cb]' };
  static async getInitialProps({ req, res }) {
    const result = await api.getUserSession(req);
    if (result.status !== 200) return redirect({ pathname: '/login' }, res);
    const props = await result.json();
    return props;
  }

  addNode = () => {
    const db = firebase.firestore().collection('nodes');
    db.doc('INSERT_UUID')
      .set({
        // ...data
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {});
  };

  render = () => {
    return (
      <Fragment>
        <button onClick={api.logout}>logout</button>
        <Collection
          csrfToken={this.props.csrfToken}
          id={this.state.collection}
        />
      </Fragment>
    );
  };
}

export default App;
