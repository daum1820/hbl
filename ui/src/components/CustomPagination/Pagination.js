import React from 'react';
// nodejs library that concatenates classes
import classNames from 'classnames';
// nodejs library to set properties for components
import PropTypes from 'prop-types';

// material-ui components
import { makeStyles } from '@material-ui/core/styles';
import styles from 'assets/jss/material-dashboard-react/components/paginationStyle';
import { Pagination, PaginationItem } from '@material-ui/lab';

const useStyles = makeStyles(styles);

export default function RegularPagination(props) {
  const classes = useStyles();
  const {
    color,
    size,
    children,
    disabled,
    className,
    muiClasses,
    ...rest
  } = props;
  const pageClasses = classNames({
    [classes[size]]: size,
    [classes.disabled]: disabled,
    [className]: className,
  });
  return (
    <Pagination {...rest} classes={muiClasses} className={pageClasses} renderItem={(item)=>
      <PaginationItem {...item} classes={{selected: classes[color]}} />
    }>
      {children}
    </Pagination>
  );
}

RegularPagination.propTypes = {
  color: PropTypes.oneOf([
    'primary',
    'info',
    'success',
    'warning',
    'danger',
    'rose',
    'white',
    'transparent',
  ]),
  size: PropTypes.oneOf(['sm', 'lg']),
  className: PropTypes.string,
  muiClasses: PropTypes.object,
  children: PropTypes.node,
};
