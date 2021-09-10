import Pagination from 'components/CustomPagination/Pagination';
import FilterListIcon from '@material-ui/icons/FilterList';
import Card from 'components/Card/Card';
import CardHeader from 'components/Card/CardHeader';
import CardIcon from 'components/Card/CardIcon';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
import Table from 'components/Table/Table';
import Warning from 'components/Typography/Warning';
import { isEmpty } from 'lodash-es';
import React from 'react';
import WarningIcon from '@material-ui/icons/Warning';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Icon, IconButton, makeStyles, Tooltip } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import CardBody from 'components/Card/CardBody';

import dashboardStyle from "views/Dashboard/dashboardStyle";
import PlusIcon from '@material-ui/icons/Add';
import classNames from 'classnames';

const styles = {
  ...dashboardStyle,
  cardTitle: {
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    textDecoration: "none",
    margin: '10px',
    color: '#666'
  },
  textCenter: {
    textAlign: "center"
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    margin: '15px 15px'
  },
  cardTitleWrapper: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  selected: {
    alignSelf: 'center',
  }
};

const useStyles = makeStyles(styles);


export default function CommonList(props) {
  const { 
    icon:CommonListIcon = FilterListIcon,
    name = 'title.details.text',
    color,
    limit = 20,
    filter,
    headers,
    properties, 
    listSaga,
    listSelector,
    removeSaga,
    removePayload,
    emptyMessage,
    params,
    path,
    pdfContext,
    _id= '_id',
    defaultOnEmpty  = '-',
    fullLoaded = false,
    view = () => true,
    remove = () => true,
    create = () => true,
    pdf = () => false,
  } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const data = useSelector(listSelector);
  const [page, setPage] = React.useState(1);
  const { t } = useTranslation();

  React.useEffect(() => {
    setPage(1);
  }, [filter])

  React.useEffect(() => {
    if (!!listSaga) {
      Object.entries(filter).forEach(([k,v]) => {
        if (v.includes(',')) {
          filter[k] = v.split(',');
        }
      })
      const loadData = async () => await dispatch({ type: listSaga, payload: { params: { page: page - 1, limit, ...filter}}});
      loadData();
    }
  }, [dispatch, page, params, filter, listSaga, limit])

  const handlePageChange = (event, page) => {
    setPage(page);
  }

  const getData = () => {
    let results = Object.values(data.items);
    if (fullLoaded) {
      results = results.slice((page - 1) * limit, page * limit);
    }
    return results.map((i, idx) => ({ _id: i[_id].toString(), items: properties.map(p => typeof p === 'string' ? i[p]?.toString() || defaultOnEmpty : p(i, idx + 1)|| defaultOnEmpty) }));
  }

  const handleActionView = (id) => {
    history.push(`${path}/${id}`);
  }

  const handleActionRemove = async (item) => {
    const { _id:id } = item;
    const params = typeof removePayload === 'function' ? removePayload(item) :  removePayload;
    await dispatch({ type: removeSaga, payload: { id, params }});
  } 

  const handleActionAdd = () => {
    history.push(`${path}/create`)
  };

  const createBlock = create() ? (
    <Tooltip placement='left' title={t('tooltip.item.add')}>
      <IconButton size='small' onClick={handleActionAdd} className={classNames({[classes.selected]: true, [classes[color]]: color})}>
          <PlusIcon/>
      </IconButton>
    </Tooltip>) : '';

  if (isEmpty(Object.values(data.items))) {
    return (
      <GridContainer justifyContent='center'>
        <GridItem xs={12} sm={12} md={12}>
          <Card className={classes.textCenter}>
            <CardHeader color="warning" icon>
              <CardIcon color="warning">
                <WarningIcon />
              </CardIcon>
              <div className={classes.cardTitleWrapper}>
                <h3><Warning>{t(emptyMessage)}</Warning></h3>
                {createBlock}
              </div>
            </CardHeader>
          </Card>  
        </GridItem>
      </GridContainer>
    )
  }
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color={color} icon>
          <CardIcon color={color}>
          { typeof CommonListIcon === 'string' ? <Icon>{CommonListIcon}</Icon>: <CommonListIcon/> }
          </CardIcon>
            <div className={classes.cardTitleWrapper}>
              <h2 className={classes.cardTitle}>{t(name)}</h2>
              {createBlock}
            </div>
          </CardHeader>
          <CardBody>
            <Table
                tableHeaderColor={color}
                tableHead={headers}
                tableData={getData()}
                callbackView={handleActionView}
                callbackRemove={handleActionRemove}
                view={view}
                remove={remove}
                pdf={pdf}
                pdfContext={pdfContext}
            />
            <div className={classes.pagination}>
              <Pagination
                color={color}
                count={Math.ceil(data.count / limit)}
                page={page}
                onChange={handlePageChange}
              />
            </div>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  )
}