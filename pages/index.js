import React, { Component, Fragment } from 'react';
import firebase from 'firebase';
import 'isomorphic-unfetch';

import firebaseConfig from '../config/firebase';

class App extends Component {
  static async getInitialProps({ req, query }) {
    console.log('request!');
    console.dir(req);
    return {};
  }

  componentDidMount() {
    firebase.initializeApp(firebaseConfig.client);

    // if (this.state.user) this.addDbListener();

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log('user!');
        console.dir(user);
        this.user = user;
        // this.setState({ user: user });
        // return user
        //   .getIdToken()
        //   .then(token => {
        //     // eslint-disable-next-line no-undef
        //     return fetch('/api/login', {
        //       method: 'POST',
        //       // eslint-disable-next-line no-undef
        //       headers: new Headers({ 'Content-Type': 'application/json' }),
        //       credentials: 'same-origin',
        //       body: JSON.stringify({ token }),
        //     });
        //   })
        //   .then(res => this.addDbListener());
      } else {
        console.log('no-user!');
        //     this.setState({ user: null });
        // // eslint-disable-next-line no-undef
        // fetch('/api/logout', {
        //   method: 'POST',
        //   credentials: 'same-origin',
        // }).then(() =>
        //   firebase
        //     .database()
        //     .ref('messages')
        //     .off(),
        // );
      }
    });
  }

  addNode = () => {
    const db = firebase.firestore().collection('nodes');
    db.doc('INSERT_UUID')
      .set({
        // ...data
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {})
      .catch(e => console.log('error-adding!', e));
  };

  sendAuth = () => {
    // const token = this.user.getIdToken();
    this.user
      .getIdToken()
      .then(token => {
        console.log('token!', token);
        return fetch('/api/search', {
          method: 'POST',
          headers: new Headers({ 'Content-Type': 'application/json' }),
          credentials: 'same-origin',
          body: JSON.stringify({
            token,
            id: 'node[8415a1bd-2747-46ca-ae6d-cd910bd1aa34]',
          }),
        }).then(async res => {
          const data = await res.json();
          console.log('res!!', data);
          return data;
        });
      })
      .then(res => console.log('res-of-auth!', res));
  };

  login = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(
        'michaelandreynolds@gmail.com',
        'muchos-xEdni-19-1!',
      )
      .catch(function(error) {
        console.log('error!');
        console.log(error);
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      });
  };

  render = () => {
    return (
      <Fragment>
        <button onClick={this.sendAuth}>auth endpoint!</button>
        <button onClick={this.addElasticDocument}>add doc</button>
        <button
          onClick={() =>
            this.getElasticDocument(
              'node[8415a1bd-2747-46ca-ae6d-cd910bd1aa34]',
            )
          }
        >
          get url doc
        </button>
        <button
          onClick={() =>
            this.getElasticDocument(
              'node[766fd1c9-06ff-49e7-8bef-5a60d03ef5cb]',
            )
          }
        >
          get collection doc
        </button>
      </Fragment>
    );
  };
}

export default App;
