
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { sagaActions }from 'sagas/actions.saga';
import { useDispatch } from 'react-redux';
import ordersStyle from './orderStyle';
import { Icon } from '@material-ui/core';
import Button from 'components/CustomButtons/Button';
import { orderMachine } from 'machines/orderMachine';
import { useMachine } from '@xstate/react';
import classNames from 'classnames';
import { hasRole } from 'utils/auth.utils';

const useStyles = makeStyles(ordersStyle);

export function OrderStatus(props) {
  const { id, itemOrderId, status, handleSubmit, onSubmit } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const { t } = useTranslation();
  
  const isUser = !hasRole(['Admin', 'Moderator']);

  const validate = {
    invoke: {
      id: 'validateForm',
      src: () => {
        return new Promise((resolve, reject) => {
          handleSubmit(async (data) => { 
            await onSubmit(data);
            resolve();
          }, () => {
            reject();
          })()
        });
      },
      onDone: {
        target: isUser ? 'approve' : 'closed',
        actions: isUser ? 'notifyApprove' : 'notifyClosed'
      },
      onError: {
        target: 'wip',
      }
    }
  }

  const [state, send] = useMachine(orderMachine(status || 'open', validate), {
    actions: {
      notifyOpen : (context, event) => handleStatusChange(event, 'open'),
      notifyWip : (context, event) => handleStatusChange(event, 'wip'),
      notifyClosed : async (context, event) => handleStatusChange(event, 'closed'),
      notifyApprove : (context, event) => handleStatusChange(event, 'approve'),
    }
  });

  const handleStatusChange = async (event, status) => {
    await dispatch({ type: sagaActions.ORDER_CHANGE_STATUS, payload: { itemOrderId, status, id, message: 'message.order.status.success' } });
  };

  React.useEffect(() => send(status.toUpperCase()), [status, send]);
  
  const { actual:nextContext } = state.context;
  return !!id && nextContext.canExecute ? (
    <Button round size='sm' color={nextContext.actionColor} className={classes.statusButton} onClick={() => send('NEXT')}>
      <Icon style={{ marginRight: '5px' }} className={classNames({ [classes.spin]: nextContext.actionSpin})}>{nextContext.actionIcon}</Icon>{t(nextContext.actionLabel)}
    </Button>) : null;
}