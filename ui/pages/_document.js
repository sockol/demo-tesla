// _document is only rendered on the server side and not on the client side
// Event handlers like onClick can't be added to this file

// ./pages/_document.js
import React from 'react';
import Document, { Head, Main, NextScript, NextCss } from 'next/document';

// Import styled components ServerStyleSheet
import { ServerStyleSheet } from 'styled-components';
import colors from 'config/colors';

export default class MyDocument extends Document {

  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);

    // Step 1: Create an instance of ServerStyleSheet
    const sheet = new ServerStyleSheet();

    // Step 2: Retrieve styles from components in the page
    const page = ctx.renderPage(App => props =>
      sheet.collectStyles(<App {...props} />),
    );

    // Step 3: Extract the styles as <style> tags
    const styleTags = sheet.getStyleElement();

    // Step 4: Pass styleTags as a prop
    return { ...initialProps, ...page, styleTags };
  }

  render() {
    return (
      <html theme={{ colors, }} lang="en-US">

        {/* NOTE: next does not compose nested HEAD tags into one. just takes the latest one.
          So this can get overridden by SeoInjector  */}
        <Head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="robots" content="index,follow" />
          <link rel="icon" type="image/x-icon" href="/static/favicon.png" />

          {this.props.styleTags}

        </Head>

        <body>
          <Main/>
          <NextScript />
        </body>
      </html>
    );
  }

}
