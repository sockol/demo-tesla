import React from 'react';

export default ({ statusCode, children }) => {

  try{
    children && console.log(children)
  }catch(error){}

  return (
    <Wrap>
      <Header>{statusCode || `Error`}</Header>
      <Error>{children}</Error>
    </Wrap>
  );
}

import styled from 'styled-components';

const Wrap = styled.div`
  color: #000;
  background: #fff;
  font-family: -apple-system, BlinkMacSystemFont, Roboto, "Segoe UI", "Fira Sans", Avenir, "Helvetica Neue", "Lucida Grande", sans-serif;
  height: 100vh;
  text-align: center;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const Header = styled.div`
  display: inline-block;
  border-right: 1px solid rgba(0, 0, 0,.3);
  margin: 0;
  margin-right: 20px;
  padding: 10px 23px 10px 0;
  font-size: 24px;
  font-weight: 500;
  vertical-align: top;
`;

const Error = styled.div`
  display: inline-block;
  text-align: left;
  line-height: 49px;
  height: 49px;
  vertical-align: middle;

  h2 {
    font-size: 14px;
    font-weight: normal;
    line-height: inherit;
    margin: 0;
    padding: 0;
  }
`
;
