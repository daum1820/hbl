import {
  grayColor,
  primaryColor,
  infoColor,
  successColor,
  warningColor,
  dangerColor,
  roseColor,
  whiteColor,
  blackColor,
  hexToRgb,
} from 'assets/jss/material-dashboard-react.js';

const paginationStyle = {
  white: {
    '&,&:focus,&:hover': {
      backgroundColor: whiteColor,
      color: grayColor[0],
    },
  },
  rose: {
    color: whiteColor,
    backgroundColor: `${roseColor[0]} !important`,
    boxShadow:
      '0 2px 2px 0 rgba(' +
      hexToRgb(roseColor[0]) +
      ', 0.14), 0 3px 1px -2px rgba(' +
      hexToRgb(roseColor[0]) +
      ', 0.2), 0 1px 5px 0 rgba(' +
      hexToRgb(roseColor[0]) +
      ', 0.12)',
    '&:hover,&:focus': {
      backgroundColor: `${roseColor[0]} !important`,
      boxShadow:
        '0 14px 26px -12px rgba(' +
        hexToRgb(roseColor[0]) +
        ', 0.42), 0 4px 23px 0px rgba(' +
        hexToRgb(blackColor) +
        ', 0.12), 0 8px 10px -5px rgba(' +
        hexToRgb(roseColor[0]) +
        ', 0.2)',
    },
  },
  primary: {
    color: whiteColor,
    backgroundColor: `${primaryColor[0]} !important`,
    boxShadow:
      '0 2px 2px 0 rgba(' +
      hexToRgb(primaryColor[0]) +
      ', 0.14), 0 3px 1px -2px rgba(' +
      hexToRgb(primaryColor[0]) +
      ', 0.2), 0 1px 5px 0 rgba(' +
      hexToRgb(primaryColor[0]) +
      ', 0.12)',
    '&:hover,&:focus': {
      backgroundColor: `${primaryColor[0]} !important`,
      boxShadow:
        '0 14px 26px -12px rgba(' +
        hexToRgb(primaryColor[0]) +
        ', 0.42), 0 4px 23px 0px rgba(' +
        hexToRgb(blackColor) +
        ', 0.12), 0 8px 10px -5px rgba(' +
        hexToRgb(primaryColor[0]) +
        ', 0.2)',
    },
  },
  info:{
    color: whiteColor,
    backgroundColor: `${infoColor[0]} !important`,
    boxShadow:
      '0 2px 2px 0 rgba(' +
      hexToRgb(infoColor[0]) +
      ', 0.14), 0 3px 1px -2px rgba(' +
      hexToRgb(infoColor[0]) +
      ', 0.2), 0 1px 5px 0 rgba(' +
      hexToRgb(infoColor[0]) +
      ', 0.12)',
    '&:hover,&:focus': {
      backgroundColor: `${infoColor[0]} !important`,
      boxShadow:
        '0 14px 26px -12px rgba(' +
        hexToRgb(infoColor[0]) +
        ', 0.42), 0 4px 23px 0px rgba(' +
        hexToRgb(blackColor) +
        ', 0.12), 0 8px 10px -5px rgba(' +
        hexToRgb(infoColor[0]) +
        ', 0.2)',
    }
  },
  success: {
    color: whiteColor,
    backgroundColor: `${successColor[0]} !important`,
    boxShadow:
      '0 2px 2px 0 rgba(' +
      hexToRgb(successColor[0]) +
      ', 0.14), 0 3px 1px -2px rgba(' +
      hexToRgb(successColor[0]) +
      ', 0.2), 0 1px 5px 0 rgba(' +
      hexToRgb(successColor[0]) +
      ', 0.12)',
    '&:hover,&:focus': {
      backgroundColor: `${successColor[0]} !important`,
      boxShadow:
        '0 14px 26px -12px rgba(' +
        hexToRgb(successColor[0]) +
        ', 0.42), 0 4px 23px 0px rgba(' +
        hexToRgb(blackColor) +
        ', 0.12), 0 8px 10px -5px rgba(' +
        hexToRgb(successColor[0]) +
        ', 0.2)',
    },
  },
  warning: {
    color: whiteColor,
    backgroundColor: `${warningColor[0]} !important`,
    boxShadow:
      '0 2px 2px 0 rgba(' +
      hexToRgb(warningColor[0]) +
      ', 0.14), 0 3px 1px -2px rgba(' +
      hexToRgb(warningColor[0]) +
      ', 0.2), 0 1px 5px 0 rgba(' +
      hexToRgb(warningColor[0]) +
      ', 0.12)',
    '&:hover,&:focus': {
      backgroundColor: `${warningColor[0]} !important`,
      boxShadow:
        '0 14px 26px -12px rgba(' +
        hexToRgb(warningColor[0]) +
        ', 0.42), 0 4px 23px 0px rgba(' +
        hexToRgb(blackColor) +
        ', 0.12), 0 8px 10px -5px rgba(' +
        hexToRgb(warningColor[0]) +
        ', 0.2)',
    },
  },
  danger: {
    color: whiteColor,
    backgroundColor: `${dangerColor[0]} !important`,
    boxShadow:
      '0 2px 2px 0 rgba(' +
      hexToRgb(dangerColor[0]) +
      ', 0.14), 0 3px 1px -2px rgba(' +
      hexToRgb(dangerColor[0]) +
      ', 0.2), 0 1px 5px 0 rgba(' +
      hexToRgb(dangerColor[0]) +
      ', 0.12)',
    '&:hover,&:focus': {
      backgroundColor: `${dangerColor[0]} !important`,
      boxShadow:
        '0 14px 26px -12px rgba(' +
        hexToRgb(dangerColor[0]) +
        ', 0.42), 0 4px 23px 0px rgba(' +
        hexToRgb(blackColor) +
        ', 0.12), 0 8px 10px -5px rgba(' +
        hexToRgb(dangerColor[0]) +
        ', 0.2)',
    },
  },
  transparent: {
    '&,&:focus,&:hover': {
      color: 'inherit',
      background: 'transparent',
      boxShadow: 'none',
    },
  },
  disabled: {
    opacity: '0.65',
    pointerEvents: 'none',
  },
  lg: {
    padding: '1.125rem 2.25rem',
    fontSize: '0.875rem',
    lineHeight: '1.333333',
    borderRadius: '0.2rem',
  },
  sm: {
    padding: '0.40625rem 1.25rem',
    fontSize: '0.6875rem',
    lineHeight: '1.5',
    borderRadius: '0.2rem',
  }
};

export default paginationStyle;
