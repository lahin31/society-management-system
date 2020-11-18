import React, {
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';
import { withRouter } from 'react-router-dom';
import Alert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/core/styles';
import AuthContext from '../../contexts/auth-context';
import Loader from '../../components/loader/Loader';
import Footer from '../../components/footer/Footer';
import './EditProfile.scss';

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

const EditProfile = ({ history }) => {
  const [user, setUser] = useState({});
  const [name, setName] = useState('');
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [std_id, setStdID] = useState('');
  const [batch, setBatch] = useState('');
  const [dept, setDept] = useState('');
  const [file, setFile] = useState('');
  const [fileB64, setFileB64] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const inputOpenFileRef = useRef();
  const context = useContext(AuthContext);
  const classes = useStyles();

  useEffect(() => {
    fetch('/students/fetch-authenticate-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: context.userId,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.student) {
          setUser(res.student);
          document.title = `${res.student.name} - Edit`;
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      })
  }, [context]);

  useEffect(() => {
    if (Object.keys(user).length) {
      setName(user.name);
      setUserName(user.username);
      setEmail(user.email);
      setStdID(user.std_id);
      setBatch(user.batch);
      setDept(user.department);
      if (user.profile_picture) {
        setFile(user.profile_picture);
      }
    }
  }, [user]);

  const handleDeptChange = (e) => {
    setDept(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setFileB64(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const showOpenFileDlg = () => {
    inputOpenFileRef.current.click();
  };

  const handleUpdateInfo = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('username', username);
    formData.append('email', email);
    formData.append('std_id', std_id);
    formData.append('batch', batch);
    formData.append('department', dept);
    if (oldPassword && newPassword) {
      formData.append('oldPassword', oldPassword);
      formData.append('newPassword', newPassword);
    }
    formData.append('userId', context.userId);

    fetch('/students/update-student-info', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + context.token,
      },
      body: formData
    })
      .then(res => res.json())
      .then(res => {
        if (res?.message) {
          history.push('/profile/' + user.username);
        } else if(res.error) {
          setErrorMsg(res.error)
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div
        className="edit_profile_wrapper"
        style={{
          justifyContent: loading ? 'center' : 'stretch',
        }}
      >
        {loading &&
        Object.keys(user).length === 0 &&
        user.constructor === Object ? (
          <div className="loader_wrap">
            <Loader width={120} height={120} />
          </div>
        ) : (
          <div className="user_info">
            { errorMsg && <Alert severity="error" className="error-msg-wrap">
              {errorMsg}
            </Alert>}
            <form
              className={classes.form}
              id="edit_form"
              onSubmit={handleUpdateInfo}
              encType="multipart/form-data"
            >
              <div className="left_side_fields_wrap">
                <TextField
                  variant="outlined"
                  margin="normal"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  name="name"
                  autoFocus
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  value={std_id}
                  onChange={(e) => setStdID(e.target.value)}
                  required
                  fullWidth
                  id="id"
                  label="ID"
                  name="id"
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  required
                  fullWidth
                  id="batch"
                  label="Batch"
                  name="batch"
                />
              </div>
              <div className="right_side_form_wrap">
                <div className="dept_wrapper">
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
                    <MenuItem value="bba">
                      Business Administration
                    </MenuItem>
                    <MenuItem value="eco">Economics</MenuItem>
                    <MenuItem value="eng">English</MenuItem>
                    <MenuItem value="jms">
                      Journalism and Media Studies
                    </MenuItem>
                  </Select>
                </div>
                <div className="profile_pic_wrapper">
                  <div className="user_image_wrap">
                    {fileB64 && <img src={fileB64} alt="user avatar" />}

                    {!fileB64 && file && (
                      <img
                        src={
                          process.env.PUBLIC_URL + '/uploads/' + file
                        }
                        alt="user avatar"
                      />
                    )}
                    {!file && !fileB64 && (
                      <img
                        src={require('../../assets/images/default_img.png')}
                        alt="user avatar"
                      />
                    )}
                  </div>
                  <div className="upload_image_wrap">
                    <div
                      className="uploader"
                      style={{ height: '80px' }}
                    >
                      <input
                        type="file"
                        style={{ display: 'none' }}
                        accept="image/png, image/jpg, image/jpeg"
                        ref={inputOpenFileRef}
                        onChange={handleFileChange}
                      />
                      <div
                        className="uploader-text"
                        onClick={showOpenFileDlg}
                      >
                        Select a recognizable photo
                      </div>
                    </div>
                  </div>
                </div>
                <div className="password_wrap">
                  <TextField
                    variant="outlined"
                    margin="normal"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    fullWidth
                    type="password"
                    id="oldPassword"
                    label="Old Password"
                    name="oldPassword"
                  />
                </div>
                <div className="password_wrap">
                  <TextField
                    variant="outlined"
                    margin="normal"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    fullWidth
                    type="password"
                    id="newPassword"
                    label="New Password"
                    name="newPassword"
                  />
                </div>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="secondary"
                  className={classes.submit + ' btn-bg-color'}
                >
                  Update
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default withRouter(EditProfile);
