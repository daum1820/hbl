
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import PlusIcon from '@material-ui/icons/Add';
import NavigateIcon from '@material-ui/icons/NavigateNextOutlined';
import ExpandIcon from '@material-ui/icons/ExpandMoreOutlined';
import CollapseIcon from '@material-ui/icons/ExpandLessOutlined';
import Card from 'components/Card/Card.js';
import CardHeader from 'components/Card/CardHeader.js';
import CardIcon from 'components/Card/CardIcon.js';
import CardFooter from 'components/Card/CardFooter.js';
import dashboardStyle from './dashboardStyle.js';
import { useTranslation } from 'react-i18next';
import { Icon, IconButton, Tooltip } from '@material-ui/core';
import { useRouteMatch, useHistory, useLocation } from 'react-router-dom';
import { useQuery } from 'utils';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { isEmpty } from 'lodash-es';

const useStyles = makeStyles(dashboardStyle);

export default function DashboardItem(props) {
  const { 
    icon:ItemIcon, 
    addIcon:AddIcon = PlusIcon,
    addIcon:ViewIcon = NavigateIcon,
    list = () => true,
    add = () => true,
    view = () => true,
    listFilter = {}, 
    color, 
    highlights,
    title,
    value,
    context,
    onLoad = {},
  } = props;
  const classes = useStyles();
  const { t } = useTranslation();
  const { path } = useRouteMatch();
  const location = useLocation();
  const query = useQuery();
  const history = useHistory();
  const dispatch = useDispatch();
  
  const [listActive, setListActive] = React.useState(false)

  React.useEffect(() => {
    const matchLocation = () => {
      const filters = Object.assign({}, listFilter);
      if (location.pathname === `${path}/${context}`) {
        for(var key of query.keys()) {
          if (key !== 'search' && filters[key] !== query.get(key)) {
            console.info('returnnnning', filters[key], query.get(key));
            return false;
          }
          delete filters[key];
          console.info(filters);
        }
      }
      return Object.keys(filters).length === 0;
    }

    setListActive(matchLocation());

  }, [location, path, context, listFilter, query]);

  React.useEffect(() => {
    if(!isEmpty(onLoad)) {
      const loadData = async () => {
        await dispatch(onLoad);
      }
      loadData();
    }
  }, [dispatch, onLoad]);


  const handleAddClick = () => {
    history.push({ 
      pathname: `/${context}/create`,
      search: listActive ? query.toString() : buildParams()
    })
  };

  const handleViewClick = () => {
    history.push({ 
      pathname: `/${context}`,
      search: listActive ? query.toString() : buildParams()
    })
  };

  const buildParams = () => {
    const url = new URLSearchParams();
    Object.entries(listFilter).forEach(([k, v]) => url.set(k,v));

    return url.toString()
  }

  const handleListClick = (event) => {
    event.preventDefault();

    if (listActive) {
      Object.keys(listFilter).forEach((k) => query.delete(k));
    }

    const pathname = !listActive ? history.push(`${path}/${context}`) : history.push(`${path}`) ;

    setListActive(!listActive);

    history.push({ 
      pathname,
      search: listActive ? query.toString() : buildParams()
    })
  }

  const listButtonBlock = !!handleListClick && list() ? (
    <div className={classes.actionList}>
      <Tooltip placement='bottom' title={listActive ? t('tooltip.item.hide') : t('tooltip.item.list')}>
        <IconButton size='small' aria-label="list" onClick={handleListClick}
          className={classNames({[classes.selected]: listActive, [classes[color]]: color})}>
          {listActive ? <CollapseIcon fontSize="inherit"/> : <ExpandIcon fontSize="inherit"/>}
        </IconButton>
      </Tooltip>
    </div>) : '';
  
  const addButtonBlock = !!handleAddClick && add() ? (
    <Tooltip placement='left' title={t('tooltip.item.add')}>
      <IconButton size='small' aria-label="create"
        onClick={handleAddClick} style={{ margin: '0'}}>
        <AddIcon fontSize="inherit"/>
      </IconButton>
    </Tooltip>) : '';

  const viewButtonBlock = !!handleViewClick && view() ? (
    <Tooltip placement='left' title={t('tooltip.item.view')}>
      <IconButton  size='small' aria-label="create"
        onClick={handleViewClick} style={{ margin: '0'}}>
        <ViewIcon fontSize="inherit"/>
      </IconButton>
    </Tooltip>) : '';

  const buildHeader = ({title, value, Component = 'h3', key }) => (
    <span key={key}>
      <p className={classes.cardCategory}>{title}</p>
      <Component className={classes.cardTitle}>{value}</Component> 
    </span> 
  )

  return (
    <Card>
      <CardHeader color={color} stats icon style={{ minHeight: '85px' }}>
        <CardIcon color={color}>
          { typeof ItemIcon === 'string' ? <Icon>{ItemIcon}</Icon>: <ItemIcon/> } 
        </CardIcon>
        <div className={classes.cardHeaderWrapper}>
          { !!highlights ? highlights.map((props, key) => buildHeader({ key, ...props})) : buildHeader({ title, value, key: '' })}
        </div>
      </CardHeader>
      <CardFooter action>
        {listButtonBlock}
        {addButtonBlock}
        {viewButtonBlock}
      </CardFooter>
    </Card>
  )
}


DashboardItem.propTypes = {
  icon: PropTypes.any,
  addIcon: PropTypes.any,
  viewIcon: PropTypes.any,
  list: PropTypes.func,
  add: PropTypes.func,
  view: PropTypes.func,
  listFilter: PropTypes.object,
  context: PropTypes.string,
  highlights: PropTypes.array,
  title: PropTypes.string,
  value: PropTypes.any,
  color: PropTypes.oneOf([
    'warning',
    'success',
    'danger',
    'info',
    'primary',
    'rose',
  ]),
};
