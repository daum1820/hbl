
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { sagaActions }from 'sagas/actions.saga';
import Card from 'components/Card/Card.js';
import CardHeader from 'components/Card/CardHeader.js';
import invoicesStyle from './invoicesStyle';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import CardBody from 'components/Card/CardBody';
import { getTypeSelector } from 'features/common.feature';
import { isEmpty } from 'lodash';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@material-ui/core';
import Button from 'components/CustomButtons/Button';
import CustomAutocomplete from 'components/Common/Autocomplete';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import CardFooter from 'components/Card/CardFooter';

const useStyles = makeStyles(invoicesStyle);

export default function InvoiceCreate(props) {
  const { color } = props
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const dueDateTypes = useSelector(getTypeSelector('dueDate'), shallowEqual);

  const invoiceFormSchema = yup.object().shape({
    due: yup.string().required('error.field.required'),
    customer: yup.object().required('error.field.required').nullable()
  });

  const { register, control, handleSubmit, formState, formState: { errors }, reset } = useForm({
    resolver: yupResolver(invoiceFormSchema),
  });
  
  React.useEffect(() => {
    const loadCategoryTypes = async () => await dispatch({ type: sagaActions.FETCH_TYPES, payload: { type: 'dueDate'} });
    if (isEmpty(dueDateTypes)) {
      loadCategoryTypes();
    }
  }, [dispatch, dueDateTypes]);


  const onSubmit = async (data) => {
    const { due, customer: {_id:customer }} = data;
    await dispatch({ type: sagaActions.SAVE_INVOICE, payload: { due, customer }, callback: () => reset({ due: null, customer: null })});
  } 
  

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Card style={{ minHeight: '329px'}}>
        <CardHeader color={color}>
          <h3 className={classes.cardTitleWhite}>{t('label.invoice.new')}</h3>
          <p className={classes.cardCategoryWhite}></p>
        </CardHeader>
        <CardBody>
          <GridContainer>
            <GridItem xs={12} sm={12}  md={12}>
              <Controller
                control={control}
                name="customer"
                inputRef={register()}
                render={({ field: { onChange, value } }) => (
                  <CustomAutocomplete 
                    label={t('label.customer.text')}
                    optionLabel={(option) => `${option?.customerNumber} - ${option?.name}` }
                    url='customers?status=active'
                    loadingText={t('label.loading')}
                    noOptionsText={t('error.customer.empty')}
                    onChange={(e, data) => onChange(data)}
                    value={value || null}
                    InputProps={{
                      value: value || '',
                      required: true,
                      margin: 'normal',
                      name: 'customer',
                      error: formState.isSubmitted && !!errors.customer,
                      helperText: t(errors.customer?.message)
                    }}/>
                )}
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={12}> 
              <Controller
                control={control}
                name="due"
                inputRef={register()}
                render={({ field: { onChange, value } }) => (
                  <FormControl margin='normal' required style={{ width: '100%'}} error={ formState.isSubmitted && !!errors.due }>
                    <InputLabel id="due-label">{t('label.invoice.dueDate')}</InputLabel>
                    <Select
                      className={classes.textLeft}
                      labelId="due-label"
                      id="due"
                      name="due"
                      value={value || ''}
                      onChange={e => onChange(e.target.value)}
                    >
                      {dueDateTypes.map((props, key) => (
                        <MenuItem value={props.value} key={key}>
                          {t(props.label)}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{t(errors.due?.message)}</FormHelperText>
                  </FormControl>
                )}
              />
            </GridItem>
          </GridContainer>
        </CardBody>
        <CardFooter style={{justifyContent: 'center'}}>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Button
                type='submit'
                color={color}>
                {t('button.create.invoice')}
              </Button>
            </GridItem>
          </GridContainer>
        </CardFooter>
      </Card>
    </form>
  )
}