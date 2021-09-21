import { successColor } from "assets/jss/material-dashboard-react";
import { grayColor } from "assets/jss/material-dashboard-react";
import { primaryColor } from "assets/jss/material-dashboard-react";
import { dangerColor, whiteColor, warningColor } from "assets/jss/material-dashboard-react";
import dashboardStyle from 'assets/jss/material-dashboard-react/views/dashboardStyle.js';

const styles =  (theme) => ({
  ...dashboardStyle,
  selected:{},
  warning: {
    color: warningColor[0],
    marginTop: '10px',
    '&$selected' :{
      color: whiteColor,
      backgroundColor: warningColor[0],
    },
    '&$selected:hover' : {
      backgroundColor: warningColor[1]
    }
  },
  spin: {
    animation: '$circular-rotate 1.4s linear infinite',
  },
  statusHeaderTitle: {
    display: 'flex',
    [theme.breakpoints.down("xs")]: {
      position: 'absolute',
      right: '-8px'
    },
    [theme.breakpoints.down("sm")]: {
      position: 'absolute',
      right: '-8px'
    }
  },
  statusButton: {
    paddingLeft: '0.5rem !important'
  },
  danger: {
    color: dangerColor[0],
    marginTop: '10px'
  },
  success: {
    color: successColor[0],
    marginTop: '10px'
  },
  primary: {
    color: primaryColor[0],
    marginTop: '10px'
  },
  muted: {
    color: grayColor[1],
    marginTop: '10px'
  },
  cardTitle: {
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    textDecoration: "none",
    margin: '12px',
    color: '#666'
  },
  cardPrinterTitle: {
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    textDecoration: "none",
    margin: '12px 5px',
    color: '#666'
  },
  headerTitle: {
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    textDecoration: "none",
    marginTop: '15px',
    marginRight: '5px',
    color: '#666'
  },
  textCenter: {
    margin: '10px 0px',
    textAlign: "center"
  },
  textRight: {
    textAlign: "right"
  },
  textLeft: {
    textAlign: "left"
  },
  cardBodyWrapperVert: {
    display: 'flex',
    justifyContent: 'space-evenly',
    flexDirection: 'column',
    margin: '20px'
  },
  cardBodyWrapper: {
    display: 'flex',
    justifyContent: 'space-evenly',
    margin: '20px'
  },
  '@keyframes circular-rotate': {
    '0%': {
      // Fix IE 11 wobbly
      transformOrigin: '50% 50%',
    },
    '100%': {
      transform: 'rotate(360deg)',
    },
  },
});
export default styles;