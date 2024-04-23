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
  TablePagination,
} from "@mui/material";

const titles = {
  title: "Server Specs",
  disk_space: "Disk Space",
  price: "Price",
  ram: "Ram",
  cores_speed: "Cores Speed",
};

export const TableInChatbox = ({ data }) => {
  const [page, setPage] = useState(0);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  return (
    <>
      <Box width="90%">
        <TableContainer component={Paper}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                {Object.keys(data[0]).map((key) =>
                  key !== "aff_link" ? (
                    <TableCell key={key}>{titles[key]}</TableCell>
                  ) : (
                    <TableCell key={key}>Plan</TableCell>
                  )
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.slice(page * 3, page * 3 + 3).map((item, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {Object.keys(data[0]).map((key) => (
                    <TableCell key={key}>
                      {key !== "aff_link" ? (
                        item[key]
                      ) : (
                        <a href={item[key]} target="_blank" rel="noreferrer">
                          Select
                        </a>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={data.length}
          rowsPerPage={3}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[]}
          sx={{
            '.MuiTablePagination-displayedRows': {
              marginTop: "18px",
            }
          }}
        />
      </Box>
    </>
  );
};
