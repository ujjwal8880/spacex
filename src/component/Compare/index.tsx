import React, { memo, FunctionComponent, useState } from "react";
import { useQueryClient } from "react-query";
import Modal from "@mui/material/Modal";
import ReactJson from "react-json-view";

import "./style.css";
import Box from "@mui/material/Box";

type ComparePropsType = {
  selectedIds: string[];
};

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80vw",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 8,
};

const Compare: FunctionComponent<ComparePropsType> = ({ selectedIds }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [compareArray, setCompareArray] = useState<any[]>([]);

  const queryClient = useQueryClient();
  const data: any = queryClient.getQueryData("launches");

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOpen = () => {
    if (selectedIds.length !== 2) {
      alert("Please select 2 Launches to compare");
    }
    if (selectedIds.length === 2) {
      setIsOpen(true);
      const _compareArray: any[] = [];
      data.pages.forEach(
        ({ data: { data: { launchesPast = [] } = {} } = {} }) => {
          launchesPast.forEach((launch: any) => {
            if (selectedIds.includes(launch.id)) {
              _compareArray.push(launch);
            }
          });
        }
      );
      setCompareArray([..._compareArray]);
    }
  };

  return (
    <div>
      {!isOpen && (
        <div
          className="compare-btn"
          style={{
            backgroundColor: selectedIds.length === 2 ? "black" : "lightgrey",
          }}
          onClick={handleOpen}
        >
          Compare ({selectedIds.length})
        </div>
      )}
      <Modal
        open={isOpen}
        onClose={handleClose}
        disableAutoFocus
        style={{
          overflow: "scroll",
        }}
      >
        <Box sx={style}>
          <div className="closeicon" onClick={handleClose}>
            X
          </div>
          <div className="compare-container">
            {compareArray.map((element) => (
              <ReactJson
                theme="grayscale"
                iconStyle="square"
                key={"mission_name"}
                style={{
                  padding: 20,
                }}
                src={element}
                collapsed={1}
                enableClipboard={false}
              />
            ))}
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default memo(Compare);
