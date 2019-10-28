import React from 'react';
import Error from 'components/Error';

class Page extends React.Component {

  render() {
    return (
      <Error statusCode={500}>
        {this.props.error}
      </Error>
    );
  }

}

Page.getInitialProps = ({ req, res, err }) => {
  const error = req ? req.query.error : `Error`;
  return { error };
};

export default Page;
