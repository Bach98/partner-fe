import React from "react";
import { Button, Modal, Tooltip } from "antd";

const HOCButtonConfirm = (props) => {
  const [modal, contextHolder] = Modal.useModal();
  return (
    <React.Fragment>
      {contextHolder}
      <Tooltip placement="top" title={props.tooltip}>
        <Button
          onClick={(e) => {
            modal.confirm({
              ...props.confirm,
            });
          }}
          {...props.button}
        />
      </Tooltip>
    </React.Fragment>
  );
};

export default HOCButtonConfirm;
