import React, { useState } from 'react';
import {
  MailOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { useLocation, useNavigate } from "react-router-dom";
import Logout from "./Logout";

const {Header, Content, Footer, Sider} = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem('Dashboard', '1', <PieChartOutlined/>),
  getItem('Mails', '2', <MailOutlined/>),
  getItem('Team', 'sub2', <TeamOutlined/>, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
  getItem('Files', '9', <FileOutlined/>),
];
const Home = ({children}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: {colorBgContainer, borderRadiusLG},
  } = theme.useToken();
  const selectedKey = items.find(item => `/${item.label}` === location.pathname)?.key || '1';

  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical"/>
        <Menu theme="dark" defaultSelectedKeys={[selectedKey]}
              mode="inline" items={items}
              onClick={(e) => {
                const path = e.keyPath.reverse().map(key => items.find(item => item.key === key)?.label);
                navigate(`/${path.join('/')}`);
              }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}>
          <Logout/>
        </Header>
        <Content
          style={{
            margin: '0 16px',
          }}
        >
          <Breadcrumb style={{margin: '16px 0'}}>
            {useLocation().pathname.split('/').map((item, index) => (
              <Breadcrumb key={index}>{item}</Breadcrumb>
            ))}
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </div>
        </Content>
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};
export default Home;