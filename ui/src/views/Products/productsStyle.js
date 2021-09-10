import { successColor, whiteColor } from "assets/jss/material-dashboard-react";

const styles = {
  cardTitle: {
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    textDecoration: "none",
    margin: '12px',
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
  success: {
    color: `${whiteColor} !important`,
    backgroundColor: `${successColor[0]} !important`,
    borderColor: `${successColor[0]} !important`
  }
};
export default styles;