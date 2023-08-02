import { makeStyles, Paper, useMediaQuery } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import CssScrollGroupButton from "src/components/Button/CssScrollGroupButton";
import { THEME_MODE } from "src/configs/constance";
import useLowerAddressParam from "src/hook/useLowerAddressParam";

const useStyle = makeStyles((theme) => ({
  root: {
    top: 0,
    zIndex: 1000000,
    padding: 0,
    marginBottom: "24px",
    width: "100%",
    position: "sticky",
    borderRadius: "10px",
    [theme.breakpoints.down("sm")]: {
      top: "65px",
    },
  },
  rootBut: {
    border: "none",
  },
  but: {
    height: 50,
    backgroundColor: `${theme.palette.type === THEME_MODE.DARK ? "#331E0B" : "#FFF2EA"} !important`,
  },
  activeBut: {
    backgroundColor: `${theme.palette.type === THEME_MODE.DARK ? "#76350A" : "#FFD8C9"} !important`,
    color: theme.palette.type === THEME_MODE.DARK ? "#C9E8FF" : "#151C22",
  },
}));

export default function GroupTabButton({ daoAddress, ...props }) {
  const cls = useStyle();
  const { daoAddress: _daoAddress } = useLowerAddressParam();
  const history = useHistory();
  const smOnly = useMediaQuery((theme) => theme.breakpoints.only("sm"));
  const xsOnly = useMediaQuery((theme) => theme.breakpoints.only("xs"));

  const config = [
    { label: "Basic Information", link: "/daos" },
    { label: "Proposals", link: "/proposals" },
  ];

  function onClick(element, _) {
    history.push(`${element.link}/${_daoAddress || daoAddress}`);
  }

  return (
    <Paper className={cls.root}>
      <CssScrollGroupButton
        size={smOnly ? 33.333333 : 50}
        isScroll={smOnly || xsOnly}
        className={cls.rootBut}
        fullWidth
        config={config}
        events={{ onClick: onClick }}
        but={{ className: cls.but }}
        activeBut={{ className: cls.activeBut }}
        {...props}
      />
    </Paper>
  );
}
