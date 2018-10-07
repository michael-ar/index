import React, { Component, Fragment } from 'react';
import firebase from 'firebase';
import Router from 'next/router';

import { redirect, getUserSession } from 'index/utils';

class App extends Component {
  static async getInitialProps({ req, res }) {
    const result = await getUserSession(req);
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
      .then(() => {})
      .catch(e => console.log('error-adding!', e));
  };

  sendAuth = () => {
    this.state.user
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
      .catch(error => {
        console.log('error!');
        console.log(error);
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      });
  };

  logout = async () =>
    await fetch(`/api/logout`, {
      method: 'POST',
      credentials: 'include',
    }).then(res => console.log('logout res!', res) || Router.replace('/login'));

  render = () => {
    return (
      <Fragment>
        <button onClick={this.sendAuth}>auth endpoint!</button>
        <button onClick={this.login}>login</button>
        <button onClick={this.logout}>logout</button>
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
