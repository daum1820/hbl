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
import { getInvoiceSelector } from 'features/invoices.feature';
import Card from 'components/Card/Card.js';
import CardHeader from 'components/Card/CardHeader.js';
import invoicesStyle from './invoicesStyle';
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
import { baseURL, formatCurrency, formatPrice } from 'utils';
import { InvoiceStatus } from './InvoiceStatus';
import { InvoiceItem } from './InvoiceItem';
import CommonList from 'components/Common/CommonList';
import { getInvoiceItemSelectorFactory } from 'features/invoices.feature';
import { KeyboardDatePicker, DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

const useStyles = makeStyles(invoicesStyle);

export function InvoicesDetails({color = 'danger'}) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { id } = useParams();
  const { t } = useTranslation();

  const invoice = useSelector(getInvoiceSelector(id), shallowEqual);
  const [isClosed, setIsClosed] = React.useState(invoice?.status === 'closed');

  const invoiceFormSchema = yup.object().shape({
    invoiceNumber: yup.number().positive('error.field.positive').required('error.field.required'),
      
    dueDate: yup.date().required('error.field.required').nullable().typeError('error.field.required'),
    customer: yup.object().required('error.field.required').nullable().typeError('error.field.required'),
    discount: yup.string().default('R$ 0,00'),
    amountPaid: yup.string().default('R$ 0,00'),
    amount: yup.string().default('R$ 0,00'),
    amountToPay: yup.string().default('R$ 0,00'),
    status: yup.string(),
    paidDate: yup.date().when('status', {
      is: (val) => val !== 'open',
      then: yup.date().required('error.field.required').nullable().typeError('error.field.required'),
      otherwise: yup.date().nullable()
    }),
  });

  const { register, control, handleSubmit, formState, formState: { errors, isDirty }, setValue, getValues, reset } = useForm({
    resolver: yupResolver(invoiceFormSchema),
  });

  const onSubmit = async (data) => {
    let { amount, discount, amountPaid, amountToPay, customer: {_id:customer }, ...rest} = data;
    discount = formatPrice(discount);
    amountPaid = formatPrice(amountPaid);
    
    await dispatch({ type: sagaActions.SAVE_INVOICE, payload: { id, discount, amountPaid, customer, ...rest } });
  } 

  const updateTotalAmount = () => {
    const discount = formatPrice(getValues('discount'));
    const amountPaid = formatPrice(getValues('amountPaid'));
    const amount = formatPrice(getValues('amount'));
    
    setValue('amountToPay', amount - discount - amountPaid);
  }

  React.useEffect(() => {
    const loadData = async () => await dispatch({ type: sagaActions.READ_INVOICE, payload: { id } });
    if (_.isEmpty(invoice) || id !== invoice._id) {
      loadData();
    }

    reset({...invoice, amountToPay: invoice?.amount - invoice?.discount - invoice?.amountPaid });
    setIsClosed(invoice?.status === 'closed');

  }, [dispatch, reset, invoice, id, isClosed]);

  const handleValueChange = (event) => {
    setValue(event.target.name, event.target.value);
    updateTotalAmount();
  }

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={6}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Card>
            <CardHeader color={color} icon>
              <CardIcon color={color}>
                <Receipt /> 
              </CardIcon>
              <GridContainer justifyContent='space-between'>
                <h2 className={classes.cardTitle}>{t('label.invoice.details' )}</h2>
                { !!invoice ? <InvoiceStatus color={color} id={id} status={invoice?.status} isDirty={isDirty} /> : null}
              </GridContainer>
            </CardHeader>
            <CardBody className={classes.textCenter}>
              <GridContainer>
                <GridItem xs={12} sm={12}  md={3}>
                  <Controller
                    control={control}
                    name="invoiceNumber"
                    inputRef={register()}
                    render={({ field: { onChange, value } }) => (
                      <TextField
                        variant="standard"
                        margin="normal"
                        fullWidth
                        id="invoiceNumber"
                        label={t('label.invoice.code')}
                        name="invoiceNumber"
                        value={value || '' }
                        disabled
                        error={ formState.isSubmitted && (!!errors.invoiceNumber) }
                        helperText={t(errors.invoiceNumber?.message)}
                        onChange={e => onChange(e.target.value)}
                      />
                    )}
                  />
                </GridItem>
                <GridItem xs={12} sm={12}  md={3}>
                  <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale="pt-br">
                    <Controller
                      control={control}
                      name="createdAt"
                      inputRef={register()}
                      render={({ field: { value }}) => (
                        <DateTimePicker
                          invalidDateMessage={t('error.field.invalid.format')}
                          variant="inline"
                          format={t('format.date')}
                          margin="normal"
                          id="createdAt"
                          label={t('label.invoice.createdAt')}
                          value={value ? moment(value) : null}
                          fullWidth
                          disabled
                        />
                      )}
                    />
                  </MuiPickersUtilsProvider>
                </GridItem>
                <GridItem xs={12} sm={12}  md={6}>
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
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12}  md={4}>
                  <Controller
                    control={control}
                    name="discount"
                    inputRef={register()}
                    render={({ field: { value } }) => (
                      <TextField
                        variant="standard"
                        margin="normal"
                        fullWidth
                        id="discount"
                        label={t('label.invoice.discount')}
                        name="discount"
                        value={value || 0 }
                        disabled={isClosed}
                        error={ formState.isSubmitted && (!!errors.discount) }
                        helperText={t(errors.discount?.message)}
                        onChange={handleValueChange}
                        InputProps={{
                          inputComponent: NumberComponent,
                          inputProps: { 
                            prefix: 'R$ ',
                            fixedDecimalScale: true,
                            decimalScale: 2
                          }
                        }}
                      />
                    )}
                  />
                </GridItem>
                <GridItem xs={12} sm={12}  md={4}>
                  <Controller
                    control={control}
                    name="amountPaid"
                    inputRef={register()}
                    render={({ field: { value } }) => (
                      <TextField
                        variant="standard"
                        margin="normal"
                        fullWidth
                        id="amountPaid"
                        label={t('label.invoice.amountPaid')}
                        name="amountPaid"
                        value={value || 0 }
                        disabled={isClosed}
                        error={ formState.isSubmitted && (!!errors.amountPaid) }
                        helperText={t(errors.amountPaid?.message)}
                        onChange={handleValueChange}
                        InputProps={{
                          inputComponent: NumberComponent,
                          inputProps: { 
                            prefix: 'R$ ',
                            fixedDecimalScale: true,
                            decimalScale: 2
                          }
                        }}
                      />
                    )}
                  />
                </GridItem>
                <GridItem xs={12} sm={12}  md={4}>
                  <Controller
                    control={control}
                    name="amount"
                    inputRef={register()}
                    render={({ field: { value } }) => (
                      <TextField
                        variant="standard"
                        margin="normal"
                        fullWidth
                        id="amount"
                        label={t('label.invoice.amountItems')}
                        name="amount"
                        value={value || 0 }
                        disabled
                        InputProps={{
                          inputComponent: NumberComponent,
                          inputProps: { 
                            prefix: 'R$ ',
                            fixedDecimalScale: true,
                            decimalScale: 2
                          }
                        }}
                      />
                    )}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer justifyContent='flex-end'>
                <GridItem xs={12} sm={12} md={4}>
                  <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale="pt-br">
                    <Controller
                      control={control}
                      name="dueDate"
                      inputRef={register()}
                      render={({ field: { onChange, value } }) => (
                        <KeyboardDatePicker
                          invalidDateMessage={t('error.field.invalid.format')}
                          variant="inline"
                          format={t('format.date')}
                          margin="normal"
                          id="dueDate"
                          label={t('label.invoice.dueDate')}
                          value={value ? moment(value) : null}
                          onChange={date => onChange(date)}
                          fullWidth
                          disabled={isClosed}
                          error={ formState.isSubmitted && (!!errors.dueDate) }
                          helperText={t(errors.dueDate?.message)}
                        />
                      )}
                    />
                  </MuiPickersUtilsProvider>
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale="pt-br">
                    <Controller
                      control={control}
                      name="paidDate"
                      inputRef={register()}
                      render={({ field: { onChange, value } }) => (
                        <KeyboardDatePicker
                          invalidDateMessage={t('error.field.invalid.format')}
                          variant="inline"
                          format={t('format.date')}
                          margin="normal"
                          id="paidDate"
                          label={t('label.invoice.paidDate')}
                          value={value ? moment(value) : null}
                          onChange={date => onChange(date)}
                          fullWidth
                          disabled={isClosed}
                          error={ formState.isSubmitted && (!!errors.paidDate) }
                          helperText={t(errors.paidDate?.message)}
                        />
                      )}
                    />
                  </MuiPickersUtilsProvider>
                </GridItem>
                <GridItem xs={12} sm={12}  md={4}>
                  <Controller
                    control={control}
                    name="amountToPay"
                    inputRef={register()}
                    render={({ field: { value } }) => (
                      <TextField
                        variant="standard"
                        margin="normal"
                        fullWidth
                        id="amountToPay"
                        label={t('label.invoice.amountToPay')}
                        name="amountToPay"
                        value={value || 0 }
                        disabled
                        InputProps={{
                          inputComponent: NumberComponent,
                          inputProps: { 
                            prefix: 'R$ ',
                            fixedDecimalScale: true,
                            decimalScale: 2
                          }
                        }}
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
                  {t('button.save.invoice')}
                </Button>
                <Tooltip placement='left' title={t('export.pdf.invoice')}>
                  <a href={`${baseURL}invoices/${id}/export`} target="_blank" rel="noreferrer">
                    <IconButton type='button'>
                      <Icon>picture_as_pdf</Icon>
                    </IconButton>
                  </a>
                </Tooltip>
              </CardFooter>
          </Card>            
        </form>
      </GridItem>
      <GridItem xs={12} sm={12} md={6}>
        { !!invoice && !isClosed ? <InvoiceItem color={color} id={id} status={invoice?.status} /> : null}
      </GridItem>
      <GridItem xs={12} sm={12} md={12}>
        <CommonList
            limit={5}
            fullLoaded
            name='label.invoice.item.text'
            removeSaga={sagaActions.INVOICE_REMOVE_ITEM}
            headers={['label.invoice.item.number', 'label.product.model.code', 'label.description', 'label.quantity', 'label.price', 'label.invoice.item.price']}
            properties={
              [(item, idx) => idx,
               (item) => `${item.product?.model} - ${item.product?.description}`,
               (item) => item.description,
               (item) => item.quantity,
               (item) => formatCurrency(item.price),
               (item) => formatCurrency(item.quantity * item.price)
              ]}
            listSelector={getInvoiceItemSelectorFactory(id)}
            removePayload={(item) => ({ id, quantity: item.items[3], price: formatPrice(item.items[4]) })}
            emptyMessage='error.invoice.item.empty'
            color={color}
            create={() => false}
            view={() => false}
            remove={() => !isClosed}/> 
      </GridItem>
    </GridContainer>
  )
}