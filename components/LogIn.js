import React from 'react';
import Router from 'next/router';
import firebase from 'firebase';

import api from 'index/api';
import { user } from 'index/config/firebase';

const login = e => {
  e.preventDefault();
  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then(({ user }) => user.getIdToken().then(api.login));
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
