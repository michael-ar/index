import React, { StrictMode } from 'react';
import App, { Container } from 'next/app';
import firebase from 'firebase';
import 'isomorphic-unfetch';

import firebaseConfig from 'index/config/firebase';

export default class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    const props = {};
    if (Component.getInitialProps) {
      props.pageProps = await Component.getInitialProps(ctx);
    }
    return props;
  }

  componentDidMount = () => {
    firebase.initializeApp(firebaseConfig.client);
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
  };

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <StrictMode>
          <Component {...this.state} {...pageProps} />
        </StrictMode>
      </Container>
    );
  }
}
