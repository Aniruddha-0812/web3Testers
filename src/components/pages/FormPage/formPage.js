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
import { ReactComponent as Web } from "../../../assets/Web.svg";
import { ReactComponent as MetaMask } from "../../../assets/Metamask.svg";
import TwitterIcon from "@mui/icons-material/Twitter";
import DoneOutlined from "@mui/icons-material/DoneOutlined";
import { Link } from "react-router-dom";
import { BaseContext } from "../../../BaseContextProvider";
import InputEmail from "./InputEmail";

export const FormPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [open, setOpen] = React.useState(false);
  const [butttonState, setButtonState] = useState(true);
  const [errorMsg, setErrorMsg] = useState("Something went wrong...");
  const [metaAddress, setMetaAddress] = useState(null);
  const [email, setEmail] = useState(null);
  const [twitter, setTwitter] = useState(false);
  const [isValidEmail, setValidEmail] = useState(false);

  const content = `I joined @web3testers waitlist. 🥳 Excited to start my passive income journey by testing the web3 products.

  Join here: https://web3tester.xyz`;
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
    if (window.ethereum && window.ethereum.isMetaMask) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          setMetaAddress(result[0]);
          setButtonState(false);
          // alert("MetaMask Connect Successful");
        })
        .catch((err) => {
          alert(err);
        });
    } else {
      setErrorMsg("Install MetaMask");
      throwError();
    }
  };

  const twitterCallback = () => {
    setTwitter(true);
    setButtonState(false);
  };

  function signInTwitter() {
    firebase.signUserIn(twitterCallback);
  }

  const handleEmailChange = (value, isValid) => {
    setEmail(value);
    setValidEmail(isValid);
  };

  function renderConnected(iconImg) {
    return (
      <Button
        variant="outlined"
        startIcon={iconImg}
        sx={{
          textTransform: "unset",
          color: "black",
          backgroundColor: "#d9e3d5",
          borderRadius: "10px",
          fontColor: "black",
          border: "1px solid #61914e",
        }}
        disabled
      >
        <div className="flexCont">
          Connected
          <DoneOutlined className="metaIcon" />
        </div>
      </Button>
    );
  }

  function getButton(){
    switch (activeStep) {
      case 1:
        return (
          <Button
            variant="contained"
            sx={{ width: "30%" }}
            className="emailBox"
            onClick={nextStep}
            disabled={!isValidEmail}
          >
            Next
          </Button>);
      case 2:
        return tweetButton();
      case 3:
        return '';
      default:
        return (
          <Button
            variant="contained"
            sx={{ width: "30%" }}
            className="emailBox"
            onClick={nextStep}
            disabled={butttonState}
          >
            Next
          </Button>);
    }
  }

  function renderContent() {
    switch (activeStep) {
      case 0:
        return (
          <FormContent>
            {metaAddress ? (
              renderConnected(<MetaMask className="metaIcon" />)
            ) : (
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
            )}
          </FormContent>
        );
      case 1:
        return (
          <FormContent>
            <InputEmail handleChange={handleEmailChange} />
            <br></br>
            <br></br>
            <Typography fontSize={16}>
              Please check your email for private discord invite
            </Typography>
          </FormContent>
        );
      case 2:
        return (
          <FormContent>
            {twitter ? (
              renderConnected(<TwitterIcon className="twitterIcon" />)
            ) : (
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
            )}
          </FormContent>
        );
      case 3:
        return (
          <FormContent>
            <Typography variant="h6" component="h6">
              Hurray!!! Waitlist joined successfully🎉🎉
            </Typography>
          </FormContent>
        );

      default:
        return <></>;
    }
  }

  const nextStep = () => {
    if (activeStep === 2) {
      firebase.saveDataIn(metaAddress, email);
      setTimeout(function() {
        window.location = "/";
      }, 5000);
    }
    if (activeStep === 3) {
      return;
    }
    setActiveStep(activeStep + 1);
    setButtonState(true);
  };

  function tweetButton() {
    return (
      <Button
        variant="contained"
        sx={{ width: "45%" }}
        className="emailBox"
        onClick={nextStep}
        href={`https://twitter.com/intent/tweet?text=${content}`}
        target="_blank"
        rel="noopener noreferrer"
        disabled={butttonState}
      >
        <TwitterIcon className="twitterIcon" />
        &nbsp;&nbsp; Let's Tweet
      </Button>
    );
  }
  return (
    <div className="container">
      <Link to="/">
        <Web className="logoIcon" />
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
                {getButton()}
              </div>
            </Stack>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
