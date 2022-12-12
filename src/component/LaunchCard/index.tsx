import React, { memo, FunctionComponent } from "react";
import ReactPlayer from "react-player";
import Paper from "@mui/material/Paper";

import { getDate } from "../../utils";

import "./style.css";

type LaunchCardPropsType = {
  data: any;
  handleCardClick: (id: number) => void;
};

const LaunchCard: FunctionComponent<LaunchCardPropsType> = ({
  data,
  handleCardClick,
}) => {
  return data.map((launch: any) => (
    <Paper className="launch-card" key={launch.id}>
      {launch.links.video_link && (
        <div className="player-wrapper">
          <ReactPlayer url={launch.links.video_link} />
        </div>
      )}
      <div className="name" onClick={() => handleCardClick(launch.id)}>
        {launch.mission_name}&nbsp;
        <span>
          at {launch.launch_site.site_name_long} by
          {launch.rocket.rocket_name} ({getDate(launch.launch_date_local)})
        </span>
      </div>
    </Paper>
  ));
};

export default memo(LaunchCard);
