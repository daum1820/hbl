import { successColor } from "assets/jss/material-dashboard-react";
import { infoColor } from "assets/jss/material-dashboard-react";
import { dangerColor, whiteColor } from "assets/jss/material-dashboard-react";
import dashboardStyle from 'assets/jss/material-dashboard-react/views/dashboardStyle.js';

const styles = {
  ...dashboardStyle,
  statusHeader: {
    marginTop: '15px'
  },
  statusHeaderTitle: {
    display: 'flex'
  },
  statusButton: {
    paddingLeft: '0.5rem !important'
  }, 
  success: {
    color: successColor[0],
    marginTop: '10px'
  },
  info: {
    color: infoColor[0],
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
  danger: {
    color: `${whiteColor} !important`,
    backgroundColor: `${dangerColor[0]} !important`,
    borderColor: `${dangerColor[0]} !important`
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
  }
};
export default styles;