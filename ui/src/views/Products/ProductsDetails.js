import React from 'react';
import _, { isEmpty } from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import { getTypeSelector } from 'features/common.feature';
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
import FormControl from '@material-ui/core/FormControl';
import styles from './productsStyle';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
import { useQuery } from 'utils';
import { FormHelperText, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import { getProductSelector } from 'features/products.feature';
import CardFooter from 'components/Card/CardFooter';
import Button from 'components/CustomButtons/Button';
import { getCategoryTypeSelectorFactory } from 'features/categories.feature';

const useStyles = makeStyles(styles);

export function ProductsDetails({color = 'success'}) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { id } = useParams();
  const { t } = useTranslation();
  const editMode = !!id;
  const query = useQuery();

  const product = useSelector(getProductSelector, shallowEqual);
  const brands = useSelector(getCategoryTypeSelectorFactory('Brand'), shallowEqual);
  const productTypes = useSelector(getTypeSelector('productTypes'), shallowEqual);
  const validationError = useSelector((state) => state.products.error);

  const [isPrinter, setIsPrinter] = React.useState(!isEmpty(product) && product.type === 'Printer');
  
  const userFormSchema = yup.object().shape({
    model: yup.string().required('error.field.required'),
    description: yup.string().required('error.field.required'),
    type: yup.string().required('error.field.required'),
    brand: yup.string().when('type', {
      is: 'Printer',
      then: yup.string().required('error.field.required'),
      otherwise: yup.string()
    }),
  });

  const { register, control, handleSubmit, formState, formState: { errors }, setValue, reset } = useForm({
    resolver: yupResolver(userFormSchema),
  });

  React.useEffect(() => {
    const loadProductTypes = async () => await dispatch({ type: sagaActions.FETCH_TYPES, payload: { type: 'productTypes'} });
    if (_.isEmpty(productTypes)) {
      loadProductTypes();
    }
  }, [dispatch, productTypes]);

  React.useEffect(() => {
    const loadBrands = async () => await dispatch({ type: sagaActions.LIST_CATEGORIES, payload: {  params: { type: 'Brand', limit: 100 } } });
    if (_.isEmpty(brands)) {
      loadBrands();
    }
  }, [dispatch, brands]);

  React.useEffect(() => {
    const loadData = async () => await dispatch({ type: sagaActions.READ_PRODUCT, payload: { id } });
    if (editMode && (_.isEmpty(product) || id !== product._id)) {
      loadData();
    }
    
    if(!!product && editMode) {
      reset({...product})
      setIsPrinter(!isEmpty(product.type) && product.type === 'Printer');
    }
  }, [dispatch, reset, id, editMode, product]);

  const onSubmit = async (data) => {
    await dispatch({ type: sagaActions.SAVE_PRODUCT, payload: { id, ...data }});
  } 

  if (query.has('type')) {
    const type = query.get('type');
    setValue('type', type);
    if(isPrinter !== (!isEmpty(type) && type === 'Printer')) {
      setIsPrinter(!isEmpty(type) && type === 'Printer');
    }
  }

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={6}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Card>
            <CardHeader color={color} icon>
            <CardIcon color={color}>
              <PrintIcon /> 
            </CardIcon>
              <h2 className={classes.cardTitle}>{t('label.product.details' )}</h2>
            </CardHeader>
            <CardBody className={classes.textCenter}>
            <GridContainer>
              { query.has('type') ? '' : (
              <GridItem xs={12} sm={12}  md={12}>
                <Controller
                  control={control}
                  name="type"
                  inputRef={register()}
                  render={({ field: { onChange, value } }) => (
                    <FormControl margin='normal' required style={{ width: '100%'}} error={ formState.isSubmitted && (!!errors.type || !!validationError?.type) }>
                      <InputLabel id="product-label">{t('label.product.type.text')}</InputLabel>
                      <Select
                        className={classes.textLeft}
                        labelId="product-label"
                        id="type"
                        name="type"
                        value={value || ''}
                        onChange={e => {
                          setIsPrinter(e.target.value === 'Printer')
                          onChange(e.target.value)
                        }}>
                        {productTypes.map((props, key) => (
                          <MenuItem value={props.value} key={key}>
                            {t(props.label)}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>{t(errors.type?.message || validationError?.type)}</FormHelperText>
                    </FormControl>
                  )}
                />
              </GridItem>)}
              <GridItem xs={12} sm={12} md={12}>
                  <Controller
                    control={control}
                    name="model"
                    inputRef={register()}
                    render={({ field: { onChange, value } }) => (
                      <TextField
                        variant="standard"
                        margin="normal"
                        required
                        fullWidth
                        id="model"
                        label={t(isPrinter ? 'label.model' : 'label.code')}
                        name="model"
                        value={value || '' }
                        error={ formState.isSubmitted && (!!errors.model || !!validationError?.model) }
                        helperText={t(errors.model?.message || validationError?.model)}
                        onChange={e => onChange(e.target.value)}
                      />
                    )}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <Controller
                    control={control}
                    name="description"
                    inputRef={register()}
                    render={({ field: { onChange, value } }) => (
                      <TextField
                        variant="standard"
                        margin="normal"
                        required
                        fullWidth
                        id="description"
                        label={t('label.description')}
                        name="description"
                        value={value || '' }
                        error={ formState.isSubmitted && (!!errors.description || !!validationError?.description) }
                        helperText={t(errors.description?.message || validationError?.description)}
                        onChange={e => onChange(e.target.value)}
                      />
                    )}
                  />
                </GridItem>
                {isPrinter ? (
                <GridItem xs={12} sm={12}  md={12}>
                  <Controller
                      control={control}
                      name="brand"
                      inputRef={register()}
                      render={({ field: { onChange, value } }) => (
                        <FormControl margin='normal' required style={{ width: '100%'}} error={ formState.isSubmitted && (!!errors.brand || !!validationError?.brand) }>
                          <InputLabel id="brand-label">{t('label.product.brand')}</InputLabel>
                          <Select
                            className={classes.textLeft}
                            labelId="brand-label"
                            id="brand"
                            name="brand"
                            value={value || ''}
                            onChange={e => onChange(e.target.value)}
                          >
                            {brands.map((props, key) => (
                              <MenuItem value={props._id} key={key}>
                                {props.name}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText>{t(errors.brand?.message || validationError?.brand)}</FormHelperText>
                        </FormControl>
                      )}
                    />
                </GridItem>) : ''}
              </GridContainer>
            </CardBody>  
            <CardFooter>
                <Button
                  type='submit'
                  color={color}>
                  {t('button.save.product')}
                </Button>
              </CardFooter>
          </Card>
        </form>
      </GridItem>
    </GridContainer>
  )
}