import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { sagaActions }from 'sagas/actions.saga';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
import { useDispatch } from 'react-redux';
import Card from 'components/Card/Card.js';
import CardHeader from 'components/Card/CardHeader.js';
import ordersStyle from './orderStyle';
import CardIcon from 'components/Card/CardIcon';
import { Print } from '@material-ui/icons';
import { Icon, IconButton, Tooltip } from '@material-ui/core';
import Button from 'components/CustomButtons/Button';
import { orderItemMachine } from 'machines/orderItemMachine';
import { useMachine } from '@xstate/react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import CardBody from 'components/Card/CardBody';
import { OrderItem } from './OrderItem';
import { DisplayWhen } from 'utils/auth.utils';
import ExpandIcon from '@material-ui/icons/ExpandMoreOutlined';
import CollapseIcon from '@material-ui/icons/ExpandLessOutlined';
import CardFooter from 'components/Card/CardFooter';

const useStyles = makeStyles(ordersStyle);

export function OrderPrinter(props) {
  const { orderId, printer, itemOrder } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const color = 'warning';

  const [state, send] = useMachine(orderItemMachine(!!itemOrder ? 'add' : 'remove'), {
    actions: {
      notifyAdd : (context, event) => handleStatusChange(event, 'add'),
      notifyRemove : (context, event) => handleStatusChange(event, 'remove'),
    }
  });

  const handleStatusChange = async (event, status) => {
    if (event.type === 'TOGGLE') {
      if (status === 'add') {
        await dispatch({ type: sagaActions.ORDER_ADD_ITEM, payload: { id: orderId, printer: printer._id } });
      } else {
        await dispatch({ type: sagaActions.ORDER_REMOVE_ITEM, payload: { id: orderId, itemOrder } });
      }
    }
  };

  const nextContext = state.context[state.meta[`orderItem.${state.value}`].context];
  
  const [show, setShow] = React.useState(true)

  const orderItemBlock = !!itemOrder ? (
    <CardFooter action style={{ justifyContent: 'center' }}>
      <div className={classes.actionList}>
        <Tooltip placement='bottom' title={show ? t('tooltip.item.hide') : t('tooltip.item.list')}>
          <IconButton size='small' aria-label="list" onClick={() => setShow(!show)}
            className={classNames({[classes.selected]: show, [classes[color]]: color})}>
            {show ? <CollapseIcon fontSize="inherit"/> : <ExpandIcon fontSize="inherit"/>}
          </IconButton>
        </Tooltip>
      </div>
    </CardFooter>) : '';
  
  return (
    <GridItem xs={12} sm={12} md={12}>
        <Card style={{ marginBottom: '5px' }}>
          <CardHeader color={color} icon>
            <CardIcon color={!!itemOrder ? color : 'gray'}>
              <Print />
            </CardIcon>
            <GridContainer justifyContent='space-between'>
              <GridContainer justifyContent='flex-start'>
                <h2 className={classes.cardPrinterTitle} style={{ marginLeft: '10px' }}>{`${printer.product.brand?.name}`}</h2>
                <h2 className={classes.cardPrinterTitle}>{`${printer.product.model}`}</h2>
                <h4 className={classes.cardPrinterTitle} style={{ marginTop: '15px' }}>{`(${printer.serialNumber})`}</h4>
              </GridContainer>
              <DisplayWhen roles={['Admin', 'Moderator']}>
                <GridContainer justifyContent='flex-end' style={{ position: 'absolute', right: '10px' }}>
                  <Tooltip placement='left' title={t(nextContext.actionLabel)}>
                    <div style={{ margin: '10px' }}>
                      <Button justIcon round size='sm' aria-label="list" color={nextContext.color} className={classes.statusButton} onClick={() => send('TOGGLE')}>
                        <Icon className={classNames({ [classes.spin]: nextContext.spin})}>{nextContext.icon}</Icon>
                      </Button>
                    </div>
                  </Tooltip>
                </GridContainer>
              </DisplayWhen>
            </GridContainer> 
          </CardHeader>
          <CardBody>
            { !!itemOrder && show ? <OrderItem color={color} id={orderId} printer={printer._id} itemOrder={itemOrder}/> : null }
          </CardBody>
          {orderItemBlock}
        </Card>            
    </GridItem>
  )
}