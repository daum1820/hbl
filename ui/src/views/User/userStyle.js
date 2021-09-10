import { infoColor, dangerColor, successColor } from 'assets/jss/material-dashboard-react';
import { whiteColor } from 'assets/jss/material-dashboard-react';
import checkboxAndRadioStyle from "assets/jss/material-dashboard-react/checkboxAdnRadioStyle.js";

const styles = {
  ...checkboxAndRadioStyle,
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
  info: {
    color: `${whiteColor} !important`,
    backgroundColor: `${infoColor[0]} !important`,
    borderColor: `${infoColor[0]} !important`
  },
  changePassword: {
    display: 'flex'
  }
};
export default styles;