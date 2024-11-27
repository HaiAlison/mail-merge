import React from 'react';
import { Flex, } from "antd";


const ScrollableList = ({children, button}) => {
  return (
    <Flex vertical={true} style={{height: '100%'}}>
      <div
        id="scrollableDiv"
        style={{
          height: '80%',
          overflow: 'auto',
          padding: '0 16px',
          border: '1px solid rgba(140, 140, 140, 0.35)',
        }}
      > {children}
      </div>
      <div style={{height: '20%', margin: '20px 0 0 auto'}}>
        {button}
      </div>
    </Flex>
  );
};

export default ScrollableList;