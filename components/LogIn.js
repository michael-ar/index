import React from 'react';
import Router from 'next/router';
import firebase from 'firebase';

import { user } from 'index/config/firebase';

const login = e => {
  e.preventDefault();
  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then(user =>
      user.user.getIdToken().then(token =>
        fetch('/api/login', {
          method: 'POST',
          headers: new Headers({ 'Content-Type': 'application/json' }),
          credentials: 'same-origin',
          body: JSON.stringify({ token }),
        }),
      ),
    )
    .then(() => Router.replace('/'))
    .catch(error => {
      console.log('error!');
      console.log(error);
    });
};

const LogIn = props => {
  return (
    <div>
      <form>
        <input type={'email'} name={'email'} placeholder={'email'} />
        <input type={'password'} name={'password'} placeholder={'password'} />
        <input type={'submit'} onClick={login} value={'Log in'} />
      </form>
    </div>
  );
};

export default LogIn;
