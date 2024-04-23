import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Tooltip, tooltipClasses } from "@mui/material";
import { SendRequestWithToken_test } from "../Utils/FetchUtil";
import { useEffect } from "react";
import { useState } from "react";

const CustomWidthTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 500,
    fontSize: "16px",
  },
});

export const Corrections = ({ chatbotId }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    SendRequestWithToken_test(
      "chatbot/find-all-corrections",
      {
        body: JSON.stringify({
          id: chatbotId,
        }),
      },
      (result) => {
        result = JSON.parse(result);
        console.log({ result });
        setData(result);
      }
    );
  };
  return (
    <TableContainer component={Paper} mt={6}>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Question</TableCell>
            <TableCell>Answer</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data &&
            data.map((item) => (
              <TableRow key={item._id.$oid}>
                <CustomWidthTooltip title={item.input}>
                  <TableCell>
                    {item.input.length > 50
                      ? item.input.slice(0, 50) + "..."
                      : item.input}
                  </TableCell>
                </CustomWidthTooltip>
                <CustomWidthTooltip title={item.output}>
                  <TableCell>
                    {item.output.length > 50
                      ? item.output.slice(0, 50) + "..."
                      : item.output}
                  </TableCell>
                </CustomWidthTooltip>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
