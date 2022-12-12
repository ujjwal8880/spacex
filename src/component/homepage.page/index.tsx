import React, { FunctionComponent, memo } from "react";
import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";

import { API_HOST, landingsFetchQuery } from "../../constants.js";

const fetchLandingData = (offSet: Number) =>
  axios.post(API_HOST, {
    query: landingsFetchQuery(offSet),
  });

const Homepage: FunctionComponent<{}> = () => {
  const offSet = 0;
  const {
    data: { data: { data: { launchesPast = [] } = {} } = {} } = {},
    isLoading,
    isError,
    error,
  } = useQuery<any, AxiosError>("launches", () => fetchLandingData(offSet), {
    retry: false,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>{error.message}, Please Refresh</div>;
  }

  console.log(launchesPast);

  return <div>HomePage</div>;
};

export default memo(Homepage);
