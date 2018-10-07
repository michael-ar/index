import React from 'react';
import Router from 'next/router';
import firebase from 'firebase';

const login = e => {
  e.preventDefault();
  firebase
    .auth()
    .signInWithEmailAndPassword(
      'michaelandreynolds@gmail.com',
      'muchos-xEdni-19-1!',
    )
    .then(user => {
      console.log('user!');
      console.log(user);

      return user.user.getIdToken().then(token =>
        fetch('/api/login', {
          method: 'POST',
          headers: new Headers({ 'Content-Type': 'application/json' }),
          credentials: 'same-origin',
          body: JSON.stringify({ token }),
        }),
      );
    })
    .then(res => {
      Router.replace('/');
      console.log('res!');
      console.log(res);
    })
    .catch(function(error) {
      console.log('error!');
      console.log(error);
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
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
