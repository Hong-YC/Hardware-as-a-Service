import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import QtySubmitForm from './QtySubmitForm';
import { Typography } from '@mui/material';

export default function HardwareSetsTable(props) {

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const rows = props.hardwareSets

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: '100%' }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell key={"name"} align={"center"} style={{ minWidth: 170 }}>
                  Hardware Set
              </TableCell>
              <TableCell key={"available"} align={"center"} style={{ minWidth: 170 }}>
                  Available
              </TableCell>
              <TableCell key={"capacity"} align={"center"} style={{ minWidth: 100 }}>
                  Capacity
              </TableCell>
              <TableCell key={"checkedOut"} align={"center"} style={{ minWidth: 170 }}>
                  Checked Out Units
              </TableCell>
              <TableCell key={"checkIn"} align={"center"} style={{ minWidth: 170 }}>
                  Check In
              </TableCell>
              <TableCell key={"checkOut"} align={"center"} style={{ minWidth: 170 }}>
                  Check Out
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* {setRows(props.project_set.map((set) => createData(set.Name, set.SetID, set.Availability, set.Capacity, set.CheckedIn)))} */}
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row["setID"]}>
                    <TableCell key={"name" + row["setID"]} align={"center"} style={{ minWidth: 170 }}>
                      <Typography variant="h5" key={Math.random()} className="roll-out">
                        HW set {row["setID"]}
                      </Typography>
                    </TableCell>
                    <TableCell key={"available" + row["setID"]} align={"center"} style={{ minWidth: 170 }}>
                      <Typography variant="h5" key={Math.random()} className="roll-out">
                        {row["availability"]}
                      </Typography>
                    </TableCell>
                    <TableCell key={"capacity" + row["setID"]} align={"center"} style={{ minWidth: 170 }}>
                      <Typography variant="h5" key={Math.random()} className="roll-out">
                        {row["capacity"]}
                      </Typography>
                    </TableCell>
                    <TableCell key={"checkedOut" + row["setID"]} align={"center"} style={{ minWidth: 170 }}>
                      <Typography variant="h5" key={Math.random()} className="roll-out">
                        {row["setID"] == 1 ? props.set1CheckedOutUnits : props.set2CheckedOutUnits}
                      </Typography>
                      
                    </TableCell>
                    <TableCell key={"checkIn" + row["setID"]} align={"center"} style={{ minWidth: 170 }}>
                      
                      <QtySubmitForm
                        setID = {row["setID"]}
                        submit_type = "checkIn"
                        handleSubmitQty = {props.handleSubmitQty}
                       />
                       
                    </TableCell>
                    
                    <TableCell key={"checkOut" + row["setID"]} align={"center"} style={{ minWidth: 170 }}>

                      <QtySubmitForm
                        setID = {row["setID"]}
                        submit_type = "checkOut"
                        handleSubmitQty = {props.handleSubmitQty}
                       />

                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
