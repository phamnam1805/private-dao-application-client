import { Box, Button, makeStyles, Paper } from "@material-ui/core";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CHAINS } from "src/configs/connection-config";
import StyledTextField from "../components/StyledTextField";
import { StepStatus, updateCreateDAOData } from "src/redux/createDAODataSlice";
import BaseStep from "../components/BaseStep";
import { uploadDAOInfo } from "../createDAO";

const useStyle = makeStyles((theme) => ({
  logoDisplay: {
    background: theme.palette.background.default,
    maxWidth: "300px",
    justifyContent: "center",
  },
}));

export default function FirstStep({ ...props }) {
  const cls = useStyle();
  const dispatch = useDispatch();
  const mounted = useRef(false);
  const DEFAULT_LOGO = "/default-logo.png";
  const { chainId } = useSelector((state) => state.configSlice);
  const { activeStep, activeStatus } = useSelector((state) => state.createDAODataSlice);
  const [daoName, setDAOName] = useState("");
  const [daoHelperText, setDAOHelperText] = useState(null);
  const [description, setDescription] = useState("");
  const [descriptionHelperText, setDescriptionHelperText] = useState(null);
  const [website, setWebsite] = useState("");
  const [tags, setTags] = useState("");
  const [logo, setLogo] = useState(null);
  const [logoUrl, setLogoUrl] = useState(DEFAULT_LOGO);

  const disableAll = !(activeStep == 0);

  useEffect(() => {
    if (mounted.current) {
      if (daoName === "") setDAOHelperText("This field is required");
      else if (daoName.length > 20) setDAOHelperText("This DAO name is too long");
      else setDAOHelperText(null);
    }
  }, [daoName]);

  useEffect(() => {
    if (mounted.current) {
      if (description === "") setDescriptionHelperText("This field is required");
      else if (description.length > 500) setDescriptionHelperText("Description is too long");
      else setDescriptionHelperText(null);
    }
    mounted.current = true;
  }, [description]);

  const confirmDisable = useMemo(() => {
    if (daoName.replaceAll(" ", "") === "") return true;
    else if (description.replaceAll(" ", "") === "") return true;
    else return false;
  }, [daoName, description]);

  async function onConfirm() {
    dispatch(
      updateCreateDAOData({
        activeStatus: StepStatus.LOADING,
      })
    );
    const dao = {
      chainId: chainId,
      name: daoName,
      logo: logo,
      description: description,
      website: website,
      tags: tags.toString(),
    };
    const { ipfsHash, descriptionHash } = await uploadDAOInfo(dao);
    dispatch(
      updateCreateDAOData({
        ipfsHash: ipfsHash,
        descriptionHash: descriptionHash,
        activeStep: 1,
        activeStatus: StepStatus.INIT,
        selectedStep: 1,
      })
    );
  }

  return (
    <BaseStep
      {...props}
      style={{ padding: 0 }}
      butProps={{
        disabled: confirmDisable || !(activeStep == 0 && activeStatus === StepStatus.INIT),
        onClick: () => onConfirm(),
      }}
      boxButProps={{ mx: 2, pb: 2 }}
    >
      <Box display="flex" justifyContent="center" flexDirection="column" padding="1.5rem">
        <Box mb={2}>
          <StyledTextField
            textProps={{
              disabled: disableAll,
              label: "DAO Name",
              fullWidth: true,
              value: daoName,
              onChange: (e) => setDAOName(e.target.value),
              error: daoHelperText,
              helperText: daoHelperText,
            }}
          />
        </Box>
        <Box mb={2}>
          <StyledTextField
            textProps={{
              disabled: disableAll,
              label: "Description",
              fullWidth: true,
              value: description,
              onChange: (e) => setDescription(e.target.value),
              error: descriptionHelperText,
              helperText: descriptionHelperText,
              multiline: true,
            }}
          />
        </Box>
        <Box mb={2}>
          <StyledTextField
            textProps={{
              disabled: disableAll,
              label: "Website",
              fullWidth: true,
              value: website,
              onChange: (e) => setWebsite(e.target.value.replaceAll(" ", "")),
            }}
          />
        </Box>
        <Box mb={2}>
          <StyledTextField
            textProps={{
              disabled: disableAll,
              label: "Tags",
              fullWidth: true,
              value: tags.toString(),
              onChange: (e) => setTags(e.target.value.replaceAll(" ", "").split(",")),
            }}
          />
        </Box>
        <Box mb={2}>
          <StyledTextField
            textProps={{
              label: "Network",
              fullWidth: true,
              value: CHAINS?.[chainId]?.name,
              inputProps: { readOnly: true },
            }}
          />
        </Box>
        <Box mb={2} display={"flex"} alignItems={"start"}>
          <Box mr={2}>
            <Paper className={cls.logoDisplay}>{logoUrl && <img width={"100%"} src={logoUrl} />}</Paper>
          </Box>
          <Box>
            <input
              style={{ display: "none" }}
              id="uploadLogo"
              type="file"
              accept="image/*"
              onChange={(event) => {
                if (event.target.files && event.target.files[0]) {
                  setLogo(event.target.files[0]);
                  setLogoUrl(URL.createObjectURL(event.target.files[0]));
                } else {
                  setLogo(null);
                  setLogoUrl(DEFAULT_LOGO);
                }
              }}
            />
            <label htmlFor="uploadLogo">
              <Button component="span" variant="outlined">
                Upload File
              </Button>
            </label>
          </Box>
        </Box>
      </Box>
      {/* <ConfirmDialog {...{ open, setOpen, daoName, description, website, tags, logo }} /> */}
    </BaseStep>
  );
}
