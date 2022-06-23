import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import type { GroupedFindingWithRawData, RawFinding } from '../pages/index';

function Row(props: {row: GroupedFindingWithRawData}) {
  const [open, setOpen] = React.useState(false);
  const row = props.row;
  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">{row.severity}</TableCell>
        <TableCell>{row.grouped_finding_created}</TableCell>
        <TableCell>{row.sla}</TableCell>
        <TableCell>{row.description}</TableCell>
        <TableCell>{row.security_analyst}</TableCell>
        <TableCell>{row.owner}</TableCell>
        <TableCell>{row.workflow}</TableCell>
        <TableCell>{row.status}</TableCell>
        <TableCell>{row.raw.length}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Raw Findings
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>SEVERITY</TableCell>
                    <TableCell>TIME</TableCell>
                    <TableCell>SOURCE</TableCell>
                    <TableCell>DESCRIPTION</TableCell>
                    <TableCell>ASSET</TableCell>
                    <TableCell>STATUS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.raw.map((rawFinding: RawFinding) => (
                    <TableRow key={rawFinding.id}>
                      <TableCell component="th" scope="row">{rawFinding.severity}</TableCell>
                      <TableCell>{rawFinding.finding_created}</TableCell>
                      <TableCell>{rawFinding.source_collaboration_tool_name}</TableCell>
                      <TableCell>{rawFinding.description}</TableCell>
                      <TableCell>{rawFinding.asset}</TableCell>
                      <TableCell>{rawFinding.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function CollapsibleTable(props: {dataSet: GroupedFindingWithRawData[]}) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>SEVERITY</TableCell>
            <TableCell>TIME</TableCell>
            <TableCell>SLA</TableCell>
            <TableCell>DESCRIPTION</TableCell>
            <TableCell>SECURITY ANALYST</TableCell>
            <TableCell>OWNER</TableCell>
            <TableCell>WORK FLOW</TableCell>
            <TableCell>STATUS</TableCell>
            <TableCell># OF FINDINGS</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.dataSet.map((row: GroupedFindingWithRawData) => (
            <Row key={row.id} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
