import { IconButton } from "@material-ui/core";
import SvgIcon from "@material-ui/core/SvgIcon";
import { useDispatch, useSelector } from "react-redux";
import { THEME_MODE } from "src/configs/constance";
import { toggleMode } from "src/redux/userConfigSlice";

export const SunIcon = ({ ...props }) => (
  <SvgIcon {...props} viewBox="0 0 32 32">
    <rect width="32" height="32" fill="none" />
    <path
      d="M19.493,11.3a7.555,7.555,0,1,0,7.555,7.555A7.564,7.564,0,0,0,19.493,11.3Zm0,12.951a5.4,5.4,0,1,1,5.4-5.4A5.4,5.4,0,0,1,19.493,24.247Zm0-15.11a1.08,1.08,0,0,0,1.079-1.079V5.9a1.079,1.079,0,1,0-2.159,0V8.058A1.08,1.08,0,0,0,19.493,9.137Zm0,19.427a1.08,1.08,0,0,0-1.079,1.079V31.8a1.079,1.079,0,0,0,2.159,0V29.643A1.08,1.08,0,0,0,19.493,28.564Zm8.394-16.582,1.526-1.526a1.079,1.079,0,0,0-1.526-1.526l-1.526,1.526a1.079,1.079,0,1,0,1.526,1.526ZM11.1,25.719,9.573,27.246A1.079,1.079,0,1,0,11.1,28.772l1.526-1.526A1.079,1.079,0,0,0,11.1,25.719ZM9.78,18.85A1.08,1.08,0,0,0,8.7,17.771H6.542a1.079,1.079,0,1,0,0,2.159H8.7A1.08,1.08,0,0,0,9.78,18.85Zm22.664-1.079H30.286a1.079,1.079,0,0,0,0,2.159h2.159a1.079,1.079,0,0,0,0-2.159ZM11.1,11.981a1.079,1.079,0,1,0,1.526-1.526L11.1,8.929a1.079,1.079,0,1,0-1.526,1.526Zm16.79,13.737a1.079,1.079,0,0,0-1.526,1.526l1.526,1.526a1.079,1.079,0,1,0,1.526-1.526Z"
      transform="translate(-3.492 -2.85)"
      fill="#C19679"
    />
  </SvgIcon>
);

export const MoonIcon = ({ ...props }) => (
  <SvgIcon {...props} viewBox="0 0 32 32">
    <rect width="32" height="32" fill="none" />
    <path
      d="M16.661,29.4c-.133,0-.267,0-.4-.006a12.848,12.848,0,0,1-.788-25.635,1.09,1.09,0,0,1,.977,1.733A8.055,8.055,0,0,0,27.715,16.753a1.09,1.09,0,0,1,1.733.977A12.848,12.848,0,0,1,16.661,29.4ZM13.468,6.367a10.668,10.668,0,0,0,2.859,20.844c.111,0,.223.005.333.005a10.672,10.672,0,0,0,10.175-7.477A10.237,10.237,0,0,1,13.468,6.367Z"
      transform="translate(-0.809 -0.75)"
      fill="#554035"
    />
  </SvgIcon>
);

export default function ThemeButton() {
  const { themeMode } = useSelector((state) => state.userConfigSlice);
  const dispatch = useDispatch();

  return (
    <IconButton size="small" onClick={() => dispatch(toggleMode())}>
      {themeMode === THEME_MODE.DARK ? <SunIcon /> : <MoonIcon />}
    </IconButton>
  );
}
