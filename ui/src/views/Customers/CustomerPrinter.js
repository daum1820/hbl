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
import CategoryIcon from '@material-ui/icons/Category';
import styles from './customersStyle';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
import { TextField } from '@material-ui/core';
import CardFooter from 'components/Card/CardFooter';
import Button from 'components/CustomButtons/Button';
import CustomAutocomplete from 'components/Common/Autocomplete';

const useStyles = makeStyles(styles);

export function CustomerPrinter({ id, color }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { t } = useTranslation();

  const validationError = useSelector((state) => state.customers.error);
  
  const printerFormSchema = yup.object().shape({
    serialNumber: yup.string().required('error.field.required'),
    product: yup.object().required('error.field.required').nullable(),
  });

  const { register, control, handleSubmit, formState, formState: { errors }, reset } = useForm({
    resolver: yupResolver(printerFormSchema),
  });

  const onSubmit = async (data) => {
    await dispatch({ type: sagaActions.CUSTOMER_ADD_PRINTER, payload: { id, ...data }, callback: () => reset({ serialNumber: '', product: null })});
  } 
  
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Card style={{ minHeight: '460px'}}>
            <CardHeader color={color} icon>
            <CardIcon color={color}>
              <CategoryIcon /> 
            </CardIcon>
              <h2 className={classes.cardTitle}>{t('label.customers.printer.add' )}</h2>
            </CardHeader>
            <CardBody className={classes.textCenter}>
            <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <Controller
                    control={control}
                    name="serialNumber"
                    inputRef={register()}
                    render={({ field: { onChange, value } }) => (
                      <TextField
                        variant="standard"
                        margin="normal"
                        required
                        fullWidth
                        id="serialNumber"
                        label={t('label.serialNumber')}
                        name="serialNumber"
                        value={value || '' }
                        error={ formState.isSubmitted && (!!errors.serialNumber || !!validationError?.serialNumber) }
                        helperText={t(errors.serialNumber?.message || validationError?.serialNumber)}
                        onChange={e => onChange(e.target.value)}
                      />
                    )}
                  />
                </GridItem>
                <GridItem xs={12} sm={12}  md={12}>
                  <Controller
                      control={control}
                      name="product"
                      inputRef={register()}
                      render={({ field: { onChange, value } }) => (
                        <CustomAutocomplete 
                          label={t('label.customers.printer.model')}
                          optionLabel={(option) => option?.model }
                          url='products?type=Printer&limit=10000'
                          loadingText={t('label.loading')}
                          noOptionsText={t('error.customer.printers.empty')}
                          groupBy={(option) => option.brand.name}
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
              </GridContainer>
            </CardBody>  
            <CardFooter>
                <Button
                  type='submit'
                  color={color}>
                  {t('button.add.printer')}
                </Button>
              </CardFooter>
          </Card>
        </form>
      </GridItem>
    </GridContainer>
  )
}
