import React from 'react';
import App from 'next/app';

import { ThemeProvider } from 'styled-components';

import colors from 'config/colors';

class MyApp extends App {

  render() {
    const { Component, pageProps, apolloClient } = this.props;
    return (
      <ThemeProvider theme={{ colors }}>
        <Component {...pageProps} />
      </ThemeProvider>
    );
  }

}

export default MyApp
;
