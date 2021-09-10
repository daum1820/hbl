import React from 'react';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Hidden from '@material-ui/core/Hidden';
import Poppers from '@material-ui/core/Popper';
import Divider from '@material-ui/core/Divider';
import Person from '@material-ui/icons/Person';
import Search from '@material-ui/icons/Search';
import { useTranslation } from 'react-i18next';
import Button from 'components/CustomButtons/Button.js';
import { useSelector, useDispatch } from 'react-redux';
import styles from 'assets/jss/material-dashboard-react/components/headerLinksStyle.js';
import { sagaActions }from 'sagas/actions.saga';
import { FormControl, Input } from '@material-ui/core';
import { useQuery } from 'utils';
import { isEmpty } from 'lodash';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(styles);

export default function AdminNavbarLinks() {
  const { t } = useTranslation();
  const history = useHistory();
  const classes = useStyles();
  const query = useQuery();
  const [openSubMenu, setOpenSubMenu] = React.useState(null);
  const [search, setSearch] = React.useState(query.get('search'));

  const authUser = useSelector((state) => state.auth.authUser)
  const dispatch = useDispatch();
  const handleClickSubMenu = (event) => {
    if (openSubMenu && openSubMenu.contains(event.target)) {
      setOpenSubMenu(null);
    } else {
      setOpenSubMenu(event.currentTarget);
    }
  };

  const handleLogout = () => {
    handleSubMenu();
    dispatch({ type: sagaActions.LOGOUT });
  };

  const handleProfile = () => {
    handleSubMenu();
    dispatch({ type: sagaActions.READ_USER });
    history.push('/profile');
  };

  const handleSubMenu = () => {
    setOpenSubMenu(null);
  };

  const handleSearchClick = () => {
    isEmpty(search) ? query.delete('search') : query.set('search', search);
    history.replace({search: query.toString()})
  }

  const onSearchChange = (value) => {
    setSearch(value);
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearchClick()
    }
  }

  return (
    <div>
      <div className={classes.searchWrapper}>
        <FormControl className={classNames(classes.formControl, classes.margin, classes.search)}>
          <Input
            name="search"
            value={search || ''}
            placeholder={t('label.search')}
            className={classes.underline} 
            onChange={ e => onSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </FormControl>
        <Button color='white' aria-label='edit' justIcon round onClick={handleSearchClick}>
          <Search />
        </Button>
      </div>
      <div className={classes.manager}>
      <Button
          round
          color={window.innerWidth > 959 ? 'primary' : 'white'}
          justIcon={window.innerWidth > 959}
          simple={!(window.innerWidth > 959)}
          aria-owns={openSubMenu ? 'profile-menu-list-grow' : null}
          aria-haspopup='true'
          onClick={handleClickSubMenu}
          className={classes.buttonLink}
        >
          <Person className={classes.icons} />
          <Hidden mdUp implementation='css'>
            <p className={classes.linkText}>{`${authUser?.name} ${authUser?.lastName}`}</p>
          </Hidden>
        </Button>
        <Poppers
          open={Boolean(openSubMenu)}
          anchorEl={openSubMenu}
          transition
          disablePortal
          className={
            classNames({ [classes.popperClose]: !openSubMenu }) +
            ' ' +
            classes.popperNav
          }
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id='profile-menu-list-grow'
              style={{
                transformOrigin:
                  placement === 'bottom' ? 'center top' : 'center bottom',
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleSubMenu}>
                  <MenuList role='menu'>
                    <MenuItem
                      onClick={handleProfile}
                      className={classes.dropdownItem}
                    >
                      {t('menu.profile')}
                    </MenuItem>
                    <Divider light />
                    <MenuItem
                      onClick={handleLogout}
                      className={classes.dropdownItem}
                    >
                      {t('menu.logout')}
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Poppers>
      </div>
    </div>
  );
}
