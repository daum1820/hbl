import ReactCodeInput from 'react-code-input';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Card from 'components/Card/Card.js';
import CardHeader from 'components/Card/CardHeader.js';
import CardBody from 'components/Card/CardBody.js';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import CardIcon from 'components/Card/CardIcon';
import styles from '../../views/Customers/customersStyle';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
import Button from 'components/CustomButtons/Button';
import FingerprintIcon from '@material-ui/icons/Fingerprint';
import { Icon, Tooltip } from '@material-ui/core';
import classNames from 'classnames';
import Danger from 'components/Typography/Danger';

const useStyles = makeStyles(styles);

export function Pincode({id, pincode, color, icon = 'refresh', allowGeneration = false, title, header, action, fields = 4 }) {

  const dispatch = useDispatch();
  const classes = useStyles();
  const { t } = useTranslation();
  
  const validationError = useSelector((state) => state.orders.error);

  const pincodeFormSchema = yup.object().shape({
    pincode: allowGeneration ? yup.string().nullable() : yup.string().required('error.field.required').min(fields, 'error.field.required'),
  });

  const { register, control, handleSubmit, formState: { errors, isDirty }, setValue, reset } = useForm({
    resolver: yupResolver(pincodeFormSchema),
    defaultValues: {
      pincode
    }
  });

  const [loading, setLoading] = React.useState(false)

  const onSubmit = async ({ pincode }) => {
    setValue('pincode', '');
    setLoading(true);
    await dispatch({ type: action, payload: { id, pincode }, callback: () => {
      setTimeout(() => { setLoading(false) }, 500)
      setTimeout(() => { reset() }, 600)
    }});
  }

  React.useEffect(() => {
    setValue('pincode', pincode);
  }, [pincode, setValue])

  return(
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Card>
            <CardHeader icon>
            <CardIcon color={!isDirty && (!!errors.pincode || !!validationError?.pincode) ? 'danger' : color}>
              <FingerprintIcon /> 
            </CardIcon>
              <h2 className={classes.cardTitle}>{!isDirty && (!!errors.pincode || !!validationError?.pincode) ? (<Danger>{t(errors.pincode?.message || validationError?.pincode)}</Danger>): t(header)}</h2>
            </CardHeader>
            <CardBody className={classes.textCenter}>
            <GridContainer>
                <GridItem style={{ display: 'flex', justifyContent: 'center' }} xs={12} sm={12} md={12}>
                { !loading ?
                  <Controller
                    control={control}
                    name="pincode"
                    inputRef={register()}
                    render={({ field: { onChange, value } }) => (
                      <ReactCodeInput
                        type='number'
                        fields={fields}
                        name="pincode"
                        disabled={allowGeneration}
                        autoFocus={!allowGeneration}
                        value={value}
                        onChange={(data) => onChange(data)}
                        />
                    )}
                  />
                  : null }
                  <Tooltip placement='top' title={title}>
                    <div>
                      <Button
                        style={{ marginLeft: '10px'}}
                        round
                        justIcon
                        type='submit'
                        color={color}>
                        <Icon className={classNames({ [classes.spin]: loading})}>{ loading ? 'loop' : icon } </Icon>
                      </Button>
                    </div>
                  </Tooltip>
                </GridItem>
              </GridContainer>
            </CardBody>  
          </Card>
        </form>
      </GridItem>
    </GridContainer>
  )
}