import React, { useState } from 'react';
import { TextField, Link, Typography, Grid } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { palette } from '@mui/system';
import { useAppDispatch } from '../util/redux/hooks';
import { login as loginRedux } from '../util/redux/userSlice';
import FormGrid from '../components/form/FormGrid';
import FormCol from '../components/form/FormCol';
import FormRow from '../components/form/FormRow';
import { emailRegex, InputErrorMessage } from '../util/inputvalidation';
import { loginUser } from './api';
import AlertDialog from '../components/AlertDialog';
import PrimaryButton from '../components/buttons/PrimaryButton';
import ScreenGrid from '../components/ScreenGrid';
import COLORS from '../assets/colors';

/**
 * A page allowing users to input their email and password to login. The default
 * starting page of the application
 */
function LoginPage() {
  const navigate = useNavigate();

  // Default values for state
  const defaultValues = {
    email: '',
    password: '',
  };
  const defaultShowErrors = {
    email: false,
    password: false,
    alert: false,
  };
  const defaultErrorMessages = {
    email: '',
    password: '',
    alert: '',
  };
  type ValueType = keyof typeof values;

  // State values and hooks
  const [values, setValueState] = useState(defaultValues);
  const [showError, setShowErrorState] = useState(defaultShowErrors);
  const [errorMessage, setErrorMessageState] = useState(defaultErrorMessages);

  // Helper functions for changing only one field in a state object
  const setValue = (field: string, value: string) => {
    setValueState((prevState) => ({
      ...prevState,
      ...{ [field]: value },
    }));
  };
  const setShowError = (field: string, show: boolean) => {
    setShowErrorState((prevState) => ({
      ...prevState,
      ...{ [field]: show },
    }));
  };
  const setErrorMessage = (field: string, msg: string) => {
    setErrorMessageState((prevState) => ({
      ...prevState,
      ...{ [field]: msg },
    }));
  };

  const alertTitle = 'Error';
  const handleAlertClose = () => {
    setShowError('alert', false);
  };

  const dispatch = useAppDispatch();
  function dispatchUser(
    userEmail: string,
    firstName: string,
    lastName: string,
    admin: boolean,
  ) {
    dispatch(loginRedux({ email: userEmail, firstName, lastName, admin }));
  }

  const clearErrorMessages = () => {
    setShowErrorState(defaultShowErrors);
    setErrorMessageState(defaultErrorMessages);
  };

  const validateInputs = () => {
    clearErrorMessages();
    let isValid = true;

    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const valueTypeString in values) {
      const valueType = valueTypeString as ValueType;
      if (!values[valueType]) {
        setErrorMessage(valueTypeString, InputErrorMessage.MISSING_INPUT);
        setShowError(valueTypeString, true);
        isValid = false;
      }
    }

    if (!values.email.match(emailRegex)) {
      setErrorMessage('email', InputErrorMessage.INVALID_EMAIL);
      setShowError('email', true);
      isValid = false;
    }
    if (!values.password) {
      setErrorMessage('password', InputErrorMessage.MISSING_INPUT);
      setShowError('password', true);
      isValid = false;
    }

    return isValid;
  };

  const textFieldStyle = {
    background: COLORS.offWhite,
  };

  async function handleSubmit() {
    if (validateInputs()) {
      loginUser(values.email, values.password)
        .then((user) => {
          dispatchUser(
            user.email!,
            user.firstName!,
            user.lastName!,
            user.admin!,
          );
          navigate('/home');
        })
        .catch((e) => {
          setShowError('alert', true);
          setErrorMessage('alert', e.message);
        });
    }
  }

  return (
    <ScreenGrid>
      <Grid
        container
        spacing={0}
        alignItems="center"
        justifyContent="center"
        sx={{ height: '100vh' }}
      >
        <Grid item lg={6} md={6} sm={12} xs={12} sx={{ padding: 20 }}>
          <FormGrid>
            <FormCol>
              <Grid item container justifyContent="left">
                <Typography
                  variant="h1"
                  style={{
                    fontFamily: 'Druk',
                    fontSize: 64,
                    color: COLORS.darkGreen,
                    paddingBottom: 15,
                  }}
                >
                  Log in
                </Typography>
              </Grid>
              <Grid item width="1">
                <TextField
                  fullWidth
                  error={showError.email}
                  helperText={errorMessage.email}
                  type="email"
                  required
                  label="Email"
                  value={values.email}
                  onChange={(e) => setValue('email', e.target.value)}
                  style={textFieldStyle as React.CSSProperties}
                />
              </Grid>
              <Grid item width="1">
                <TextField
                  fullWidth
                  error={showError.password}
                  helperText={errorMessage.password}
                  type="password"
                  required
                  label="Password"
                  value={values.password}
                  onChange={(e) => setValue('password', e.target.value)}
                  style={textFieldStyle as React.CSSProperties}
                />
              </Grid>
              <Grid item container justifyContent="center">
                <PrimaryButton
                  fullWidth
                  type="submit"
                  variant="contained"
                  style={{
                    backgroundColor: COLORS.neonGreen,
                    color: COLORS.darkGreen,
                    borderRadius: 45,
                    fontFamily: 'Druk',
                    textTransform: 'unset',
                    fontSize: 22,
                    padding: 8,
                    fontWeight: 500,
                  }}
                  onClick={() => handleSubmit()}
                >
                  Log in
                </PrimaryButton>
              </Grid>
              <FormRow>
                <Grid item style={{ fontFamily: 'Druk', fontSize: 18 }}>
                  <Link component={RouterLink} to="/email-reset">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item style={{ fontFamily: 'Druk', fontSize: 18 }}>
                  <Link component={RouterLink} to="/register">
                    Sign Up
                  </Link>
                </Grid>
              </FormRow>
            </FormCol>
          </FormGrid>
        </Grid>
        <Grid
          item
          md={6}
          xs={12}
          sx={{
            height: '100vh',
            bgcolor: COLORS.primaryGreen,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 1,
          }}
        >
          <img
            src="https://images.squarespace-cdn.com/content/v1/5bc4fff016b6405451831f02/1542583791493-LWCZCRGAQRX0OAXNT8OD/REbiggerWHITE.png?format=1500w"
            alt="Logo"
            style={{
              width: '66%',
              height: '9%',
              top: 0,
              right: 0,
              bottom: 0,
            }}
          />
        </Grid>
      </Grid>
      {/* The alert that pops up */}
      <Grid item>
        <AlertDialog
          showAlert={showError.alert}
          title={alertTitle}
          message={errorMessage.alert}
          onClose={handleAlertClose}
        />
      </Grid>
    </ScreenGrid>
  );
}

export default LoginPage;
