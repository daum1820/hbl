import React from 'react';
import { moment } from "utils";
import MomentUtils from "@date-io/moment";
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { sagaActions }from 'sagas/actions.saga';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
import Card from 'components/Card/Card.js';
import ordersStyle from './orderStyle';
import CardBody from 'components/Card/CardBody';
import { TextField } from '@material-ui/core';
import Button from 'components/CustomButtons/Button';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import CardFooter from 'components/Card/CardFooter';
import NumberComponent from 'components/Common/NumberComponent';
import { formatInt } from 'utils';
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { OrderStatus } from './OrderStatus';

const useStyles = makeStyles(ordersStyle);

export function OrderItem(props) {
  const { color = 'warning', id, printer, itemOrder } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const { t } = useTranslation();

  const [isClosed, setIsClosed] = React.useState(itemOrder?.status === 'closed');
  const [startedAt, setStartedAt] = React.useState(itemOrder?.startedAt || new Date());

  const orderFormSchema = yup.object().shape({
    status: yup.string().nullable(),
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
    currentPB: yup.string().nullable(),
    currentColor: yup.string().nullable(),
    points: yup.string().nullable(),
    actions: yup.string().nullable(),
    notes: yup.string().nullable(),
    nos: yup.string().nullable()
  });

  const { register, control, handleSubmit, formState: { errors, isDirty }, reset } = useForm({
    resolver: yupResolver(orderFormSchema),
    defaultValues: {
      ...itemOrder,
    }
  });


  React.useEffect(() => {
    reset({...itemOrder });
    setIsClosed(itemOrder?.status === 'closed');
  }, [itemOrder, reset]);

  const onSubmit = async (data) => {
    console.info(data, errors)
    let { currentColor, currentPB, status, ...rest} = data;
    currentColor = formatInt(currentColor);
    currentPB = formatInt(currentPB);
    await dispatch({ type: sagaActions.ORDER_UPDATE_ITEM, payload: { id, printer, currentColor, currentPB, ...rest }});
  }
  console.info(errors)
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Card>
            <CardBody className={classes.textCenter}>
              <GridContainer>
                <GridItem xs={12} sm={12}  md={2}>
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
                <GridItem xs={12} sm={12}  md={2}>
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
                <GridItem xs={12} sm={12} md={3}>
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
                        />
                      )}
                    />
                  </MuiPickersUtilsProvider>
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
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
                        />
                      )}
                    />
                  </MuiPickersUtilsProvider>
                </GridItem>
              </GridContainer>
              <GridContainer >
                <GridItem xs={12} sm={12}  md={6}>
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
                <GridItem xs={12} sm={12}  md={6}>
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
                        multiline
                        minRows={3}
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
                  disabled={isClosed}
                  color={color}>
                  {t('button.save.equip')}
                </Button>
                <GridContainer justifyContent='flex-end'>
                  { !!printer ? <OrderStatus color={color} id={id} itemOrderId={itemOrder._id} status={itemOrder?.status} isDirty={isDirty} /> : null}
                </GridContainer>
              </CardFooter>
          </Card>            
        </form>
      </GridItem>
    </GridContainer>
  )
}