import React from 'react';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab';
import { getTypeSelector } from 'features/common.feature';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import Card from 'components/Card/Card.js';
import CardHeader from 'components/Card/CardHeader.js';
import CardBody from 'components/Card/CardBody.js';
import { sagaActions }from 'sagas/actions.saga';
import { Icon } from '@material-ui/core';
import CardIcon from 'components/Card/CardIcon';
import styles from './userStyle';
import { Security } from '@material-ui/icons';

const useStyles = makeStyles(styles);

export function UserSecurity({id, color, role:userRole }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { t } = useTranslation();
  const roles = useSelector(getTypeSelector('roles'), shallowEqual);

  const [role, setRole] = React.useState(userRole);

  React.useEffect(() => {
    const loadRoles = async () => await dispatch({ type: sagaActions.FETCH_TYPES, payload: { type: 'roles'} });
    if (_.isEmpty(roles)) {
      loadRoles();
    }
  }, [dispatch, roles]);

  const handleRoleChange = async (event, nextRole) => {
    if (!!nextRole) {
      await dispatch({ type: sagaActions.USER_CHANGE_SECURITY, payload: { role: nextRole, id, message: 'message.user.security.success' } });
      setRole(nextRole);
    }
  };

  return (
    <Card>
      <CardHeader icon>
        <CardIcon color={color}>
          <Security />
        </CardIcon>
        <h2 className={classes.cardTitle}>{t('label.security.roles')}</h2>
      </CardHeader>
      <CardBody className={classes.textCenter}>
        <ToggleButtonGroup value={role} exclusive onChange={handleRoleChange} style={{ marginTop: '15px'}}>
          {roles.map((props, key) => {
            return (
            <ToggleButton value={props.value} aria-label="list" classes={{ selected: classes[color]}} key={key}>
            <Icon>{t(props.icon)}</Icon> {t(props.label)}
            </ToggleButton>
            )}
          )}
        </ToggleButtonGroup>
      </CardBody>  
    </Card>
  )
}