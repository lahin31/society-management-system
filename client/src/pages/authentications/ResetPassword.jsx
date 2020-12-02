import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Loader from '../../components/loader/Loader';

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

const ResetPassword = () => {
  const password = useRef();
  const confirmPassword = useRef();
  const [studentId, setStudentId] = useState('');
  const [errMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const { token } = useParams();

  useEffect(() => {
    fetch(`/students/check-reset-token/${token}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.err) {
          setErrorMsg('Sorry your request is not correct');
        } else {
          setStudentId(res.studentId);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token]);

  const submitPassword = (e) => {
    e.preventDefault();
    setLoading(true);
    if (password.current.value !== confirmPassword.current.value) {
      setErrorMsg(
        'Both password and confirm password should be matched'
      );
      return;
    }
    fetch('/students/reset/student-reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        password: password.current.value,
        studentId,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setLoading(false);
        if (res.message === 'password updated') {
          setSuccessMsg('Password updated successfully');
          password.current.value = '';
          confirmPassword.current.value = '';
        }
      })
      .catch((err) => {
        setLoading(false);
        setErrorMsg('Sorry your request is not correct');
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        {errMsg && (
          <div className="error_msg_wrap">
            <Alert severity="error">{errMsg}</Alert>
          </div>
        )}
        {successMsg && (
          <div className="success_msg_wrap">
            <Alert severity="success">{successMsg}</Alert>
          </div>
        )}
        <Typography component="h1" variant="h5">
          Reset Password
        </Typography>
        <form className={classes.form} onSubmit={submitPassword}>
          <TextField
            variant="outlined"
            margin="normal"
            type="password"
            inputRef={password}
            required
            fullWidth
            id="password"
            label="Password"
            name="password"
            autoComplete="password"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            type="password"
            inputRef={confirmPassword}
            required
            fullWidth
            id="confirmPassword"
            label="Confirm Password"
            name="confirmPassword"
            autoComplete="confirmPassword"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            className={classes.submit}
          >
            {loading ? (
              <Loader width={5} height={5} />
            ) : (
              'Update Password'
            )}
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default ResetPassword;
