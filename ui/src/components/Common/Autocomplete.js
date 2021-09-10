import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import API from 'lib/config';

export default function CustomAutocomplete(props)  {
  const {
    label,
    loadingText,
    noOptionsText,
    url,
    groupBy,
    optionLabel = (option) => option.name,
    optionSelected = (option, value) => option._id === value._id,
    InputProps,
    ...rest
  } = props;
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = open && options.length === 0;

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      const response = typeof url === 'string' ? await API.get({ url }) : await url();
      const data = await response.data.items;
      if (active) {
        setOptions(Object.values(data));
      }
    })();

    return () => {
      active = false;
    };
  }, [loading, url]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Autocomplete
      id="autocomplete"
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      groupBy={groupBy}
      getOptionSelected={optionSelected}
      getOptionLabel={optionLabel}
      options={options}
      loading={loading}
      loadingText={loadingText}
      noOptionsText={noOptionsText}
      fullWidth
      {...rest}
      renderInput={(params) => (
        <TextField
          {...params}
          {...InputProps}
          label={label}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}
