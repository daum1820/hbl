import React from 'react';
import _ from 'lodash';
import { moment } from "utils";
import MomentUtils from "@date-io/moment";
import { useParams, useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import GridItem from 'components/Grid/GridItem.js';
import GridContainer from 'components/Grid/GridContainer.js';
import Card from 'components/Card/Card.js';
import CardHeader from 'components/Card/CardHeader.js';
import CardBody from 'components/Card/CardBody.js';
import CardFooter from 'components/Card/CardFooter.js';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { sagaActions }from 'sagas/actions.saga';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField } from '@material-ui/core';
import { getUserSelector } from 'features/users.feature';
import { readFromToken } from 'lib/token';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import "moment/locale/pt-br";
import Button from 'components/CustomButtons/Button';
import CardIcon from 'components/Card/CardIcon';
import PersonIcon from '@material-ui/icons/Person';
import { UserSecurity } from './UserSecurity';
import { UserStatus } from './UserStatus';
import { UserPassword } from './UserPassword';
import styles from './userStyle';
import { PhoneElement } from 'components/MaskedElement/PhoneElement';
import { ZipcodeElement } from 'components/MaskedElement/ZipcodeElement';

const useStyles = makeStyles(styles);

export default function UserDetails({color = 'primary'}) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { id } = useParams();
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const editMode = !pathname.includes('/create');
  
  const userId = editMode ? id || readFromToken('_id') : null;

  const user = useSelector(getUserSelector(userId), shallowEqual);
  const validationError = useSelector((state) => state.users.error);

  const userFormSchema = yup.object().shape({
    isNew: yup.boolean().default(false),
    username: yup.string().required('error.field.required').min(8, 'error.field.length'), 
    name: yup.string().required('error.field.required'),
    lastName: yup.string().required('error.field.required'),
    email: yup.string().required('error.field.required').email('error.email.invalid'),
    password: yup.string().when('isNew', {
      is: true,
      then: yup.string().required('error.field.required').min(8, 'error.field.length'),
      otherwise: yup.string()
    }),
    passwordConfirmation: yup.string().when('isNew', {
      is: true,
      then: yup.string().required('error.field.required').oneOf([yup.ref('password'), null], 'error.password.match'),
      otherwise: yup.string()
    }),
  });

  const { register, control, handleSubmit, formState, formState: { errors }, reset } = useForm({
    resolver: yupResolver(userFormSchema),
    defaultValues: {
      ...user,
    }
  });

  const onSubmit = async (data) => {
    await dispatch({ type: sagaActions.SAVE_USER, payload: { id: userId, ...data }});
  } 

  React.useEffect(() => {
    const loadData = async () => await dispatch({ type: sagaActions.READ_USER, payload: { id } });
    if (editMode && (_.isEmpty(user) || id !== user._id)) {
      loadData();
    }
    if(!!user) {
      reset({...user});
    }
  }, [dispatch, reset, id, editMode, user]);

  register('isNew', { value: !editMode });

  if (!!user || !editMode) {
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Card style={{ minHeight: '505px'}}>
              <CardHeader icon>
                <CardIcon color={color}>
                  <PersonIcon /> 
                </CardIcon>
                <GridContainer justifyContent='space-between'>
                  <h2 className={classes.cardTitle}>{t(id || !editMode ? 'label.user.details' : 'label.profile.text')}</h2>
                  { !!id && editMode ? <UserStatus id={id} color={color} status={user.status}/> : ''}
                </GridContainer>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={4}>
                    <Controller
                      control={control}
                      name="username"
                      inputRef={register()}
                      render={({ field: { onChange, value } }) => (
                        <TextField
                          variant="standard"
                          margin="normal"
                          required
                          fullWidth
                          id="username"
                          label={t('label.user.name')}
                          name="username"
                          value={value || '' }
                          disabled={editMode}
                          error={ formState.isSubmitted && (!!errors.username || !!validationError?.username) }
                          helperText={t(errors.username?.message || validationError?.username)}
                          onChange={e => onChange(e.target.value)}
                        />
                      )}
                    />
                  </GridItem>
                  { !editMode ? (
                    <GridItem xs={12} sm={12} md={4}>
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
                            disabled={editMode}
                            error={ formState.isSubmitted && !!errors.password }
                            helperText={t(errors.password?.message)}
                            onChange={e => onChange(e.target.value)}
                          />
                        )}
                      />
                    </GridItem>
                    ): ""}
                    { !editMode ? (
                    <GridItem xs={12} sm={12} md={4}>
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
                            disabled={editMode}
                            error={ formState.isSubmitted && !!errors.passwordConfirmation }
                            helperText={t(errors.passwordConfirmation?.message)}
                            onChange={e => onChange(e.target.value)}
                          />
                        )}
                      />
                    </GridItem>
                  ): ""}
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={4}>
                    <Controller
                      control={control}
                      name="name"
                      inputRef={register()}
                      render={({ field: { onChange, value } }) => (
                        <TextField
                          variant="standard"
                          margin="normal"
                          required
                          fullWidth
                          label={t('label.name')}
                          id='name'
                          value={value || '' }
                          error={formState.isSubmitted && !!errors.name }
                          helperText={t(errors.name?.message)}
                          onChange={e => onChange(e.target.value)}
                        />
                      )}
                    />
                  </GridItem>                
                  <GridItem xs={12} sm={12} md={4}>
                    <Controller
                      control={control}
                      name="lastName"
                      inputRef={register()}
                      render={({ field: { onChange, value } }) => (
                        <TextField
                          variant="standard"
                          margin="normal"
                          required
                          fullWidth
                          label={t('label.lastname')}
                          id='lastName'
                          value={value || '' }
                          error={formState.isSubmitted && !!errors.lastName }
                          helperText={t(errors.lastName?.message)}
                          onChange={e => onChange(e.target.value)}
                        />
                      )}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale="pt-br">
                      <Controller
                        control={control}
                        name="dateOfBirth"
                        inputRef={register()}
                        render={({ field: { onChange, value } }) => (
                          <KeyboardDatePicker
                            disableFuture
                            invalidDateMessage={t('error.field.invalid.format')}
                            variant="inline"
                            format={t('format.date')}
                            margin="normal"
                            id="dateOfBirth"
                            label={t('label.dateOfBirth')}
                            value={value ? moment(value) : null}
                            onChange={date => onChange(date)}
                            fullWidth
                          />
                        )}
                      />
                    </MuiPickersUtilsProvider>
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={4}>
                    <Controller
                      control={control}
                      name="email"
                      inputRef={register()}
                      render={({ field: { onChange, value } }) => (
                        <TextField
                          variant="standard"
                          margin="normal"
                          required
                          fullWidth
                          label={t('label.email')}
                          id='email'
                          value={value || '' }
                          error={ formState.isSubmitted && (!!errors.email || !!validationError?.email) }
                          helperText={t(errors.email?.message || validationError?.email)}
                          onChange={e => onChange(e.target.value)}
                        />
                      )}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <Controller
                      control={control}
                      name="phone"
                      inputRef={register()}
                      render={({ field: { onChange, value } }) => (
                        <PhoneElement
                          variant="standard"
                          margin="normal"
                          fullWidth
                          label={t('label.phone')}
                          id='phone'
                          value={value || '' }
                          onChange={e => onChange(e.target.value)}
                        />
                      )}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <Controller
                      control={control}
                      name="position"
                      inputRef={register()}
                      render={({ field: { onChange, value } }) => (
                        <TextField
                          variant="standard"
                          margin="normal"
                          fullWidth
                          label={t('label.position')}
                          id='position'
                          value={value || '' }
                          onChange={e => onChange(e.target.value)}
                        />
                      )}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={5}>
                    <Controller
                      control={control}
                      name="address"
                      inputRef={register()}
                      render={({ field: { onChange, value } }) => (
                        <TextField
                          variant="standard"
                          margin="normal"
                          fullWidth
                          label={t('label.address')}
                          id='address'
                          value={value || '' }
                          onChange={e => onChange(e.target.value)}
                        />
                      )}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3}>
                    <Controller
                      control={control}
                      name="city"
                      inputRef={register()}
                      render={({ field: { onChange, value } }) => (
                        <TextField
                          variant="standard"
                          margin="normal"
                          fullWidth
                          label={t('label.city')}
                          id='city'
                          value={value || '' }
                          onChange={e => onChange(e.target.value)}
                        />
                      )}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={2}>
                    <Controller
                      control={control}
                      name="state"
                      inputRef={register()}
                      render={({ field: { onChange, value } }) => (
                        <TextField
                          variant="standard"
                          margin="normal"
                          fullWidth
                          label={t('label.state')}
                          id='state'
                          value={value || '' }
                          onChange={e => onChange(e.target.value)}
                        />
                      )}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={2}>
                    <Controller
                      control={control}
                      name="zipcode"
                      inputRef={register()}
                      render={({ field: { onChange, value } }) => (
                        <ZipcodeElement
                          variant="standard"
                          margin="normal"
                          fullWidth
                          label={t('label.zipcode')}
                          id='zipcode'
                          value={value || '' }
                          onChange={e => onChange(e.target.value)}
                        />
                      )}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                <Button
                  type='submit'
                  color={color}>
                  {t(id || !editMode ? 'button.save.user' : 'button.save.profile')}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <GridItem xs={12} sm={12} md={12}>
            { !!id && editMode ? <UserSecurity id={id} color={color} role={user.role} /> : ''}
          </GridItem>
          <GridItem xs={12} sm={12} md={12}>
            { editMode ? <UserPassword id={userId} color={color} showChangePassword={!!id} /> : ''}
          </GridItem>
        </GridItem>
      </GridContainer>
    );
  }
   
  return ''
}
