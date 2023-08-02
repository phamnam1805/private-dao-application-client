import { Box, Drawer, List, ListItem, makeStyles, Typography } from "@material-ui/core";
import { PAOLogo } from "src/components/Icon/PAOLogo";
import { LayoutConfig, THEME_MODE } from "src/configs/constance";
// import EcosystemList from "../EcosystemList";
import { DesktopList, FlexibleLinkItem } from "../FlexibleLink";
import ThemeButton from "src/components/Button/ThemeButton";

const useStyle = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.type === THEME_MODE.DARK ? "#331E0B" : "#FFFFFF",
    padding: 0,
    zIndex: 10001,
  },
  boxRoot: {
    position: "fixed",
    left: 0,
    top: 0,
    bottom: 0,
    width: "260px",
    transform: "translateX(-100%)",
    zIndex: 10000,
    transitionDuration: "0.5s",
    backgroundColor: theme.palette.type === THEME_MODE.DARK ? "#331E0B" : "#FFFFFF",
    borderRight: `1px solid ${theme.palette.type === THEME_MODE.DARK ? "#583B20" : "#E3DED9"}`,
    borderTopRightRadius: "5px",
    borderBottomRightRadius: "5px",
  },
  listItem: {
    cursor: "pointer",
    textDecoration: "none",
    padding: 0,
  },
}));

export default function Sidebar() {
  const cls = useStyle();

  function onMouseEnter(index) {
    const subTab = document.getElementById(`subTab_${index}`);
    if (subTab) subTab.style.transform = "translateX(38%)";
  }

  function onMouseLeave(index) {
    const subTab = document.getElementById(`subTab_${index}`);
    if (subTab) subTab.style.transform = "translateX(-100%)";
  }

  function onClick(index) {
    const subTab = document.getElementById(`subTab_${index}`);
    if (subTab) subTab.style.transform = "translateX(38%)";
  }

  function Layout() {
    return (
      <Box
        height="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="space-between"
        style={{ width: "100px", paddingTop: "2rem", paddingBottom: "2rem" }}
      >
        <Box display="flex" flexDirection="column" alignItems="center" width="100%">
          <PAOLogo />
          <List style={{ padding: 0, width: "100%" }}>
            {LayoutConfig.map((element, index) => {
              return (
                <ListItem
                  key={index}
                  className={cls.listItem}
                  onMouseEnter={() => onMouseEnter(index)}
                  onMouseLeave={() => onMouseLeave(index)}
                  onClick={() => onClick(index)}
                >
                  <DesktopList element={element} />
                </ListItem>
              );
            })}
          </List>
        </Box>
        {/* <EcosystemList display="flex" flexDirection="column" alignItems="center" width="100%" /> */}
        <ThemeButton />
      </Box>
    );
  }

  return (
    <>
      <Drawer anchor="left" PaperProps={{ className: cls.root }} variant="permanent">
        <Layout />
      </Drawer>
      {LayoutConfig.map((element, index) => {
        if (element.subTab.length > 0)
          return (
            <Box
              key={index}
              id={`subTab_${index}`}
              className={cls.boxRoot}
              onMouseEnter={() => onMouseEnter(index)}
              onMouseLeave={() => onMouseLeave(index)}
              onClick={() => onClick(index)}
            >
              <Box m="1rem 1rem 0rem">
                <Typography variant="subtitle2">{element?.subTitle}</Typography>
              </Box>
              <List>
                {element.subTab.map((subItem, index1) => (
                  <ListItem key={index1} style={{ padding: "4px 16px" }}>
                    <FlexibleLinkItem
                      type={subItem.type}
                      to={subItem.to}
                      isActive={subItem?.isActive}
                      label={subItem.label}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          );
        else return <></>;
      })}
    </>
  );
}
