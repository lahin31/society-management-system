import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';

import Footer from '../../components/footer/Footer';

const ConfirmingAccount = () => {
  const [user, setUser] = useState({});
  const [message, setMessage] = useState('');
  const [activatedMsg, setActivatedMsg] = useState('');
  const [deactivatedMsg, setDeactivatedMsg] = useState('');
  const { token } = useParams();

  useEffect(() => {
    document.title = 'Confirming Account';
    fetch(`/students/confirmation/${token}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.student) {
          setUser(res.student);
        } else if (res.message) {
          setMessage(res.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token]);

  const activateAccount = () => {
    fetch(`/students/activate-account`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.message) {
          setActivatedMsg(res.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deactivateAccount = () => {
    fetch(`/students/deactivate-account`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.message) {
          setDeactivatedMsg(res.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      {activatedMsg && (
        <Alert severity="success" className="alert_success_msg">
          {activatedMsg}
        </Alert>
      )}
      {deactivatedMsg && (
        <Alert severity="error">{deactivatedMsg}</Alert>
      )}
      {message ? (
        <Alert severity="error">{message}</Alert>
      ) : (
        <>
          <h2>Account Information</h2>
          <hr />
          <div className="user_info_wrapper">
            <p>
              <strong>Name</strong>: {user.name}
            </p>
            <p>
              <strong>Username</strong>: {user.username}
            </p>
            <p>
              <strong>Email</strong>: {user.email}
            </p>
            <p>
              <strong>Department</strong>: {user.department}
            </p>
            <p>
              <strong>ID</strong>: {user.std_id}
            </p>
            <p>
              <strong>Batch</strong>: {user.batch}
            </p>
            {!activatedMsg && !deactivatedMsg ? (
              <div className="action_brn">
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={6}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      className="aa-btn-bg-color"
                      onClick={activateAccount}
                    >
                      Activate
                    </Button>
                  </Grid>
                  <Grid item xs={6} sm={6}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      className="btn-bg-color"
                      onClick={deactivateAccount}
                    >
                      DeActivate
                    </Button>
                  </Grid>
                </Grid>
              </div>
            ) : null}
          </div>
        </>
      )}
      <Footer />
    </Container>
  );
};

export default ConfirmingAccount;
