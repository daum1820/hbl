import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { sagaActions }from 'sagas/actions.saga';
import { Icon } from '@material-ui/core';
import styles from './userStyle';
import { useMachine } from '@xstate/react';
import { statusMachine } from 'machines/statusMachine';
import Button from 'components/CustomButtons/Button';
import classNames from 'classnames';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';

const useStyles = makeStyles(styles);

export function UserStatus({id, color, status }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { t } = useTranslation();

  const [state, send] = useMachine(statusMachine(status), {
    actions: {
      notifyActive : (context, event) => handleStatusChange(event, 'active'),
      notifyInactive : (context, event) => handleStatusChange(event, 'inactive')
    }
  });

  const handleStatusChange = async (event, status) => {
    if (event.type === 'TOGGLE') {
      await dispatch({ type: sagaActions.USER_CHANGE_SECURITY, payload: { status, id, message: 'message.user.security.success' } });
    }
  };
  
  const actualContext = state.context[state.value];
  const nextContext = state.context[state.meta[`status.${state.value}`].context];

  return (
    <div className={classes.statusHeader}>
      <GridContainer style={{ flexGrow: 1 }}>
        <div className={classes.statusHeaderTitle}>
          <Icon className={classNames({[classes[actualContext.color]]: actualContext.color })}>
            {actualContext.icon}
          </Icon>
          <div style={{ marginTop: '15px' }}>
            <actualContext.component>
              {t(actualContext.label)}
            </actualContext.component>
          </div>
        </div>
        <GridItem>
          <Button size='sm' aria-label="list" color={nextContext.color} className={classes.statusButton} onClick={() => send('TOGGLE')}>
            <Icon style={{ marginRight: '5px' }} >{nextContext.icon}</Icon> {t(nextContext.actionLabel)}
          </Button>
        </GridItem>
      </GridContainer>
    </div>
  )
}