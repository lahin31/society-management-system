import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import SettingsInputAntennaIcon from '@material-ui/icons/SettingsInputAntenna';
import DeviceUnknownIcon from '@material-ui/icons/DeviceUnknown';
import HearingIcon from '@material-ui/icons/Hearing';

import Footer from '../components/footer/Footer';

import './index.scss';

const IndexPage = () => {
  useEffect(() => {
    document.title = 'Society Management System';
  }, []);
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        className="index_page_svg"
      >
        <path
          fill="#EAF4E9"
          fillOpacity="1"
          d="M0,32L24,53.3C48,75,96,117,144,144C192,171,240,181,288,176C336,171,384,149,432,138.7C480,128,528,128,576,149.3C624,171,672,213,720,202.7C768,192,816,128,864,112C912,96,960,128,1008,165.3C1056,203,1104,245,1152,229.3C1200,213,1248,139,1296,112C1344,85,1392,107,1416,117.3L1440,128L1440,320L1416,320C1392,320,1344,320,1296,320C1248,320,1200,320,1152,320C1104,320,1056,320,1008,320C960,320,912,320,864,320C816,320,768,320,720,320C672,320,624,320,576,320C528,320,480,320,432,320C384,320,336,320,288,320C240,320,192,320,144,320C96,320,48,320,24,320L0,320Z"
        ></path>
      </svg>
      <div className="cm_wrapper">
        <div className="body_text">
          <h1 className="body_text_title">
            Society Management System
          </h1>
          <p>We help you to engage with your societies</p>
          <div className="action_btn text-align-center">
            <Link to="/login">
              <Button
                variant="contained"
                color="secondary"
                className="nav_btn"
              >
                Join Today <ArrowForwardIcon />
              </Button>
            </Link>
          </div>
        </div>
        <div className="body_logo_img">
          <img
            src={require('../assets/images/bodylogo.png')}
            id="body_logo_img"
            alt="body_logo"
          />
        </div>
      </div>
      <div className="info">
        <div className="row">
          <div className="column">
            <SettingsInputAntennaIcon />
            <h2>Connect</h2>
            <p>
              Lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet
              Lorem ipsum dolor sit amet{' '}
            </p>
          </div>
          <div className="column">
            <DeviceUnknownIcon />
            <h2>Engage</h2>
            <p>
              Lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet
              Lorem ipsum dolor sit amet{' '}
            </p>
          </div>
          <div className="column">
            <HearingIcon />
            <h2>Know</h2>
            <p>
              Lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet
              Lorem ipsum dolor sit amet{' '}
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default IndexPage;
