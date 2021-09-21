
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { sagaActions }from 'sagas/actions.saga';
import { useDispatch } from 'react-redux';
import ordersStyle from './orderStyle';
import { Icon, Tooltip } from '@material-ui/core';
import Button from 'components/CustomButtons/Button';
import { orderMachine } from 'machines/orderMachine';
import { useMachine } from '@xstate/react';
import classNames from 'classnames';

const useStyles = makeStyles(ordersStyle);

export function OrderStatus(props) {
  const { id, itemOrderId, status, isDirty, isValid } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const { t } = useTranslation();

  const [state, send] = useMachine(orderMachine(status || 'open'), {
    actions: {
      notifyOpen : (context, event) => handleStatusChange(event, 'open'),
      notifyWip : (context, event) => handleStatusChange(event, 'wip'),
      notifyClosed : (context, event) => handleStatusChange(event, 'closed'),
      notifyApprove : (context, event) => handleStatusChange(event, 'approve'),
    }
  });

  const handleStatusChange = async (event, status) => {
    if (event.type === 'NEXT' || event.type === 'APPROVE') {
      await dispatch({ type: sagaActions.ORDER_CHANGE_STATUS, payload: { itemOrderId, status, id, message: 'message.order.status.success' } });
    }
  };

  React.useEffect(() => {
    if(status === 'closed') {
      send('CLOSE')
    }
  }, [status, send])
  
  const nextContext = state.context[state.meta[`order.${state.value}`].context];

  return !!id && !!nextContext ? (
    <Tooltip placement='left' title={isDirty ? t('error.save.order.first') : !isValid && state.value === 'wip' ? t('error.save.order.required') : t(nextContext.actionLabel)}>
      <div>
        <Button justIcon round size='sm' color={nextContext.color} className={classes.statusButton} onClick={() => send('NEXT')}
          disabled={isDirty || (!isValid && state.value === 'wip')}>
          <Icon style={{ marginRight: '5px' }} className={classNames({ [classes.spin]: nextContext.spin})}>{nextContext.icon}</Icon>
        </Button>
      </div>
    </Tooltip>) : null;
}