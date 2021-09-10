import { successColor } from "assets/jss/material-dashboard-react";
import { primaryColor } from "assets/jss/material-dashboard-react";
import { dangerColor } from "assets/jss/material-dashboard-react";
import dashboardStyle from 'assets/jss/material-dashboard-react/views/dashboardStyle.js';

const styles = {
  ...dashboardStyle,
  spin: {
    animation: '$circular-rotate 1.4s linear infinite',
  },
  statusHeader: {
    marginTop: '15px'
  },
  statusHeaderTitle: {
    display: 'flex'
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
  cardTitle: {
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    textDecoration: "none",
    margin: '12px',
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
};
export default styles;