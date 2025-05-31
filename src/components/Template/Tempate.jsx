import React from "react";
import Home from "../../pages/Home";
import { Card, Col, Row } from "antd";

function Template() {
  return (
   <Home>
     <Row>
       <Col span={8}>
          <Card title="Card title" bordered={false} style={{ width: 300 }}>
            <p>Card content</p>
            <p>Card content</p>
            <p>Card content</p>
          </Card>
       </Col>
     </Row>
    </Home>
  );
}

export default Template;