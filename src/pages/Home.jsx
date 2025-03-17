import React, { useState } from 'react';
import {
  SendOutlined, InboxOutlined,
  MailOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,

} from '@ant-design/icons';
import { Alert, Breadcrumb, Layout, Menu, theme } from 'antd';
import { useLocation, useNavigate } from "react-router-dom";
import { capitalizeFirstLetter } from "../utils/common";
import User from "../components/Auth/User";
import useNetworkStatus from "../hooks/useNetworkStatus";

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
  getItem('Trang chủ', 'dashboard', <PieChartOutlined />),
  getItem('Mails', 'mails', <MailOutlined />,
    [
      getItem('Thư đã gửi', 'sent-list',
        <InboxOutlined />),
      getItem('Soạn thư', 'send',
        <SendOutlined />),
      getItem('Template', 'template',
        <InboxOutlined />),
    ]),
  getItem('Người nhận', 'recipient', <TeamOutlined />),
  getItem('Files', 'files', <FileOutlined />),
];
const Home = ({children}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: {colorBgContainer, borderRadiusLG},
  } = theme.useToken();
  const selectedKey = items.find(item => `/${item.label}` === location.pathname)?.key || '1';
  const {isOnline, isBackendOnline} = useNetworkStatus(process.env.REACT_APP_API_URL + '/health-check');
  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={[selectedKey]}
              mode="inline" items={items}
              onClick={(e) => {
                //check if the item has children then navigate to match key
                const item = e.keyPath.reverse();
                navigate(`/${item.join('/')}`);
              }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}>
          <User />
        </Header>
        <Content
          style={{
            margin: '0 16px',
          }}
        >
          {!isOnline && <Alert message="No internet connection" type="error" showIcon />}
          {!isBackendOnline && <Alert message="Backend service is down" type="error" showIcon />}

          <Breadcrumb style={{margin: '16px 0'}}>
            {useLocation().pathname.split('/').map((item, index) => {
              if (!item) return null;
              const capitalizedItem = capitalizeFirstLetter(item);
              return (
                <Breadcrumb key={index}>
                  {index === 1 ? capitalizedItem : ` > ${capitalizedItem}`}
                </Breadcrumb>
              );
            })}
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              height: '100%',
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