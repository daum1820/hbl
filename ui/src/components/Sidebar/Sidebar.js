/*eslint-disable*/
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@material-ui/core/Icon';
import AdminNavbarLinks from 'components/Navbars/AdminNavbarLinks.js';
import styles from 'assets/jss/material-dashboard-react/components/sidebarStyle.js';
import { appName, appVersion } from 'utils';

const useStyles = makeStyles(styles);

export default function Sidebar(props) {
  const { t } = useTranslation();
  const classes = useStyles();
  let location = useLocation();
  // verifies if routeName is the one active (in browser input)
  function activeRoute(routeName) {
    return location.pathname === routeName;
  }
  const { color, logoIcon, image, logoText, routes } = props;
  
  const version = (
    <div className={classNames(classes.version, classes.whiteFont)}>
      <div className={classes.versionIcon}>
        <Icon fontSize='inherit' className={classNames(classes.whiteFont)}>verified</Icon>
      </div>
      <div className={classes.versionText}>
        {`v${appVersion}`}
      </div>
    </div>
  )

  let links = (
    <List className={classes.list}>
      {routes.map((prop, key) => {
        var activePro = ' ';
        var listItemClasses;
        listItemClasses = classNames({
          [' ' + classes[color]]: activeRoute(prop.path),
        });
        const whiteFontClasses = classNames({
          [' ' + classes.whiteFont]: activeRoute(prop.path),
        });
        return (
          <NavLink
            to={prop.path}
            className={activePro + classes.item}
            activeClassName='active'
            key={key}
          >
            <ListItem button className={classes.itemLink + listItemClasses}>
            { typeof prop.icon === 'string' ? <Icon className={classNames(classes.itemIcon, whiteFontClasses)}>{prop.icon}</Icon> :
               <prop.icon className={classNames(classes.itemIcon, whiteFontClasses)}/>}
              <ListItemText
                primary={t(prop.name)}
                className={classNames(classes.itemText, whiteFontClasses)}
                disableTypography={true}
              />
            </ListItem>
          </NavLink>
        );
      })}
    </List>
  );
  const brand = (
    <div className={classes.logo}>
      <a
        href='/'
        className={classNames(classes.logoLink)}
        target='_self'
      >
        <div className={classes.logoImage}>
          <Icon component={logoIcon} className={classNames(classes.img, classes.whiteFont )}/>
        </div>
        {logoText}
      </a>
    </div>
  );
  return (
    <div>
      <Hidden mdUp implementation='css'>
        <Drawer
          variant='temporary'
          anchor='right'
          open={props.open}
          classes={{
            paper: classNames(classes.drawerPaper),
          }}
          onClose={props.handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {brand}
          <div className={classes.sidebarWrapper}>
            <AdminNavbarLinks />
            {links}
          </div>
          {version}
          {image !== undefined ? (
            <div
              className={classes.background}
              style={{ backgroundImage: 'url(' + image + ')' }}
            />
          ) : null}
        </Drawer>
      </Hidden>
      <Hidden smDown implementation='css'>
        <Drawer
          anchor='left'
          variant='permanent'
          open
          classes={{
            paper: classNames(classes.drawerPaper),
          }}
        >
          {brand}
          <div className={classes.sidebarWrapper}>{links}</div>
          {version}
          {image !== undefined ? (
            <div
              className={classes.background}
              style={{ backgroundImage: 'url(' + image + ')' }}
            />
          ) : null}
        </Drawer>
      </Hidden>
    </div>
  );
}

Sidebar.propTypes = {
  handleDrawerToggle: PropTypes.func,
  bgColor: PropTypes.oneOf(['primary', 'blue', 'green', 'orange', 'red']),
  logo: PropTypes.string,
  image: PropTypes.string,
  logoText: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
  open: PropTypes.bool,
};
