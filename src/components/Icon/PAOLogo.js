import { Link } from "@material-ui/core";
import SvgIcon from "@material-ui/core/SvgIcon";
import Icon from "@material-ui/core/Icon";
import { useSelector } from "react-redux";
import { THEME_MODE } from "src/configs/constance";

export function PAOIcon({ isDarkMode = true }) {
  return isDarkMode ? (
    <Icon>
      <img src="/the-pao-logo-dark.webp" width={55}></img>
    </Icon>
  ) : (
    <Icon>
      <img src="/the-pao-logo-light.webp" width={55}></img>
    </Icon>
  );
}

export function PAOLogo({ ...props }) {
  const { themeMode } = useSelector((state) => state.userConfigSlice);

  return (
    <Link href="/" {...props}>
      <PAOIcon
        isDarkMode={themeMode === THEME_MODE.DARK}
        // style={{ fontSize: isVertical ? 50 : 70, verticalAlign: "middle" }}
      />
    </Link>
  );
}
