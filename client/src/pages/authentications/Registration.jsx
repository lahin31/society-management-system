import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Alert from '@material-ui/lab/Alert';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';

import Loader from '../../components/loader/Loader';
import Footer from '../../components/footer/Footer';

import './Registration.scss';

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

const RegistrationPage = () => {
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const name = useRef();
  const username = useRef();
  const email = useRef();
  const id = useRef();
  const batch = useRef();
  const password = useRef();
  const confirm_password = useRef();
  const [dept, setDept] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    document.title = 'Registration';
  }, []);

  const handleRegistration = (e) => {
    e.preventDefault();
    setLoading(true);
    fetch('/students/student-registration', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.current.value,
        username: username.current.value,
        email: email.current.value,
        dept,
        id: id.current.value,
        batch: batch.current.value,
        password: password.current.value,
        confirm_password: confirm_password.current.value,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.message === 'User Created') {
          setMessage(
            'Your account is created successfully, please wait an admin will confirm your account.'
          );
          name.current.value = '';
          username.current.value = '';
          email.current.value = '';
          id.current.value = '';
          batch.current.value = '';
          password.current.value = '';
          confirm_password.current.value = '';
          dept.current.value = '';
        } else if (res.errors) {
          setErrors(res.errors);
        } else if(res.error) {
          setError(res.error);
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      })
  };

  const handleDeptChange = (e) => setDept(e.target.value);

  return (
    <Container
      component="main"
      maxWidth="xs"
      className="registration_wrapper"
    >
      {errors && errors.length > 0 && (
        <Alert severity="error" className="error-msg-wrap">
          <ul className="error-msg-lists">
            {errors.map((error) => {
              return (
                <li key={error} className="error-msg">
                  {error}
                </li>
              );
            })}
          </ul>
        </Alert>
      )}
      {error && error.length > 0 && (
        <Alert severity="error" className="error-msg-wrap">
          {error}
        </Alert>
      )}
      {message && (
        <Alert severity="success" className="alert_success_msg">
          {message}
        </Alert>
      )}
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar + ' btn-bg-color'}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Registration
        </Typography>
        <form className={classes.form} onSubmit={handleRegistration}>
          <div className="name_wrapper">
            <Grid container spacing={2}>
              <Grid item xs={6} sm={6}>
                <TextField
                  label="Name"
                  variant="outlined"
                  margin="normal"
                  inputRef={name}
                  required
                  autoFocus
                />
              </Grid>
              <Grid item xs={6} sm={6}>
                <TextField
                  label="Username"
                  variant="outlined"
                  margin="normal"
                  inputRef={username}
                  required
                />
              </Grid>
            </Grid>
          </div>
          <TextField
            variant="outlined"
            margin="normal"
            inputRef={email}
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
          />
          <FormControl required className="dept_wrapper">
            <InputLabel id="demo-simple-select-label">
              Department
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              className="dept_select_field"
              value={dept}
              onChange={handleDeptChange}
              required
            >
              <MenuItem value="cse">
                Computer Science and Engineering
              </MenuItem>
              <MenuItem value="eee">
                Electrical and Electronics Engineering
              </MenuItem>
              <MenuItem value="bba">Business Administration</MenuItem>
              <MenuItem value="eco">Economics</MenuItem>
              <MenuItem value="eng">English</MenuItem>
              <MenuItem value="jms">
                Journalism and Media Studies
              </MenuItem>
            </Select>
          </FormControl>
          <div className="batch_info_wrapper">
            <Grid container spacing={2}>
              <Grid item xs={6} sm={6}>
                <TextField
                  label="ID"
                  variant="outlined"
                  margin="normal"
                  inputRef={id}
                  required
                />
              </Grid>
              <Grid item xs={6} sm={6}>
                <TextField
                  label="Batch"
                  variant="outlined"
                  margin="normal"
                  inputRef={batch}
                  required
                />
              </Grid>
            </Grid>
          </div>
          <TextField
            variant="outlined"
            inputRef={password}
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
          />
          <TextField
            variant="outlined"
            inputRef={confirm_password}
            margin="normal"
            required
            fullWidth
            name="confirm_password"
            label="Confirm Password"
            type="password"
            id="confirm_password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            className={classes.submit + ' btn-bg-color'}
          >
            {loading ? <Loader width={5} height={5} /> : 'Register'}
          </Button>
          <Grid container>
            <Grid item>
              <Link to="/login" variant="body2">
                Already have an account? Login
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Footer />
    </Container>
  );
};

export default RegistrationPage;
