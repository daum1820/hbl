import React from 'react';
import _ from 'lodash';
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
import CategoryIcon from '@material-ui/icons/Category';
import FormControl from '@material-ui/core/FormControl';
import styles from './categoriesStyle';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
import { useQuery } from 'utils';
import { FormHelperText, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import { getCategorySelector } from 'features/categories.feature';
import CardFooter from 'components/Card/CardFooter';
import Button from 'components/CustomButtons/Button';

const useStyles = makeStyles(styles);

export function CategoriesDetails({color = 'rose'}) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { id } = useParams();
  const { t } = useTranslation();
  const editMode = !!id;
  const query = useQuery();

  const category = useSelector(getCategorySelector(id), shallowEqual);
  const categoryTypes = useSelector(getTypeSelector('categoryTypes'), shallowEqual);
  const validationError = useSelector((state) => state.categories.error);
  
  const userFormSchema = yup.object().shape({
    name: yup.string().required('error.field.required'),
    type: yup.string().required('error.field.required'),
  });

  const { register, control, handleSubmit, formState, formState: { errors }, setValue, reset } = useForm({
    resolver: yupResolver(userFormSchema),
  });

  React.useEffect(() => {
    const loadCategoryTypes = async () => await dispatch({ type: sagaActions.FETCH_TYPES, payload: { type: 'categoryTypes'} });
    if (_.isEmpty(categoryTypes)) {
      loadCategoryTypes();
    }
  }, [dispatch, categoryTypes]);

  React.useEffect(() => {
    const loadData = async () => await dispatch({ type: sagaActions.READ_CATEGORY, payload: { id } });
    if (editMode && (_.isEmpty(category) || id !== category._id)) {
      loadData();
    }
    if(!!category) {
      reset({...category})
    }
  }, [dispatch, reset, id, editMode, category]);

  const onSubmit = async (data) => {
    await dispatch({ type: sagaActions.SAVE_CATEGORY, payload: { id, ...data }});
  } 

  if (query.has('type')) {
    setValue('type', query.get('type'));
  }

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={6}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Card>
            <CardHeader color={color} icon>
            <CardIcon color={color}>
              <CategoryIcon /> 
            </CardIcon>
              <h2 className={classes.cardTitle}>{t('label.category.details' )}</h2>
            </CardHeader>
            <CardBody className={classes.textCenter}>
            <GridContainer>
              { editMode ? (
                <GridItem xs={12} sm={12} md={6}>
                  <Controller
                    control={control}
                    name="_id"
                    inputRef={register()}
                    render={({ field: { value } }) => (
                      <TextField
                        variant="standard"
                        margin="normal"
                        required
                        fullWidth
                        id="_id"
                        label={t('label.category.code')}
                        name="_id"
                        value={value || '' }
                        disabled={true}
                      />
                    )}
                  />
                </GridItem>
                ): ""}
                <GridItem xs={12} sm={12} md={12}>
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
                        label={t('label.name')}
                        name="name"
                        value={value || '' }
                        error={ formState.isSubmitted && (!!errors.name || !!validationError?.name) }
                        helperText={t(errors.name?.message || validationError?.name)}
                        onChange={e => onChange(e.target.value)}
                      />
                    )}
                  />
                </GridItem>
                <GridItem xs={12} sm={12}  md={12}>
                  <Controller
                      control={control}
                      name="type"
                      inputRef={register()}
                      render={({ field: { onChange, value } }) => (
                        <FormControl margin='normal' required style={{ width: '100%'}} error={ formState.isSubmitted && (!!errors.type || !!validationError?.type) }>
                          <InputLabel id="category-label">{t('label.category.type.text')}</InputLabel>
                          <Select
                            className={classes.textLeft}
                            labelId="category-label"
                            id="type"
                            name="type"
                            value={value || ''}
                            onChange={e => onChange(e.target.value)}
                          >
                            {categoryTypes.map((props, key) => (
                              <MenuItem value={props.value} key={key}>
                                {t(props.label)}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText>{t(errors.type?.message || validationError?.type)}</FormHelperText>
                        </FormControl>
                      )}
                    />
                </GridItem>
              </GridContainer>
            </CardBody>  
            <CardFooter>
                <Button
                  type='submit'
                  color={color}>
                  {t('button.save.category')}
                </Button>
              </CardFooter>
          </Card>
        </form>
      </GridItem>
    </GridContainer>
  )
}