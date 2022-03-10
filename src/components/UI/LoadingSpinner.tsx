import classes from "./LoadingSpinner.module.css";
import * as React from "react";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { Box } from "@mui/material";

const LoadingSpinner = () => {
  //* spinner convencional
  //return <div className={`${classes.spinner} center`}></div>;

  return (
    <Box sx={{ width: "80%" }}>
      <Skeleton />
      <Skeleton animation="wave" />
      <Skeleton animation={false} />
    </Box>
  );
};

export default LoadingSpinner;
