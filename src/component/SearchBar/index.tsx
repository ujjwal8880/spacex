import React, { memo, FunctionComponent } from "react";
import Input from "@mui/material/Input";

import "./style.css";

type SearchBarPropsType = {
  handleInputChange: (value: string) => void;
};

const SearchBar: FunctionComponent<SearchBarPropsType> = ({
  handleInputChange,
}) => {
  return (
    <Input
      className="search-field"
      placeholder="Search by mission and rocket name"
      disableUnderline
      onChange={(e) => handleInputChange(e.target.value)}
    />
  );
};

export default memo(SearchBar);
