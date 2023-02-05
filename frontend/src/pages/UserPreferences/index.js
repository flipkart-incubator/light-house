import React from "react";
import { List, Checkbox, Button, Modal } from "antd";

const data = [
  {
    primary: "Preliminary Findings",
    secondary:
      "Notifies you at the earliest stages of the development of a new Finding, prior to the publication of the report. A 'New Findings Notification' will be sent when the report is published.",
  },
  {
    primary: "New Findings",
    secondary:
      "Notifies you that we have published a new vulnerability finding in your account, and includes Severity, the Finding ID number and a link to the finding details in the Portal. No sensitive information about the vulnerability is included in these notifications.",
  },
  {
    primary: "Emerging Threat Advisories",
    secondary:
      "Includes a short description of a new high-profile vulnerability that CAST is beginning testing on, including any precautionary actions that we recommend you consider taking. Any specific issues that we identify about vulnerable system or applications will be provided in a Finding.",
  },
];

const UserPreferences = () => {
  const onChange = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };

  const [visible, setVisible] = React.useState(false);

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <div className="main-content">
      <div className="pad-1">
        <List
          size="large"
          bordered
          dataSource={data}
          renderItem={(item) => (
            <List.Item>
              <Checkbox onChange={onChange}>{item.primary}</Checkbox>
              <Button onClick={showModal} type="primary">
                Info
              </Button>
              <Modal visible={visible} onCancel={handleCancel} footer="">
                <div className="pad-1">{item.secondary}</div>
              </Modal>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default UserPreferences;
