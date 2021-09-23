import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LocalPrint from '@material-ui/icons/LocalPrintshopOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { TextField } from '@material-ui/core';
import Button from 'components/CustomButtons/Button.js';
import { sagaActions }from 'sagas/actions.saga';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
import Card from 'components/Card/Card.js';
import CardHeader from 'components/Card/CardHeader.js';
import CardBody from 'components/Card/CardBody.js';
import CardFooter from 'components/Card/CardFooter.js';
import CardIcon from 'components/Card/CardIcon';

import styles from './userStyle';
import { Redirect, useLocation } from 'react-router-dom';

const useStyles = makeStyles(styles);

const loginFormSchema = yup.object().shape({
  username: yup.string().required('error.field.required'), 
  password: yup.string().required('error.field.required'),
});

export default function UserLogin() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useStyles();
  const { state } = useLocation();
  const validationError = useSelector((state) => state.auth.error);
  const isAuth = useSelector((state) => state.auth.auth);
  const changePassword = useSelector((state) => state.auth.authUser.changePassword);

  const { control, register, handleSubmit, formState, formState: { errors } } = useForm({
    resolver: yupResolver(loginFormSchema)
  });
  
  const onSubmit = async (event) => {
    const {username, password } = event;
    await dispatch({ type: sagaActions.LOGIN, payload: { username, password }});
    dispatch({type: sagaActions.CLEAR_ALL_NOTIFICATIONS });
  };

  if (isAuth) {
   return <Redirect to={ changePassword ? 'change-password' : (state?.from || '/') } />
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Card>
        <CardHeader color='primary' icon>
          <CardIcon color='primary'>
            <LocalPrint /> 
          </CardIcon>
          <h2 className={classes.cardTitle} style={{ marginLeft: '120px'}}>{t('company.name')}</h2>
        </CardHeader>
        <CardBody className={classes.textCenter}>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Controller
                control={control}
                name="username"
                inputRef={register()}
                render={({ field: { onChange } }) => (
                  <TextField
                    variant="standard"
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label={t('label.user.name')}
                    name="username"
                    autoComplete="username"
                    autoFocus
                    error={ formState.isSubmitted && (!!errors?.username || !!validationError?.username) }
                    helperText={t(errors.username?.message || validationError?.username)}
                    onChange={e => onChange(e.target.value)}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={12}>
              <Controller
                control={control}
                name="password"
                inputRef={register()}
                render={({ field: { onChange } }) => (
                  <TextField
                    variant="standard"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label={t('label.password.text')}
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    error={ formState.isSubmitted && (!!errors?.password || !!validationError?.password)}
                    helperText={t(errors.password?.message || validationError?.password)}
                    onChange={e => onChange(e.target.value)}
                  />
                )}
              />
            </GridItem>
          </GridContainer>
        </CardBody> 
        <CardFooter>
          <Button
            round
            type='submit'
            fullWidth
            variant='contained'
            color='primary'>
            {t('button.login')}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}