import React from 'react';
import Button from '@material-ui/core/Button';

const SocietyUpdate = ({
  message,
  societies,
  handleSelectSociety,
  procceedSelectedSociety,
}) => {
  return (
    <div className="home">
      <div className="registered_societies_info">
        <>
          <div className="message">
            <h1>{message}</h1>
          </div>
          <div className="societies">
            {societies.map((society, index) => {
              return (
                <div
                  key={society._id}
                  className={
                    society.select
                      ? 'society selected'
                      : 'society not_selected'
                  }
                  onClick={() => handleSelectSociety(index)}
                >
                  {society.name}
                </div>
              );
            })}
          </div>
          <div className="society_action_btn">
            <Button
              variant="contained"
              color="primary"
              onClick={procceedSelectedSociety}
            >
              Procceed
            </Button>
          </div>
        </>
      </div>
    </div>
  );
};

export default SocietyUpdate;
