import React from 'react';
import _ from 'lodash';
import moment from "moment";
import MomentUtils from "@date-io/moment";
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { sagaActions }from 'sagas/actions.saga';
import { useParams } from 'react-router-dom';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
import { getOrderSelector } from 'features/orders.feature';
import Card from 'components/Card/Card.js';
import CardHeader from 'components/Card/CardHeader.js';
import ordersStyle from './orderStyle';
import CardBody from 'components/Card/CardBody';
import { Icon, IconButton, TextField, Tooltip } from '@material-ui/core';
import Button from 'components/CustomButtons/Button';
import CustomAutocomplete from 'components/Common/Autocomplete';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import CardIcon from 'components/Card/CardIcon';
import { Receipt } from '@material-ui/icons';
import CardFooter from 'components/Card/CardFooter';
import NumberComponent from 'components/Common/NumberComponent';
import { baseURL } from 'utils';
import { formatInt } from 'utils';
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { OrderStatus } from './OrderStatus';

const useStyles = makeStyles(ordersStyle);

export function OrderDetails({color = 'warning'}) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { id } = useParams();
  const { t } = useTranslation();

  const order = useSelector(getOrderSelector(id), shallowEqual);
  const [isClosed, setIsClosed] = React.useState(order?.status === 'closed');
  const [isOpen, setIsOpen] = React.useState(order?.status === 'open');
  const [startedAt, setStartedAt] = React.useState(order?.startedAt || new Date());

  const orderFormSchema = yup.object().shape({
    orderNumber: yup.number().positive('error.field.positive').required('error.field.required'),
    customer: yup.object().required('error.field.required').nullable().typeError('error.field.required'),
    printer: yup.object().required('error.field.required').nullable().typeError('error.field.required'),
    problem: yup.object().required('error.field.required').nullable().typeError('error.field.required'),
    status: yup.string(),
    technicalUser: yup.object().when('status', {
      is: (val) => val !== 'open',
      then: yup.object().required('error.field.required').nullable().typeError('error.field.required'),
      otherwise: yup.object().nullable()
    }),
    startedAt: yup.date().when('status', {
      is: (val) => val !== 'open',
      then: yup.date().required('error.field.required').nullable().typeError('error.field.required'),
      otherwise: yup.date().nullable()
    }),
    finishedAt: yup.date().when('status', {
      is: (val) => val === 'closed',
      then: yup.date().required('error.field.required').nullable().typeError('error.field.required'),
      otherwise: yup.date().nullable()
    }),
    currentPB: yup.string(),
    currentColor: yup.string(),
    points: yup.string(),
    actions: yup.string(),
    notes: yup.string(),
    nos: yup.string()
  });

  const { register, control, handleSubmit, formState, formState: { errors }, setValue, reset } = useForm({
    resolver: yupResolver(orderFormSchema),
    defaultValues: {
      ...order,
    }
  });

  const onSubmit = async (data) => {
    let { problem: {_id:problem }, customer: {_id:customer }, printer: {_id:printer }, technicalUser, currentColor, currentPB, ...rest} = data;
    technicalUser =  !!technicalUser ? technicalUser._id : null;
    currentColor = formatInt(currentColor);
    currentPB = formatInt(currentPB);
    await dispatch({ type: sagaActions.SAVE_ORDER, payload: { id, problem, customer, printer, technicalUser, currentColor, currentPB, ...rest }});
  }

  React.useEffect(() => {
    const loadData = async () => await dispatch({ type: sagaActions.READ_ORDER, payload: { id } });
    if (_.isEmpty(order) || id !== order._id) {
      loadData();
    }

    reset({...order });
    setIsClosed(order?.status === 'closed');
    setIsOpen(order?.status === 'open');
    setCustomer(order?.customer);
    setStartedAt(order?.startedAt);
  }, [dispatch, reset, order, id, isClosed]);


  const [customer, setCustomer] = React.useState(null);

  const printerPromise = () => new Promise((resolve) => {
    resolve({ data: { items :  customer?.printers || [] }});
  });

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Card style={{ minHeight: '510px'}}>
            <CardHeader color={color} icon>
              <CardIcon color={color}>
                <Receipt /> 
              </CardIcon>
              <GridContainer justifyContent='space-between'>
                <h2 className={classes.cardTitle}>{t('label.order.details' )}</h2>
                { !!order ? <OrderStatus color={color} id={id} status={order?.status}/> : null}
              </GridContainer>
            </CardHeader>
            <CardBody className={classes.textCenter}>
              <GridContainer>
                <GridItem xs={12} sm={12}  md={2}>
                  <Controller
                    control={control}
                    name="orderNumber"
                    inputRef={register()}
                    render={({ field: { onChange, value } }) => (
                      <TextField
                        variant="standard"
                        margin="normal"
                        fullWidth
                        id="orderNumber"
                        label={t('label.order.code')}
                        name="orderNumber"
                        value={value || '' }
                        disabled
                        error={ formState.isSubmitted && (!!errors.orderNumber) }
                        helperText={t(errors.orderNumber?.message)}
                        onChange={e => onChange(e.target.value)}
                      />
                    )}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12}  md={4}>
                  <Controller
                    control={control}
                    name="customer"
                    inputRef={register()}
                    render={({ field: { onChange, value } }) => (
                      <CustomAutocomplete 
                        label={t('label.customer.text')}
                        optionLabel={(option) => `${option?.customerNumber} - ${option?.name}`}
                        optionSelected={(option, value) => option._id === value._id}
                        url='customers?status=active'
                        loadingText={t('label.loading')}
                        noOptionsText={t('error.customer.empty')}
                        onChange={(e, data) => {setCustomer(data); setValue('printer', null); onChange(data)}}
                        value={value || null}
                        disabled={isClosed}
                        InputProps={{
                          margin: "normal",
                          value: value || '',
                          required: true,
                          name: 'customer',
                          error: formState.isSubmitted && !!errors.customer,
                          helperText: t(errors.customer?.message)
                        }}/>
                    )}
                  />
                </GridItem>
                <GridItem xs={12} sm={12}  md={1}>
                  <Controller
                    control={control}
                    name="currentPB"
                    inputRef={register()}
                    render={({ field: { onChange, value } }) => (
                      <TextField
                        variant="standard"
                        margin="normal"
                        fullWidth
                        id="currentPB"
                        label={t('label.order.pb')}
                        name="currentPB"
                        value={value}
                        disabled={isClosed}
                        onChange={e => onChange(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                          inputComponent: NumberComponent,
                        }}
                      />
                    )}
                  />
                </GridItem>
                <GridItem xs={12} sm={12}  md={1}>
                  <Controller
                    control={control}
                    name="currentColor"
                    inputRef={register()}
                    render={({ field: { onChange, value } }) => (
                      <TextField
                        variant="standard"
                        margin="normal"
                        fullWidth
                        id="currentColor"
                        label={t('label.order.color')}
                        name="currentColor"
                        value={value}
                        disabled={isClosed}
                        onChange={e => onChange(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                          inputComponent: NumberComponent,
                        }}
                      />
                    )}
                  />
                </GridItem>
                <GridItem xs={12} sm={12}  md={2}>
                  <Controller
                    control={control}
                    name="nos"
                    inputRef={register()}
                    render={({ field: { onChange, value } }) => (
                      <TextField
                        variant="standard"
                        margin="normal"
                        fullWidth
                        id="nos"
                        label={t('label.order.nos')}
                        name="nos"
                        value={value || '' }
                        disabled={isClosed}
                        onChange={e => onChange(e.target.value)}
                      />
                    )}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale="pt-br">
                    <Controller
                      control={control}
                      name="startedAt"
                      inputRef={register()}
                      render={({ field: { onChange, value } }) => (
                        <KeyboardDateTimePicker
                          disableFuture
                          invalidDateMessage={t('error.field.invalid.format')}
                          variant="inline"
                          format={t('format.dateTime')}
                          margin="normal"
                          id="startedAt"
                          label={t('label.order.startedAt')}
                          value={value ? moment(value) : null}
                          onChange={date => { onChange(date); setStartedAt(date)}}
                          fullWidth
                          disabled={isClosed}
                          KeyboardButtonProps={{
                            'aria-label': 'change date',
                          }}
                        />
                      )}
                    />
                  </MuiPickersUtilsProvider>
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12}  md={4}>
                  <Controller
                    control={control}
                    name="printer"
                    inputRef={register()}
                    render={({ field: { onChange, value } }) => (
                      <CustomAutocomplete 
                        label={t('label.customer.printer')}
                        groupBy={(option) => option?.product?.model}
                        optionLabel={(option) => `${option?.product?.description} (${option?.serialNumber})` }
                        url={printerPromise}
                        loadingText={t('label.loading')}
                        noOptionsText={t('error.printer.empty')}
                        onChange={(e, data) => onChange(data)}
                        value={value || null}
                        disabled={!customer || isClosed}
                        InputProps={{
                          value: value || '',
                          required: true,
                          name: 'printer',
                          margin: 'normal',
                          error: formState.isSubmitted && !!errors.printer,
                          helperText: t(errors.printer?.message)
                        }}/>
                    )}
                  />
                </GridItem>
                <GridItem xs={12} sm={12}  md={4}>
                  <Controller
                    control={control}
                    name="technicalUser"
                    inputRef={register()}
                    render={({ field: { onChange, value } }) => (
                      <CustomAutocomplete 
                        label={t('label.order.technicalUser')}
                        optionLabel={(option) => `${option?.name || ''} ${option?.lastName || ''}`}
                        optionSelected={(option, value) => option._id === value._id}
                        url='users?status=active'
                        loadingText={t('label.loading')}
                        noOptionsText={t('error.users.empty')}
                        onChange={(e, data) => onChange(data)}
                        value={value || null}
                        disabled={isClosed}
                        InputProps={{
                          margin: "normal",
                          value: value || '',
                          required: !isOpen,
                          name: 'technicalUser',
                          error: formState.isSubmitted && !!errors.technicalUser,
                          helperText: t(errors.technicalUser?.message)
                        }}/>
                    )}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale="pt-br">
                    <Controller
                      control={control}
                      name="finishedAt"
                      inputRef={register()}
                      render={({ field: { onChange, value } }) => (
                        <KeyboardDateTimePicker
                          disableFuture
                          invalidDateMessage={t('error.field.invalid.format')}
                          variant="inline"
                          format={t('format.dateTime')}
                          margin="normal"
                          id="finishedAt"
                          label={t('label.order.finishedAt')}
                          value={value ? moment(value) : null}
                          onChange={date => onChange(date)}
                          minDate={startedAt || new Date()}
                          minDateMessage={t('error.field.minDate')}
                          fullWidth
                          disabled={isClosed}
                          KeyboardButtonProps={{
                            'aria-label': 'change date',
                          }}
                        />
                      )}
                    />
                  </MuiPickersUtilsProvider>
                </GridItem>
              </GridContainer>
              <GridContainer >
                <GridItem xs={12} sm={12}  md={4}>
                  <Controller
                    control={control}
                    name="problem"
                    inputRef={register()}
                    render={({ field: { onChange, value } }) => (
                      <CustomAutocomplete 
                        label={t('label.category.type.problem')}
                        optionLabel={(option) => `${option?._id} - ${option?.name}` }
                        url='categories?type=Problem&limit=200'
                        loadingText={t('label.loading')}
                        noOptionsText={t('error.category.problem.empty')}
                        onChange={(e, data) => onChange(data)}
                        value={value || null}
                        disabled={isClosed}
                        InputProps={{
                          value: value || '',
                          required: true,
                          name: 'problem',
                          margin: 'normal',
                          error: formState.isSubmitted && !!errors.problem,
                          helperText: t(errors.problem?.message)
                        }}/>
                    )}
                  />
                </GridItem>
                <GridItem xs={12} sm={12}  md={4}>
                  <Controller
                    control={control}
                    name="actions"
                    inputRef={register()}
                    render={({ field: { onChange, value } }) => (
                      <TextField
                        variant="standard"
                        margin="normal"
                        fullWidth
                        id="actions"
                        label={t('label.order.action')}
                        name="actions"
                        value={value || '' }
                        disabled={isClosed}
                        onChange={e => onChange(e.target.value)}
                      />
                    )}
                  />
                </GridItem>
                <GridItem xs={12} sm={12}  md={4}>
                  <Controller
                    control={control}
                    name="points"
                    inputRef={register()}
                    render={({ field: { onChange, value } }) => (
                      <TextField
                        variant="standard"
                        margin="normal"
                        fullWidth
                        id="points"
                        label={t('label.order.points')}
                        name="points"
                        value={value || '' }
                        disabled={isClosed}
                        onChange={e => onChange(e.target.value)}
                      />
                    )}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12}  md={12}>
                  <Controller
                    control={control}
                    name="notes"
                    inputRef={register()}
                    render={({ field: { onChange, value } }) => (
                      <TextField
                        variant="standard"
                        margin="normal"
                        fullWidth
                        id="notes"
                        label={t('label.order.notes')}
                        name="notes"
                        value={value || '' }
                        disabled={isClosed}
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
                  {t('button.save.order')}
                </Button>
                <Tooltip placement='left' title={t('export.pdf.order')}>
                  <a href={`${baseURL}orders/${id}/export`} target="_blank" rel="noreferrer">
                    <IconButton type='button'>
                      <Icon>picture_as_pdf</Icon>
                    </IconButton>
                  </a>
                </Tooltip>
              </CardFooter>
          </Card>            
        </form>
      </GridItem>
    </GridContainer>
  )
}