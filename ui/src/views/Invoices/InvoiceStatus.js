import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { sagaActions }from 'sagas/actions.saga';
import { Icon, Tooltip } from '@material-ui/core';
import styles from './invoicesStyle';
import { useMachine } from '@xstate/react';
import { invoiceMachine } from 'machines/invoiceMachine';
import Button from 'components/CustomButtons/Button';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
import classNames from 'classnames';

const useStyles = makeStyles(styles);

export function InvoiceStatus(props) {
  const { id, status, isDirty } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const { t } = useTranslation();

  const [state, send] = useMachine(invoiceMachine(status), {
    actions: {
      notifyOpen : (context, event) => handleStatusChange(event, 'open'),
      notifyClosed : (context, event) => handleStatusChange(event, 'closed')
    }
  });

  const handleStatusChange = async (event, status) => {
    if (event.type === 'TOGGLE') {
      await dispatch({ type: sagaActions.INVOICE_CHANGE_STATUS, payload: { status, id, message: 'message.invoice.status.success' } });
    }
  };
  
  const actualContext = state.context[state.value];
  const nextContext = state.context[state.meta[`invoice.${state.value}`].context];

  return (
    <div className={classes.statusHeader}>
      <GridContainer style={{ flexGrow: 1 }}>
        <div className={classes.statusHeaderTitle}>
          <Icon className={classNames({ [classes[actualContext.color]]: actualContext.color })}>
            {actualContext.icon}
          </Icon>
          <div style={{ marginTop: '15px' }}>
            <actualContext.component>
              {t(actualContext.label)}
            </actualContext.component>
          </div>
        </div>
        <GridItem>
        <Tooltip placement='top' title={isDirty ? t('error.save.invoice.first') : ''}>
          <div>
            <Button size='sm' aria-label="list" color={nextContext.color} className={classes.statusButton} onClick={() => send('TOGGLE')} disabled={isDirty}>
              <Icon style={{ marginRight: '5px' }}>{nextContext.icon}</Icon> {t(nextContext.actionLabel)}
            </Button>
          </div>
        </Tooltip>
        </GridItem>
      </GridContainer>
    </div>
  )
}