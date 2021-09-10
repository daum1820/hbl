import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridItem from 'components/Grid/GridItem.js';
import GridContainer from 'components/Grid/GridContainer.js';
import Card from 'components/Card/Card.js';
import CardHeader from 'components/Card/CardHeader.js';
import CardBody from 'components/Card/CardBody.js';
import CardFooter from 'components/Card/CardFooter.js';
import { useDispatch, useSelector } from 'react-redux';
import { sagaActions }from 'sagas/actions.saga';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styles from './userStyle';
import { Checkbox, TextField } from '@material-ui/core';
import Button from 'components/CustomButtons/Button';
import CardIcon from 'components/Card/CardIcon';
import LockIcon from '@material-ui/icons/LockOutlined';
import { useTranslation } from 'react-i18next';
import Check from "@material-ui/icons/Check";
import { Trans } from 'react-i18next';
import { Redirect, useHistory } from 'react-router-dom';

const useStyles = makeStyles(styles);

export function UserPassword({ id, color='primary', showChangePassword = true, title = 'label.password.management', isLogin = false }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { t } = useTranslation();
  const isAuth = useSelector((state) => state.auth.auth);
  const user = useSelector((state) => state.auth.authUser);
  const history = useHistory();

  const userId = id || user._id;

  const userPasswordSchema = yup.object().shape({
    password: yup.string().required('error.field.required').min(8, 'error.field.length'),
    passwordConfirmation: yup.string().required('error.field.required').oneOf([yup.ref('password'), null], 'error.password.match'),
    changePassword: yup.boolean().default(false)
  });

  const { register, control, handleSubmit, formState, formState: { errors } } = useForm({
    resolver: yupResolver(userPasswordSchema),
    defaultValues: {
      changePassword: showChangePassword
    }
  });

  const onSubmit = async (data) => {
    const { password, changePassword } = data
    
    await dispatch({ type: sagaActions.USER_CHANGE_SECURITY, payload: { password, changePassword, id: userId, message: 'message.user.password.success' } });
    if (isLogin) {
      history.push('/');
    }
  }

  const fullName = isLogin ? `${user.name} ${user.lastName}` : '';
  const header = isLogin ? (
    <h3 className={classes.cardTitle} style={{marginBottom: '20px'}}>
      <Trans i18nKey="label.greetings.text">
        Bem-vindo <strong>{{fullName}}</strong>,
      </Trans>
    </h3>)
     : '';

  
  
  if (isLogin) {
    if (!isAuth) {
      return <Redirect to='/login' />
    }

    if (!user.changePassword) {
      return <Redirect to='/' />
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Card>
        <CardHeader color={color} icon>
        <CardIcon color={color}>
          <LockIcon /> 
        </CardIcon>
          {header}
          <h2 className={classes.cardTitle}>{t(title)}</h2>
        </CardHeader>
        <CardBody className={classes.textCenter}>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Controller
                control={control}
                name="password"
                inputRef={register()}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    variant="standard"
                    margin="normal"
                    type='password'
                    required
                    fullWidth
                    id="password"
                    label={t('label.password.text')}
                    name="password"
                    value={value || '' }
                    autoComplete='new-password'
                    error={ formState.isSubmitted && !!errors.password }
                    helperText={t(errors.password?.message)}
                    onChange={e => onChange(e.target.value)}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={12}>
              <Controller
                control={control}
                name="passwordConfirmation"
                inputRef={register()}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    variant="standard"
                    margin="normal"
                    type='password'
                    required
                    fullWidth
                    id="passwordConfirmation"
                    label={t('label.password.confirmation')}
                    name="passwordConfirmation"
                    value={value || '' }
                    autoComplete='new-password-confirmation'
                    error={ formState.isSubmitted && !!errors.passwordConfirmation }
                    helperText={t(errors.passwordConfirmation?.message)}
                    onChange={e => onChange(e.target.value)}
                  />
                )}
              />
            </GridItem>
            {showChangePassword ? (
              <GridItem xs={12} sm={12} md={12}>
                <div className={classes.changePassword}>
                  <Controller
                    control={control}
                    name="changePassword"
                    inputRef={register()}
                    render={({ field: { onChange, value } }) => (
                      <Checkbox
                        id="changePassword"
                        name="changePassword"
                        tabIndex={-1}
                        checked={value}
                        onClick={(e) => onChange(e.target.checked)}
                        checkedIcon={<Check className={classes.checkedIcon} />}
                        icon={<Check className={classes.uncheckedIcon} />}
                        classes={{
                          checked: classes.checked
                        }}
                      />
                    )}
                  />

                  <p className={classes.cardTitle}>{t('label.password.change')}</p>
                </div>
              </GridItem>)
            : '' }
          </GridContainer>
        </CardBody> 
        <CardFooter>
          <Button
            type='submit'
            variant='contained'
            color={color}>
            {t('button.password.change')}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}