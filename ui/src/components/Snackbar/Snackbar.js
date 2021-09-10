import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Snack from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import { Trans } from 'react-i18next';
import Close from '@material-ui/icons/Close';
import styles from 'assets/jss/material-dashboard-react/components/snackbarContentStyle.js';

const useStyles = makeStyles(styles);

export default function Snackbar(props) {
  const classes = useStyles();
  const { message, color, close, icon, place, open, params } = props;
  let action = [];
  const messageClasses = classNames({
    [classes.iconMessage]: icon !== undefined,
  });

  if (close !== undefined) {
    action = [
      <IconButton
        className={classes.iconButton}
        key='close'
        aria-label='Close'
        color='inherit'
        onClick={() => props.closeNotification()}
      >
        <Close className={classes.close} />
      </IconButton>,
    ];
  }
  return (
    <Snack
      anchorOrigin={{
        vertical: place.indexOf('t') === -1 ? 'bottom' : 'top',
        horizontal:
          place.indexOf('l') !== -1
            ? 'left'
            : place.indexOf('c') !== -1
            ? 'center'
            : 'right',
      }}
      open={open}
      message={
        <div>
          {icon !== undefined ? <props.icon className={classes.icon} /> : null}
          <span className={messageClasses}>
          <Trans i18nKey={message} values={params} />
          </span>
        </div>
      }
      action={action}
      ContentProps={{
        classes: {
          root: classes.root + ' ' + classes[color],
          message: classes.message,
        },
      }}
    />
  );
}

Snackbar.propTypes = {
  message: PropTypes.node.isRequired,
  color: PropTypes.oneOf(['info', 'success', 'warning', 'danger', 'primary']),
  close: PropTypes.bool,
  icon: PropTypes.object,
  place: PropTypes.oneOf(['tl', 'tr', 'tc', 'br', 'bl', 'bc']),
  open: PropTypes.bool,
  closeNotification: PropTypes.func,
  params: PropTypes.object,
};
