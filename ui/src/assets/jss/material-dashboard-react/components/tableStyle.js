import { whiteColor } from 'assets/jss/material-dashboard-react';
import {
  warningColor,
  primaryColor,
  dangerColor,
  successColor,
  infoColor,
  roseColor,
  grayColor,
  defaultFont,
} from 'assets/jss/material-dashboard-react.js';

const tableStyle = (theme) => ({
  warningTableHeader: {
    color: warningColor[0],
  },
  primaryTableHeader: {
    color: primaryColor[0],
  },
  dangerTableHeader: {
    color: dangerColor[0],
  },
  successTableHeader: {
    color: successColor[0],
  },
  infoTableHeader: {
    color: infoColor[0],
  },
  roseTableHeader: {
    color: roseColor[0],
  },
  grayTableHeader: {
    color: grayColor[0],
  },
  table: {
    marginBottom: '0',
    width: '100%',
    maxWidth: '100%',
    backgroundColor: 'transparent',
    borderSpacing: '0',
    borderCollapse: 'collapse',
  },
  tableHeadCell: {
    color: 'inherit',
    ...defaultFont,
    '&, &$tableCell': {
      fontSize: '1em',
    },
  },
  tableCell: {
    ...defaultFont,
    lineHeight: '1.42857143',
    padding: '8px 8px',
    verticalAlign: 'middle',
    fontSize: '0.8125rem',
    position: 'relative',
  },
  tableResponsive: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  tableHeadRow: {
    height: '56px',
    color: 'inherit',
    display: 'table-row',
    outline: 'none',
    verticalAlign: 'middle',
  },
  tableBodyRow: {
    height: '48px',
    color: 'inherit',
    display: 'table-row',
    outline: 'none',
    verticalAlign: 'middle',
  },
  tableHint: {
    position: 'absolute',
    left: '-245px',
    backgroundColor: "#777",
    fontWeight: 400,
    color: whiteColor,
    padding: '0.250rem 1rem',
    top: '3px',
    borderRadius: '1rem',
    boxShadow: '0 4px 20px 0 rgb(0 0 0 / 14%), 0 7px 10px -5px rgb(109 108 108 / 40%)',
  }
});

export default tableStyle;
