import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import Card from 'components/Card/Card.js';
import CardHeader from 'components/Card/CardHeader.js';
import CardBody from 'components/Card/CardBody.js';
import { sagaActions }from 'sagas/actions.saga';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import CardIcon from 'components/Card/CardIcon';
import { useParams } from 'react-router-dom';
import PrintIcon from '@material-ui/icons/Print';
import styles from './customersStyle';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
import { TextField } from '@material-ui/core';
import { getCustomerSelector } from 'features/customers.feature';
import CardFooter from 'components/Card/CardFooter';
import Button from 'components/CustomButtons/Button';
import { isEmpty } from 'lodash';
import { RegistrationElement } from 'components/MaskedElement/RegistrationElement';
import { PhoneElement } from 'components/MaskedElement/PhoneElement';
import { ZipcodeElement } from 'components/MaskedElement/ZipcodeElement';
import { CustomerStatus } from './CustomerStatus';
import CommonList from 'components/Common/CommonList';
import { getCustomerPrintersSelectorFactory } from 'features/customers.feature';
import { CustomerPrinter } from './CustomerPrinter';
import ConfirmDelete from 'components/Common/ConfirmDelete';
import { DisplayWhen } from 'utils/auth.utils';
import { Pincode } from '../../components/Common/Pincode';

const useStyles = makeStyles(styles);

export function CustomersDetails({color = 'success'}) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { id } = useParams();
  const { t } = useTranslation();
  const editMode = !!id;

  const customer = useSelector(getCustomerSelector(id), shallowEqual);
  const validationError = useSelector((state) => state.customers.error);
  
  const userFormSchema = yup.object().shape({
    name: yup.string().required('error.field.required'),
    fullName: yup.string().required('error.field.required'),
    registrationNr: yup.string().required('error.field.required'),
    contactName: yup.string().required('error.field.required'),
    contactEmail: yup.string().required('error.field.required').email('error.email.invalid'),
  });

  const { register, control, handleSubmit, formState, formState: { errors }, reset } = useForm({
    resolver: yupResolver(userFormSchema),
  });

  const [pincode, setPincode] = React.useState(customer?.pincode);

  React.useEffect(() => {
    const loadData = async () => await dispatch({ type: sagaActions.READ_CUSTOMER, payload: { id } });
    if (editMode && (isEmpty(customer) || id !== customer._id)) {
      loadData();
    }
    
    if(!!customer && editMode) {
      reset({...customer})
      setPincode(customer.pincode);
    }
  }, [dispatch, reset, id, editMode, customer]);

  const onSubmit = async (data) => {
    await dispatch({ type: sagaActions.SAVE_CUSTOMER, payload: { id, ...data }});
  }

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Card style={{ minHeight: '485px'}}>
              <CardHeader color={color} icon>
                <CardIcon color={color}>
                  <PrintIcon /> 
                </CardIcon>
                <GridContainer justifyContent='space-between'>
                  <h2 className={classes.cardTitle}>{t('label.customers.details' )}</h2>
                  { editMode && !!customer ? <CustomerStatus id={id} color={color} status={customer.status}/> : ''}
                </GridContainer>
              </CardHeader>
              <CardBody className={classes.textCenter}>
                {editMode ? (
                <GridContainer>
                  <GridItem xs={12} sm={12} md={4}>
                    <Controller
                      control={control}
                      name="customerNumber"
                      inputRef={register()}
                      render={({ field: { onChange, value } }) => (
                        <TextField
                          variant="standard"
                          margin="normal"
                          required
                          fullWidth
                          id="customerNumber"
                          label={t('label.code')}
                          name="customerNumber"
                          value={value || '' }
                          disabled
                          error={ formState.isSubmitted && (!!errors.customerNumber || !!validationError?.customerNumber) }
                          helperText={t(errors.customerNumber?.message || validationError?.customerNumber)}
                          onChange={e => onChange(e.target.value)}
                        />
                      )}
                    />
                  </GridItem>
                </GridContainer>): ''}
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
                          id="name"
                          label={t('label.customers.name')}
                          name="name"
                          value={value || '' }
                          error={ formState.isSubmitted && (!!errors.name || !!validationError?.name) }
                          helperText={t(errors.name?.message || validationError?.name)}
                          onChange={e => onChange(e.target.value)}
                        />
                      )}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12}  md={5}>
                    <Controller
                      control={control}
                      name="fullName"
                      inputRef={register()}
                      render={({ field: { onChange, value } }) => (
                        <TextField
                          variant="standard"
                          margin="normal"
                          required
                          fullWidth
                          id="fullName"
                          label={t('label.customers.fullName')}
                          name="fullName"
                          value={value || '' }
                          error={ formState.isSubmitted && (!!errors.fullName || !!validationError?.fullName) }
                          helperText={t(errors.fullName?.message || validationError?.fullName)}
                          onChange={e => onChange(e.target.value)}
                        />
                      )}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12}  md={3}>
                    <Controller
                      control={control}
                      name="registrationNr"
                      inputRef={register()}
                      render={({ field: { onChange, value } }) => (
                        <RegistrationElement
                          variant="standard"
                          margin="normal"
                          required
                          fullWidth
                          id="registrationNr"
                          label={t('label.customers.registrationNr')}
                          name="registrationNr"
                          value={value || '' }
                          error={ formState.isSubmitted && (!!errors.registrationNr || !!validationError?.registrationNr) }
                          helperText={t(errors.registrationNr?.message || validationError?.registrationNr)}
                          onChange={e => onChange(e.target.value)}
                        />
                      )}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={4}>
                    <Controller
                      control={control}
                      name="contactName"
                      inputRef={register()}
                      render={({ field: { onChange, value } }) => (
                        <TextField
                          variant="standard"
                          margin="normal"
                          required
                          fullWidth
                          id="contactName"
                          label={t('label.customers.contactName')}
                          name="contactName"
                          value={value || '' }
                          error={ formState.isSubmitted && (!!errors.contactName || !!validationError?.contactName) }
                          helperText={t(errors.contactName?.message || validationError?.contactName)}
                          onChange={e => onChange(e.target.value)}
                        />
                      )}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <Controller
                      control={control}
                      name="contactEmail"
                      inputRef={register()}
                      render={({ field: { onChange, value } }) => (
                        <TextField
                          variant="standard"
                          margin="normal"
                          required
                          fullWidth
                          id="contactEmail"
                          label={t('label.customers.contactEmail')}
                          name="contactEmail"
                          value={value || '' }
                          error={ formState.isSubmitted && (!!errors.contactEmail || !!validationError?.contactEmail) }
                          helperText={t(errors.contactEmail?.message || validationError?.contactEmail)}
                          onChange={e => onChange(e.target.value)}
                        />
                      )}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <Controller
                      control={control}
                      name="contactPhone"
                      inputRef={register()}
                      render={({ field: { onChange, value } }) => (
                        <PhoneElement
                          variant="standard"
                          margin="normal"
                          fullWidth
                          id="contactPhone"
                          label={t('label.customers.contactPhone')}
                          name="contactPhone"
                          value={value || '' }
                          error={ formState.isSubmitted && (!!errors.contactPhone || !!validationError?.contactPhone) }
                          helperText={t(errors.contactPhone?.message || validationError?.contactPhone)}
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
                <DisplayWhen roles={['Admin']}>
                  <GridItem container justifyContent='flex-start'>
                    <Button
                      round
                      type='submit'
                      color={color}>
                      {t('button.save.customer')}
                    </Button>
                    <ConfirmDelete id={id} color={color} context='customers' removeAction={sagaActions.DELETE_CUSTOMER}/>
                  </GridItem>
                </DisplayWhen>
              </CardFooter>
            </Card>
          </form>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <GridItem xs={12} sm={12} md={12}>
            { editMode && !!customer ? <CustomerPrinter id={id} color={color} /> : null}
          </GridItem>
          <GridItem xs={12} sm={12} md={12}>
            { editMode && !!pincode ? <Pincode id={id} 
              color={color}
              pincode={pincode}
              allowGeneration
              title={t('label.customer.newPincode')}
              header={t('label.customers.pincode' )}
              action={sagaActions.CUSTOMER_PINCODE}
            /> : null}
          </GridItem>
        </GridItem>
      </GridContainer>
      { editMode ? (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <CommonList
              limit={5}
              fullLoaded
              name='label.printers'
              removeSaga={sagaActions.CUSTOMER_DELETE_PRINTER}
              headers={['label.serialNumber', 'label.model', 'label.product.brand']}
              properties={['serialNumber', (item) => item.product?.model, (item) => item.product?.brand?.name]}
              listSelector={getCustomerPrintersSelectorFactory(id)}
              removePayload={{ id }}
              emptyMessage='error.customer.printers.empty'
              color={color}
              create={() => false}
              view={() => false}
              remove={() => true}/> 
        </GridItem>
      </GridContainer>
      ) : ''}
    </div>
  )
}