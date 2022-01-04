import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import sortData from './Sortdata';

// USE MEMO
function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}
// STYLING
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));
// STYLING
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));
// DATA
function MyTabell() {
  const query = useQuery();

  const [products, setProduct] = useState([]);

  useEffect(() => {
    axios
      .get(
        `https://arbetspserver.herokuapp.com/database-find/${query.get(
          'catnr'
        )}`
      )
      .then(({ data }) => {
        setProduct(sortData(data));
      })
      .catch((err) => {
        console.log('err', err);
      });
  }, []);
  // MY TABELL ON THE SCREEN
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Marknad</StyledTableCell>
            <StyledTableCell align="right">Pris</StyledTableCell>
            <StyledTableCell align="right">Valuta</StyledTableCell>
            <StyledTableCell align="right">Start och slut</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product, index) => (
            <StyledTableRow key={product._Id + index.toString()}>
              <StyledTableCell component="th" scope="row">
                {product.MarketId}
              </StyledTableCell>
              <StyledTableCell align="right">
                {product.UnitPrice}
              </StyledTableCell>
              <StyledTableCell align="right">
                {product.CurrencyCode}
              </StyledTableCell>
              <StyledTableCell align="right">
                {product.ValidFrom + ' - ' + product.ValidUntil}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default MyTabell;
