
import { roseColor, whiteColor } from "assets/jss/material-dashboard-react";

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
  rose: {
    color: `${whiteColor} !important`,
    backgroundColor: `${roseColor[0]} !important`,
    borderColor: `${roseColor[0]} !important`
  }
};
export default styles;