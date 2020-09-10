import React, {
  useState,
  useEffect,
  useContext,
  useRef,
} from 'react';
import { Link, withRouter } from 'react-router-dom';
import Alert from '@material-ui/lab/Alert';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import AuthContext from '../../contexts/auth-context';
import Loader from '../../components/loader/Loader';
import Footer from '../../components/footer/Footer';

import './Login.scss';

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

const Login = (props) => {
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrorMsg] = useState('');
  const classes = useStyles();
  const email = useRef();
  const password = useRef();
  const context = useContext(AuthContext);

  useEffect(() => {
    document.title = 'Login';
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    fetch('/students/student-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.current.value,
        password: password.current.value,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setLoading(false);
        if (!res.error) {
          context.login(
            res.accessToken,
            res.refreshToken,
            res.userId,
            res.expiresIn
          );
          localStorage.setItem(
            'accessToken',
            JSON.stringify(res.accessToken)
          );
          localStorage.setItem(
            'refreshToken',
            JSON.stringify(res.refreshToken)
          );
          localStorage.setItem('userId', JSON.stringify(res.userId));
          localStorage.setItem(
            'tokenExpiration',
            JSON.stringify(res.expiresIn)
          );
          props.history.push('/');
        } else {
          setErrorMsg(res.error);
        }
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      className="login_wrapper"
    >
      {errMsg && (
        <Alert severity="error" className="error-msg">
          {errMsg}
        </Alert>
      )}
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar + ' btn-bg-color'}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" data-testid="login-title">
          Login
        </Typography>
        <form className={classes.form} onSubmit={handleLogin}>
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
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            className={classes.submit + ' btn-bg-color'}
          >
            {loading ? <Loader width={5} height={5} /> : 'Login'}
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to="/forget-password">Forgot password?</Link>
            </Grid>
            <Grid item>
              <Link to="/registration">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Footer />
    </Container>
  );
};

export default withRouter(Login);
