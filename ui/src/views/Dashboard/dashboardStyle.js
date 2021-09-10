import {
  primaryColor,
  infoColor,
  successColor,
  warningColor,
  dangerColor,
  roseColor,
  whiteColor
} from 'assets/jss/material-dashboard-react.js';

import dashboardStyle from 'assets/jss/material-dashboard-react/views/dashboardStyle.js';

const styles = {
  ...dashboardStyle,
  cardHeaderWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    '& span:not(:first-child)' : {
      marginLeft: '50px'
    }
  },
  actionList: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
  },
  selected:{},
  rose: {
    '&$selected' :{
      color: whiteColor,
      backgroundColor: roseColor[0],
    },
    '&$selected:hover' : {
      backgroundColor: roseColor[1]
    }
  },
  primary: {
    '&$selected' :{
      color: whiteColor,
      backgroundColor: primaryColor[0],
    },
    '&$selected:hover' : {
      backgroundColor: primaryColor[1]
    }
  },
  success: {
    '&$selected' :{
      color: whiteColor,
      backgroundColor: successColor[0],
    },
    '&$selected:hover' : {
      backgroundColor: successColor[1]
    }
  },
  warning: {
    '&$selected' :{
      color: whiteColor,
      backgroundColor: warningColor[0],
    },
    '&$selected:hover' : {
      backgroundColor: warningColor[1]
    }
  },
  info: {
    '&$selected' :{
      color: whiteColor,
      backgroundColor: infoColor[0],
    },
    '&$selected:hover' : {
      backgroundColor: infoColor[1]
    }
  },
  danger: {
    '&$selected' :{
      color: whiteColor,
      backgroundColor: dangerColor[0],
    },
    '&$selected:hover' : {
      backgroundColor: dangerColor[1]
    }
  }
}
 export default styles;