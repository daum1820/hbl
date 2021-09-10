import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Card from 'components/Card/Card.js';
import CardHeader from 'components/Card/CardHeader.js';
import CardBody from 'components/Card/CardBody.js';
import { sagaActions }from 'sagas/actions.saga';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import CardIcon from 'components/Card/CardIcon';
import styles from './invoicesStyle';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
import { TextField } from '@material-ui/core';
import CardFooter from 'components/Card/CardFooter';
import Button from 'components/CustomButtons/Button';
import CustomAutocomplete from 'components/Common/Autocomplete';
import Print from '@material-ui/icons/Print';
import NumberComponent from 'components/Common/NumberComponent';
import { formatPrice } from 'utils';

const useStyles = makeStyles(styles);

export function InvoiceItem({ id, color }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { t } = useTranslation();

  const validationError = useSelector((state) => state.invoices.error);
  
  const printerFormSchema = yup.object().shape({
    product: yup.object().required('error.field.required').nullable(),
    description: yup.string(),
    price: yup.string().default('R$ 0,00').required('error.field.required'),
    quantity: yup.number().positive('error.field.positive').required('error.field.required').typeError('error.field.number'),
  });

  const { register, control, handleSubmit, formState, formState: { errors }, setValue, reset } = useForm({
    resolver: yupResolver(printerFormSchema),
  });
  
  const handleValueChange = (event) => {
    setValue(event.target.name, event.target.value);
  }

  const onSubmit = async (data) => {
    let { price, ...rest} = data;
    price = formatPrice(price);

    await dispatch({ type: sagaActions.INVOICE_ADD_ITEM, payload: { id, price, ...rest }, callback: () =>
      reset({ 
        product: null,
        description: null,
        quantity: null,
        price: 'R$ 0,00'
       })});
  } 
  
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Card style={{ minHeight: '388px'}}>
            <CardHeader color={color} icon>
            <CardIcon color={color}>
              <Print /> 
            </CardIcon>
              <h2 className={classes.cardTitle}>{t('label.invoice.item.add' )}</h2>
            </CardHeader>
            <CardBody className={classes.textCenter}>
            <GridContainer>
                <GridItem xs={12} sm={12}  md={6}>
                  <Controller
                      control={control}
                      name="product"
                      inputRef={register()}
                      render={({ field: { onChange, value } }) => (
                        <CustomAutocomplete 
                          label={t('label.product.service')}
                          optionLabel={(option) => `${option?.model} - ${option?.description}` }
                          url='products'
                          loadingText={t('label.loading')}
                          noOptionsText={t('error.product.empty')}
                          groupBy={(option) => t(`label.product.type.${option.type.toLowerCase()}s`)}
                          onChange={(e, data) => onChange(data)}
                          value={value || null}
                          InputProps={{
                            value: value || '',
                            required: true,
                            name: 'product',
                            margin: 'normal',
                            error: formState.isSubmitted && (!!errors.product || !!validationError?.product),
                            helperText: t(errors.product?.message || validationError?.product)
                          }}/>
 
                      )}
                    />
                </GridItem>
                <GridItem xs={12} sm={12}  md={3}>
                  <Controller
                    control={control}
                    name="quantity"
                    inputRef={register()}
                    render={({ field: { onChange, value } }) => (
                      <TextField
                        variant="standard"
                        margin="normal"
                        fullWidth
                        id="quantity"
                        label={t('label.quantity')}
                        name="quantity"
                        required
                        value={value}
                        error={ formState.isSubmitted && (!!errors.quantity) }
                        helperText={t(errors.quantity?.message)}
                        onChange={e => onChange(e.target.value)}
                        InputProps={{
                          inputComponent: NumberComponent,
                        }}
                      />
                    )}
                  />
                </GridItem>
                <GridItem xs={12} sm={12}  md={3}>
                  <Controller
                    control={control}
                    name="price"
                    inputRef={register()}
                    render={({ field: { value } }) => (
                      <TextField
                        variant="standard"
                        margin="normal"
                        fullWidth
                        id="price"
                        label={t('label.price')}
                        name="price"
                        required
                        value={value || 0 }
                        error={ formState.isSubmitted && (!!errors.price) }
                        helperText={t(errors.price?.message)}
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
                <GridItem xs={12} sm={12}  md={12}>
                  <Controller
                    control={control}
                    name="description"
                    inputRef={register()}
                    render={({ field: { onChange, value } }) => (
                      <TextField
                        variant="standard"
                        margin="normal"
                        fullWidth
                        id="description"
                        label={t('label.description')}
                        name="description"
                        value={value}
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
                  {t('button.add.invoice.item')}
                </Button>
              </CardFooter>
          </Card>
        </form>
      </GridItem>
    </GridContainer>
  )
}
