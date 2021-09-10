import {
  defaultFont,
  dangerColor,
  whiteColor,
  grayColor,
  primaryColor
} from 'assets/jss/material-dashboard-react.js';

import dropdownStyle from 'assets/jss/material-dashboard-react/dropdownStyle.js';

const headerLinksStyle = (theme) => ({
  ...dropdownStyle(theme),
  disabled: {
    '&:before': {
      backgroundColor: 'transparent !important',
    },
  },
  underline: {
    '&:hover:not($disabled):before,&:before': {
      borderColor: grayColor[4] + ' !important',
      borderWidth: '1px !important',
    },
    '&:after': {
      borderColor: primaryColor[0],
    },
  },
  labelRoot: {
    ...defaultFont,
    color: grayColor[3] + ' !important',
    fontWeight: '400',
    fontSize: '14px',
    lineHeight: '1.42857',
    letterSpacing: 'unset',
  },
  feedback: {
    position: 'absolute',
    top: '18px',
    right: '0',
    zIndex: '2',
    display: 'block',
    width: '24px',
    height: '24px',
    textAlign: 'center',
    pointerEvents: 'none',
  },
  marginTop: {
    marginTop: '16px',
  },
  formControl: {
    paddingBottom: '10px',
    margin: '27px 0 0 0',
    position: 'relative',
    verticalAlign: 'unset',
  },
  search: {
    '& > div': {
      marginTop: '0',
    },
    [theme.breakpoints.down('sm')]: {
      margin: '10px 15px !important',
      float: 'none !important',
      paddingTop: '1px',
      paddingBottom: '1px',
      padding: '0!important',
      width: '60%',
      marginTop: '40px',
      '& input': {
        color: whiteColor,
      },
    },
  },
  linkText: {
    zIndex: '4',
    ...defaultFont,
    fontSize: '14px',
    margin: '0px',
  },
  buttonLink: {
    margin: '0 10px 0',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      margin: '10px 15px 0',
      width: '-webkit-fill-available',
      '& svg': {
        width: '24px',
        height: '30px',
        marginRight: '15px',
        marginLeft: '-15px',
      },
      '& .fab,& .fas,& .far,& .fal,& .material-icons': {
        fontSize: '24px',
        lineHeight: '30px',
        width: '24px',
        height: '30px',
        marginRight: '15px',
        marginLeft: '-15px',
      },
      '& > span': {
        justifyContent: 'flex-start',
        width: '100%',
      },
    },
  },
  searchButton: {
    [theme.breakpoints.down('sm')]: {
      top: '-50px !important',
      marginRight: '22px',
      float: 'right',
    },
  },
  margin: {
    zIndex: '4',
    margin: '0',
  },
  searchIcon: {
    width: '17px',
    zIndex: '4',
  },
  notifications: {
    zIndex: '4',
    [theme.breakpoints.up('md')]: {
      position: 'absolute',
      top: '2px',
      border: '1px solid ' + whiteColor,
      right: '4px',
      fontSize: '9px',
      background: dangerColor[0],
      color: whiteColor,
      minWidth: '16px',
      height: '16px',
      borderRadius: '10px',
      textAlign: 'center',
      lineHeight: '16px',
      verticalAlign: 'middle',
      display: 'block',
    },
    [theme.breakpoints.down('sm')]: {
      ...defaultFont,
      fontSize: '14px',
      marginRight: '8px',
    },
  },
  manager: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
    display: 'inline-block',
  },
  searchWrapper: {
    [theme.breakpoints.down('sm')]: {
      width: '-webkit-fill-available',
      margin: '10px 15px 0',
    },
    display: 'inline-block',
  },
});

export default headerLinksStyle;
