import React, { FunctionComponent, memo, useEffect, useState } from "react";
import debounce from "lodash.debounce";
import axios, { AxiosError } from "axios";
import { useInfiniteQuery } from "react-query";
import Box from "@mui/material/Box";

import SearchBar from "./../SearchBar";
import LaunchCard from "./../LaunchCard";
import Compare from "./../Compare";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";

import { API_HOST, landingsFetchQuery } from "../../constants.js";

import "./style.css";

const fetchLandingData = (
  limit: number,
  pageParam: number,
  searchQuery: string
) =>
  axios.post(API_HOST, {
    query: landingsFetchQuery(),
    variables: {
      limit,
      offset: (pageParam - 1) * limit,
      missionName: searchQuery,
    },
  });

const limitPerPage = 10;

const Homepage: FunctionComponent<{}> = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const {
    data,
    isLoading,
    isError,
    error,
    isSuccess,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
    refetch,
  } = useInfiniteQuery<any, AxiosError>({
    queryKey: "launches",
    queryFn: ({ pageParam = 1 }) =>
      fetchLandingData(limitPerPage, pageParam, searchQuery),
    retry: false,
    refetchOnWindowFocus: false,
    getNextPageParam: (
      { data: { data: { launchesPast = [] } = {} } = {} },
      allPages
    ) => {
      const nextPage = allPages.length + 1;
      return launchesPast.length !== 0 ? nextPage : undefined;
    },
  });

  const toTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleCardClick = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds((ids: string[]) => ids.filter((i: string) => i !== id));
    } else if (selectedIds.length < 2) {
      setSelectedIds([...selectedIds, id]);
    } else {
      alert("Cannot select more than two Launches to compare");
    }
  };

  const handleInputChange = (value: string) => {
    setSearchQuery(value);
  };

  useEffect(
    debounce(() => {
      !isLoading && refetch();
    }, 1500),
    [searchQuery]
  );

  const getLastString = () => {
    if (isFetchingNextPage) {
      return "Loading More...";
    } else if (!hasNextPage) {
      return "Nothing more to load";
    } else {
      return "";
    }
  };

  useEffect(() => {
    let fetching = false;
    const handleScroll = async (e: any) => {
      const { scrollHeight, scrollTop, clientHeight } =
        e.target.scrollingElement;
      if (!fetching && scrollHeight - scrollTop <= clientHeight * 1.5) {
        fetching = true;
        if (hasNextPage) await fetchNextPage();
        fetching = false;
      }
    };
    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [fetchNextPage, hasNextPage]);

  if (isError) {
    return <div>{error.message}, Please Refresh</div>;
  }

  return (
    <div className="container">
      <header>
        SpaceX Lauches
        <span>
          Developed by&nbsp;
          <a href="https://www.linkedin.com/in/ujjwalsinghal/">
            Ujjwal Singhal
          </a>
        </span>
        {!isLoading && <SearchBar handleInputChange={handleInputChange} />}
      </header>
      <div className="content">
        {(isLoading || isRefetching) && (
          <div className="last-string">Loading...</div>
        )}
        {isSuccess && !isLoading && (
          <div className="launch-container">
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                "& > :not(style)": {
                  m: 2,
                  width: 300,
                  height: 260,
                  opacity: 0.8,
                  backgroundColor: "black",
                  borderRadius: 8,
                  border: "1px solid",
                  padding: 1,
                  color: "white",
                },
              }}
            >
              {data.pages.map(
                (page, index) =>
                  page && (
                    <LaunchCard
                      key={index}
                      data={page.data.data.launchesPast}
                      handleCardClick={handleCardClick}
                      selectedIds={selectedIds}
                    />
                  )
              )}
            </Box>
          </div>
        )}
      </div>
      {!isLoading && (
        <ArrowCircleUpIcon
          fontSize="large"
          className="top-button"
          onClick={toTop}
        />
      )}
      {!isLoading && <div className="last-string">{getLastString()}</div>}
      <Compare selectedIds={selectedIds} />
    </div>
  );
};

export default memo(Homepage);
