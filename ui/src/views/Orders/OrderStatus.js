
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { sagaActions }from 'sagas/actions.saga';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
import { useDispatch } from 'react-redux';
import ordersStyle from './orderStyle';
import { Icon } from '@material-ui/core';
import Button from 'components/CustomButtons/Button';
import { orderMachine } from 'machines/orderMachine';
import { useMachine } from '@xstate/react';
import classNames from 'classnames';

const useStyles = makeStyles(ordersStyle);

export function OrderStatus(props) {
  const { id, status } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const { t } = useTranslation();

  const [state, send] = useMachine(orderMachine(status || 'open'), {
    actions: {
      notifyOpen : (context, event) => handleStatusChange(event, 'open'),
      notifyWip : (context, event) => handleStatusChange(event, 'wip'),
      notifyClosed : (context, event) => handleStatusChange(event, 'closed')
    }
  });

  const handleStatusChange = async (event, status) => {
    if (event.type === 'NEXT') {
      await dispatch({ type: sagaActions.ORDER_CHANGE_STATUS, payload: { status, id, message: 'message.order.status.success' } });
    }
  };
  
  const actualContext = state.context[state.value];
  const nextContext = state.context[state.meta[`order.${state.value}`].context];

  return (
    <div className={classes.statusHeader}>
      <GridContainer style={{ flexGrow: 1 }}>
        <div className={classes.statusHeaderTitle}>
          <Icon className={classNames({ [classes.spin]: actualContext.spin, [classes[actualContext.color]]: actualContext.color })}>
            {actualContext.icon}
          </Icon>
          <div style={{ marginTop: '15px' }}>
            <actualContext.component>
              {t(actualContext.label)}
            </actualContext.component>
          </div>
        </div>
        <GridItem>
          <Button size='sm' aria-label="list" color={nextContext.color} className={classes.statusButton} onClick={() => send('NEXT')}>
            <Icon style={{ marginRight: '5px' }} className={classNames({ [classes.spin]: nextContext.spin})}>{nextContext.icon}</Icon> {t(nextContext.actionLabel)}
          </Button>
        </GridItem>
      </GridContainer>
    </div>
  )
}