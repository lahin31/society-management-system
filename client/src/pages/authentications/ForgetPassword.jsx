import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import Loader from '../../components/loader/Loader';
import Footer from '../../components/footer/Footer';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const ForgetPassword = (props) => {
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const email = useRef();

  useEffect(() => {
    document.title = 'Forget Password';
  }, []);

  const handleForgetPassword = (e) => {
    e.preventDefault();
    setLoading(true);
    fetch('/students/student-forget-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.current.value,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error === 'Please provide an email') {
          setErrorMsg('Please provide an email');
        } else if (res.error === "Email doesn't exist") {
          setErrorMsg("Sorry, Email doesn't exist");
        } else if (res.message === 'recovery email sent') {
          setSuccessMsg(
            'Recovery email sent, please check your email'
          );
          email.current.value = '';
        }
      })
      .catch((err) => {
        setErrorMsg('Something went wrong');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        {errorMsg && (
          <div className="error_msg_wrap">
            <Alert severity="error">{errorMsg}</Alert>
          </div>
        )}
        {successMsg && (
          <div className="success_msg_wrap">
            <Alert severity="success">{successMsg}</Alert>
          </div>
        )}
        <Typography component="h1" variant="h5">
          Forget Password
        </Typography>
        <form
          className={classes.form}
          onSubmit={handleForgetPassword}
        >
          <TextField
            variant="outlined"
            margin="normal"
            inputRef={email}
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            className={classes.submit + ' submit_btn'}
          >
            {loading ? (
              <Loader width={5} height={5} />
            ) : (
              'Send Password Reset Email'
            )}
          </Button>
        </form>
        <Link to="/login">Back to Login</Link>
      </div>
      <Footer />
    </Container>
  );
};

export default ForgetPassword;
