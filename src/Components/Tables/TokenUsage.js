import { useEffect, useState } from "react";
import { SendRequestWithToken_test } from "../../Utils/FetchUtil";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
} from "@mui/material";

export const TokenUsage = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        SendRequestWithToken_test(
            "token/get-token-usage",
            { },
            (result) => {
              setData(result);
            }
        )
    }, [])
  return (
    <>
        <Box width="90%" mx="auto">
          <TableContainer component={Paper}>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, padding: "10px"}} width="50%">API_KEY</TableCell>
                  <TableCell sx={{ fontWeight: 600, padding: "10px"}} width="50%">Used Token Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data && data.map((item, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 }}}
                  >
                    <TableCell sx={{ padding: "10px"}}>{item.api_key}</TableCell>
                    <TableCell sx={{ padding: "10px"}}>{item.totalAmount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
    </>
  );
};
