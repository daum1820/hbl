
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { sagaActions }from 'sagas/actions.saga';
import Card from 'components/Card/Card.js';
import CardHeader from 'components/Card/CardHeader.js';
import orderStyle from './orderStyle';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import CardBody from 'components/Card/CardBody';
import Button from 'components/CustomButtons/Button';
import CustomAutocomplete from 'components/Common/Autocomplete';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import CardFooter from 'components/Card/CardFooter';

const useStyles = makeStyles(orderStyle);

export default function OrderCreate(props) {
  const { color } = props
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const orderFormSchema = yup.object().shape({
    problem: yup.object().required('error.field.required').nullable(),
    customer: yup.object().required('error.field.required').nullable()
  });

  const { register, control, handleSubmit, formState, formState: { errors }, reset } = useForm({
    resolver: yupResolver(orderFormSchema),
  });

  const onSubmit = async (data) => {
    const { problem: {_id:problem}, customer: {_id:customer} } = data;
    await dispatch({ type: sagaActions.SAVE_ORDER, payload: { problem, customer }, callback: () => reset({ problem: null, customer: null })});
  } 

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Card style={{ minHeight: '290px'}}>
        <CardHeader color={color}>
          <h3 className={classes.cardTitleWhite}>{t('label.order.new')}</h3>
          <p className={classes.cardCategoryWhite}></p>
        </CardHeader>
        <CardBody>
          <GridContainer>
            <GridItem xs={12} sm={12}  md={12}>
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
            <GridItem xs={12} sm={12}  md={12}>
              <Controller
                control={control}
                name="customer"
                inputRef={register()}
                render={({ field: { onChange, value } }) => (
                  <CustomAutocomplete 
                    label={t('label.customer.text')}
                    optionLabel={(option) => `${option?.customerNumber} - ${option?.name}` }
                    url='customers?status=active&limit=10000'
                    loadingText={t('label.loading')}
                    noOptionsText={t('error.customer.empty')}
                    onChange={(e, data) => onChange(data)}
                    value={value || null}
                    InputProps={{
                      value: value || '',
                      required: true,
                      name: 'customer',
                      margin: 'normal',
                      error: formState.isSubmitted && !!errors.customer,
                      helperText: t(errors.customer?.message)
                    }}/>
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
                {t('button.create.order')}
              </Button>
            </GridItem>
          </GridContainer>
        </CardFooter>
      </Card>
    </form>
  )
}