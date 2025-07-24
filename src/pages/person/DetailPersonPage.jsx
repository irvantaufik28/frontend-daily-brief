import React, { useState } from 'react';
import './styles/detailPerson.css';
import { Nav } from 'react-bootstrap';
import TabPersonInfo from './components/Tabs/TabPersonInfo';
import TabPersonSecurityInfo from './components/Tabs/TabPersonSecurityInfo';
import TabProjectInfo from './components/Tabs/TabProjectInfo';


const DetailPersonPage = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <TabPersonInfo />;
      case "project":
        return <TabProjectInfo />;
      case "security":
        return <TabPersonSecurityInfo />;
      default:
        return null;
    }
  };

  return (
    <>
      <Nav className='tab-detail-person'
      justify
        variant="tabs"
        activeKey={activeTab}
        onSelect={(selectedKey) => setActiveTab(selectedKey)}
      >
        <Nav.Item>
          <Nav.Link eventKey="profile">Profile</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="project">Project</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="security">Security</Nav.Link>
        </Nav.Item>
      </Nav>

      <div className="tab-content-person">
        {renderTabContent()}
      </div>
    </>
  );
};

export default DetailPersonPage;
