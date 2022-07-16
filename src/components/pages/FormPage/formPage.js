import React, { useState, useContext, useEffect } from "react";
import {
  Card,
  CardContent,
  Button,
  Stepper,
  StepLabel,
  Step,
  Stack,
  Modal,
  Typography,
  Box,
} from "@mui/material";
import "./formPage.css";
import { FormContent } from "./formContent";
import { ReactComponent as MetaMask } from "../../../assets/Metamask.svg";
import TwitterIcon from "@mui/icons-material/Twitter";
import { Link } from "react-router-dom";
import { BaseContext } from "../../../BaseContextProvider";
import InputEmail from "./InputEmail";

export const FormPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [open, setOpen] = React.useState(false);
  const [butttonState, setButtonState] = useState(true);
  const [errorMsg, setErrorMsg] = useState("Something went wrong...");
  const [metaAddress, setMetaAddress] = useState("");
  const [email, setEmail] = useState("");
  const [twitter, setTwitter] = useState("");
  const [isValidEmail, setValidEmail] = useState(false);

  const firebase = useContext(BaseContext);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "#302f2f",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  useEffect(() => {
    if (isValidEmail) {
      setButtonState(false);
    } else setButtonState(true);
  }, [isValidEmail]);

  const handleClose = () => setOpen(false);
  function throwError() {
    setOpen(true);
  }

  const metaConnect = () => {
    setButtonState(false);
    // if (window.ethereum && window.ethereum.isMetaMask) {
    //   window.ethereum
    //     .request({ method: "eth_requestAccounts" })
    //     .then((result) => {
    //       setMetaAddress(result.at(0));
    //       setButtonState(false);
    //     })
    //     .catch(() => {
    //       throwError();
    //     });
    // } else {
    //   setErrorMsg("Install MetaMask");
    //   throwError();
    // }
  };

  function signInTwitter() {
    setButtonState(false);
    const twitterUser = firebase.signUserIn();
    setTwitter(twitterUser);
  }

  const handleEmailChange = (value, isValid) => {
    setEmail(value);
    setValidEmail(isValid);
    // firebase.saveDataIn(twitter, metaAddress, email);
  };

  function renderContent() {
    switch (activeStep) {
      case 0:
        return (
          <FormContent>
            <Button
              variant="outlined"
              sx={{
                textTransform: "unset",
                color: "black",
                backgroundColor: "white",
              }}
              onClick={metaConnect}
            >
              <div className="flexCont">
                Connect Wallet
                <MetaMask className="metaIcon" />
              </div>
            </Button>
          </FormContent>
        );
      case 1:
        return (
          <FormContent>
            <Button
              variant="outlined"
              sx={{
                textTransform: "unset",
                color: "black",
                backgroundColor: "white",
              }}
              onClick={signInTwitter}
            >
              <div className="flexCont">
                Connect Twitter
                <TwitterIcon className="twitterIcon" />
              </div>
            </Button>
          </FormContent>
        );
      case 2:
        return (
          <FormContent>
            <InputEmail handleChange={handleEmailChange} />
          </FormContent>
        );
      case 3:
        return (
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Response recorded !!
          </Typography>
        );
      default:
        return <></>;
    }
  }

  const nextStep = () => {
    if (activeStep === 2) {
      console.log("You are inside this step");
      firebase.saveDataIn(twitter, metaAddress, email);
      return;
    }
    setActiveStep(activeStep + 1);
    setButtonState(true);
  };

  return (
    <div className="container">
      <Link to="/">
        <span className="testersTitle"> web3testers </span>
      </Link>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            sx={{ color: "white" }}
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            {errorMsg}
          </Typography>
        </Box>
      </Modal>
      <div className="waitlistContainer">
        <Card
          sx={{ backgroundColor: "rgba(0, 145, 255, 0.11)" }}
          className="card"
          variant="outlined"
        >
          <CardContent sx={{ height: "100%" }}>
            <Stack sx={{ justifyContent: "space-between", height: "100%" }}>
              <Stepper activeStep={activeStep}>
                <Step>
                  <StepLabel>
                    <span className="stepLabel">Step 1</span>
                  </StepLabel>
                </Step>
                <Step>
                  <StepLabel className="stepLabel">
                    <span className="stepLabel">Step 2</span>
                  </StepLabel>
                </Step>
                <Step>
                  <StepLabel className="stepLabel">
                    <span className="stepLabel">Step 3</span>
                  </StepLabel>
                </Step>
              </Stepper>
              {renderContent()}
              <div className="formContent">
                <Button
                  variant="contained"
                  sx={{ width: "30%" }}
                  className="emailBox"
                  onClick={nextStep}
                  disabled={butttonState}
                >
                  Next
                </Button>
              </div>
            </Stack>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
