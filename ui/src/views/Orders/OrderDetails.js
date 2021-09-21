import React from 'react';
import _ from 'lodash';
import { moment } from "utils";
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
import { baseURL } from 'utils';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { OrderPrinter } from './OrderPrinter';
import classNames from 'classnames';
import Success from 'components/Typography/Success';
import Danger from 'components/Typography/Danger';
import { DisplayWhen } from 'utils/auth.utils';
import { hasRole } from 'utils/auth.utils';
import Muted from 'components/Typography/Muted';
import Warning from 'components/Typography/Warning';
import Primary from 'components/Typography/Primary';

const useStyles = makeStyles(ordersStyle);

export function OrderDetails({color = 'warning'}) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { id } = useParams();
  const { t } = useTranslation();

  const order = useSelector(getOrderSelector(id), shallowEqual);

  const orderFormSchema = yup.object().shape({
    orderNumber: yup.number().positive('error.field.positive').required('error.field.required'),
    createdAt: yup.date().required('error.field.required').nullable().typeError('error.field.required'),
    customer: yup.object().required('error.field.required').nullable().typeError('error.field.required'),
    problem: yup.object().required('error.field.required').nullable().typeError('error.field.required'),
    status: yup.string(),
    technicalUser: yup.object().required('error.field.required').nullable().typeError('error.field.required'),
  });

  const { register, control, handleSubmit, formState, formState: { errors, isDirty, isValid }, reset } = useForm({
    resolver: yupResolver(orderFormSchema),
    defaultValues: {
      ...order,
    }
  });

  const onSubmit = async (data) => {
    let { problem: {_id:problem }, customer: {_id:customer }, technicalUser, ...rest} = data;
    technicalUser =  !!technicalUser ? technicalUser._id : null;

    await dispatch({ type: sagaActions.SAVE_ORDER, payload: { id, problem, customer, technicalUser, ...rest }});
  }

  React.useEffect(() => {
    const loadData = async () => await dispatch({ type: sagaActions.READ_ORDER, payload: { id } });
    if (_.isEmpty(order) || id !== order._id) {
      loadData();
    }

    reset({...order });
    setHasItems(Object.keys(order?.items || {}).length > 0)

  }, [dispatch, reset, order, id]);

  const printers = order?.customer?.printers.filter(p => hasRole(['Admin', 'Moderator']) ? true : Object.values(order?.items)?.some(i => i.printer._id === p._id)).map((printer, key) => (
    <OrderPrinter 
      printer={printer}
      orderId={id} 
      key={key}
      itemOrder={Object.values(order?.items)?.find(i => i.printer?._id === printer?._id)}/>
  ))

  const actualContextList = {
    closed: {
      icon: 'published_with_changes',
      label: 'label.order.status.closed',
      actionLabel: 'label.action.order.close',
      color: 'success',
      component: Success,
      spin: false
    },
    open: {
      icon: 'replay',
      label: 'label.order.status.open',
      color: 'danger',
      component: Danger,
      spin: false
    },
    wip: {
      icon: 'sync',
      label: 'label.order.status.wip',
      color: 'primary',
      component: Primary,
      spin: true
    },
    empty: {
      icon: 'sync_problem',
      label: 'label.order.status.empty',
      color: 'muted',
      component: Muted,
      spin: false
    },
    pending: {
      icon: 'fingerprint',
      label: 'label.order.status.pending',
      color: 'warning',
      component: Warning,
      spin: false
    }
  }

  const actualContext = actualContextList[order?.status || 'open'];
  const closeContext = actualContextList['closed'];

  const [hasItems, setHasItems] = React.useState(Object.keys(order?.items || {}).length > 0)
  
  const closeOrder = async () => {
    await dispatch({ type: sagaActions.ORDER_CLOSE, payload: { id, message: 'message.order.status.success' } });
  };

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Card>
            <CardHeader color={color} icon>
              <CardIcon color={color}>
                <Receipt /> 
              </CardIcon>
              <GridContainer justifyContent='space-between'>
                <h2 className={classes.cardTitle}>{t('label.order.details' )}</h2>
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
                <GridItem xs={12} sm={12} md={2}>
                  <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale="pt-br">
                    <Controller
                      control={control}
                      name="createdAt"
                      inputRef={register()}
                      render={({ field: { value }}) => (
                        <DateTimePicker
                          invalidDateMessage={t('error.field.invalid.format')}
                          variant="inline"
                          format={t('format.dateTime')}
                          margin="normal"
                          id="createdAt"
                          label={t('label.order.createdAt')}
                          value={value ? moment(value) : null}
                          fullWidth
                          disabled
                        />
                      )}
                    />
                  </MuiPickersUtilsProvider>
                </GridItem>
                <GridItem xs={12} sm={12}  md={3}>
                  <Controller
                    control={control}
                    name="customer"
                    inputRef={register()}
                    render={({ field: { onChange, value } }) => (
                      <CustomAutocomplete 
                        label={t('label.customer.text')}
                        optionLabel={(option) => `${option?.customerNumber} - ${option?.name}`}
                        optionSelected={(option, value) => option._id === value._id}
                        url='customers?status=active&limit=10000'
                        loadingText={t('label.loading')}
                        noOptionsText={t('error.customer.empty')}
                        onChange={(e, data) => onChange(data)}
                        value={value || null}
                        disabled
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
                <GridItem xs={12} sm={12}  md={3}>
                  <Controller
                    control={control}
                    name="problem"
                    inputRef={register()}
                    render={({ field: { onChange, value } }) => (
                      <CustomAutocomplete 
                        label={t('label.category.type.problem')}
                        optionLabel={(option) => `${option?._id} - ${option?.name}` }
                        url='categories?type=Problem&limit=10000'
                        loadingText={t('label.loading')}
                        noOptionsText={t('error.category.problem.empty')}
                        onChange={(e, data) => onChange(data)}
                        value={value || null}
                        disabled={!hasRole(['Admin', 'Moderator'])}
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
                <DisplayWhen roles={['Admin', 'Moderator']}>
                  <GridItem xs={12} sm={12}  md={2}>
                    <Controller
                      control={control}
                      name="technicalUser"
                      inputRef={register()}
                      render={({ field: { onChange, value } }) => (
                        <CustomAutocomplete 
                          label={t('label.order.technicalUser')}
                          optionLabel={(option) => `${option?.name || ''} ${option?.lastName || ''}`}
                          optionSelected={(option, value) => option._id === value._id}
                          url='users?status=active&limit=10000'
                          loadingText={t('label.loading')}
                          noOptionsText={t('error.users.empty')}
                          onChange={(e, data) => onChange(data)}
                          value={value || null}
                          InputProps={{
                            margin: "normal",
                            value: value || '',
                            required: true,
                            name: 'technicalUser',
                            error: formState.isSubmitted && !!errors.technicalUser,
                            helperText: t(errors.technicalUser?.message)
                          }}/>
                      )}
                    />
                  </GridItem>
                </DisplayWhen>
              </GridContainer>
            </CardBody>
            <CardFooter>
              <DisplayWhen roles={['Admin', 'Moderator']}>
                <Button
                  type='submit'
                  color={color}>
                  {t('button.save.order')}
                </Button>
              </DisplayWhen>
              <GridContainer justifyContent='flex-end'>
                <DisplayWhen roles={['Admin', 'Moderator']} check={() => order?.status !== 'closed'}>
                  <Tooltip placement='left' title={isDirty ? t('error.save.order.first') : !isValid ? t('error.save.order.required') : t(closeContext.actionLabel)}>
                    <div style={{ margin : '10px 0px'}}>
                      <Button justIcon round size='sm' color={closeContext.color} className={classes.statusButton} onClick={closeOrder}
                        disabled={isDirty || !isValid}>
                        <Icon style={{ marginRight: '5px' }} >{closeContext.icon}</Icon>
                      </Button>
                    </div>
                  </Tooltip>
                </DisplayWhen>
                <Tooltip placement='left' title={hasItems ? t('export.pdf.order') : t('error.printer.itemOrder') }>
                  <div style={{ margin : '5px 15px 5px 5px'}}>
                    <IconButton type='button' disabled={!hasItems} href={`${baseURL}orders/${id}/export`} target='_blank'>
                      <Icon>picture_as_pdf</Icon>
                    </IconButton>
                  </div>
                </Tooltip>
              </GridContainer>
            </CardFooter>
          </Card>            
        </form>
      </GridItem>
      {printers}
    </GridContainer>
  )
}