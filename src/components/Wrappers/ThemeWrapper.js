import { alpha, createTheme, CssBaseline, responsiveFontSizes, ThemeProvider } from "@material-ui/core";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { THEME_MODE } from "src/configs/constance";
import { mergeDeep } from "src/services/utility";

function switchTheme(theme, darkMode, lightMode) {
  if (theme == THEME_MODE.DARK) return darkMode;
  else return lightMode;
}

const round = (value) => Math.round(value * 1e5) / 1e5;
const pxToRem = (size) => `${size / 16}rem`;
const buildVariant = (fontWeight, size, lineHeight, letterSpacing) => ({
  fontWeight,
  fontSize: pxToRem(size),
  lineHeight: `${round(lineHeight / size)}`,
  ...(letterSpacing !== undefined ? { letterSpacing: `${round(letterSpacing / size)}em` } : {}),
});

export default function ThemeWrapper({ children }) {
  const { themeMode } = useSelector((state) => state.userConfigSlice);

  const theme = useMemo(() => {
    return createTheme({
      palette: {
        type: themeMode,
        primary: {
          main: "#D97719", // updated
        },
        secondary: {
          main: "#FAD3B6", // updated
        },
        text: {
          primary: switchTheme(themeMode, "#ECE2D7", "#231613"), // updated
          secondary: switchTheme(themeMode, "#C19E79", "#746256"), // updated
          hint: switchTheme(themeMode, "#FFFFFF", "#231613"), // updated
          disabled: switchTheme(themeMode, "#ECE2D7", "#746256"), // updated
        },
        background: {
          paper: switchTheme(themeMode, "#391902", "#FFFFFF"), // updated
          default: switchTheme(themeMode, "#271203", "#FCF3EB"), // updated
          header: switchTheme(themeMode, "#4D2900", "#F4EDE6"), // updated
          blue: switchTheme(themeMode, "#153150", "#DBE8FD"),
          violet: switchTheme(themeMode, "#222842", "#EDE8FD"),
          collapse: switchTheme(themeMode, "#1C1207", "#F5F7F2"), // updated
          input: switchTheme(themeMode, "#233345", "#EFF2F8"),
          sidebar: switchTheme(themeMode, "#763E0A", "#FFE7C9"), // updated
        },
        info: {
          main: "#1C8CF3",
          light: "#25A0E226",
        },
        success: {
          main: "#03BD9D",
          light: "#00BD9026",
        },
        warning: {
          main: "#FFBC0A",
          light: "#FFBC0A26",
        },
        error: {
          main: "#F06542",
          light: "#F0654226",
        },
      },
      typography: {
        h1: buildVariant(700, 30, 35.16),
        h2: buildVariant(500, 30, 35.16),
        h3: buildVariant(700, 20, 23.44, 0.25),
        h4: buildVariant(500, 20, 23.44, 0.15),
        h5: buildVariant(500, 18, 20, 0.15),
        h6: buildVariant(400, 18, 20),
        body1: buildVariant(400, 16, 18.75, 0.15),
        body2: buildVariant(300, 16, 18.75, 0.15),
        subtitle1: buildVariant(700, 16, 18.75, 0.15),
        subtitle2: buildVariant(500, 16, 18.75, 0.15),
        button: {
          ...buildVariant(500, 14, 24, 0.15),
          textTransform: "none",
        },
      },
    });
  }, [themeMode]);

  const baseStyles = useMemo(() => {
    return {
      overrides: {
        MuiCssBaseline: {
          "@global": {
            "*": {
              boxSizing: "border-box",
              margin: 0,
              padding: 0,
            },
            html: {
              "-webkit-font-smoothing": "antialiased",
              "-moz-osx-font-smoothing": "grayscale",
            },
            body: {
              fontFamily: "Roboto",
            },
            ".second-font": {
              fontFamily: "Roboto",
            },
            "#root": {
              height: "100%",
              width: "100%",
            },
            ".highcharts-range-selector-group": {
              display: "none",
            },
            ".highcharts-scrollbar": {
              display: "none",
            },
            ".highcharts-credits": {
              display: "none",
            },
            ".scoring-chart-tooltip-container": {
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            },
            ".scoring-chart-tooltip-circle": {
              borderRadius: "50%",
              width: "10px",
              height: "10px",
              marginRight: "0.25rem",
            },
            ".scoring-chart-tooltip-x": {
              borderBottom: "1px solid silver",
              paddingBottom: "0.25rem",
            },
          },
        },
        MuiPaper: {
          root: {
            padding: "1rem",
          },
          rounded: {
            borderRadius: "10px",
          },
          elevation1: {
            boxShadow: "0px 1px 3px 0px #0000001F",
          },
        },
        MuiButton: {
          root: {
            textTransform: "none",
          },
          disabled: {
            cursor: "not-allowed !important",
            pointerEvents: "auto !important",
          },
          sizeLarge: {
            padding: "10px 22px",
          },
          sizeSmall: {
            padding: "4px 10px",
          },
        },
        MuiFormLabel: {
          root: {
            color: theme.palette.text.secondary,
            borderRadius: "8px",
          },
        },
        MuiInputLabel: {
          shrink: {
            color: `${theme.palette.text.hint} !important`,
          },
        },
        MuiOutlinedInput: {
          root: {
            backgroundColor: theme.palette.background.default,
            borderRadius: "8px",
            "& input[type=number]": {
              "-moz-appearance": "textfield",
            },
            "& input[type=number]::-webkit-outer-spin-button": {
              "-webkit-appearance": "none",
              margin: 0,
            },
            "& input[type=number]::-webkit-inner-spin-button": {
              "-webkit-appearance": "none",
              margin: 0,
            },
            "& fieldset": {
              borderRadius: "8px",
            },
          },
        },
        MuiTableHead: {
          root: {
            "& .MuiTableRow-root": {
              backgroundColor: switchTheme(themeMode, "#4D2700", "#F4EEE6"),
              "& .MuiTableCell-root": {
                borderBottom: `1px solid ${switchTheme(themeMode, "#583520", "#EBE1D8")}`,
              },
              "& .MuiTypography-root": {
                color: theme.palette.text.secondary,
                fontSize: "14px",
                fontWeight: 500,
              },
            },
          },
        },
        MuiTableBody: {
          root: {
            "& .MuiTableRow-root": {
              backgroundColor: theme.palette.background.paper,
              cursor: "pointer",
              "& .MuiTableCell-root": {
                borderBottom: `1px solid ${switchTheme(themeMode, "#583520", "#EBE1D8")}`,
              },
              "& .MuiTypography-root": {
                color: theme.palette.text.hint,
              },
            },
            "& .MuiTableRow-root:last-child": {
              "& .MuiTableCell-root": {
                border: "none",
              },
            },
          },
        },
        MuiTooltip: {
          tooltip: {
            fontSize: 12,
            backgroundColor: alpha(theme.palette.background.collapse, 0.95),
            boxShadow: "0px 0px 2px 0px #0000001F",
            color: theme.palette.text.hint,
            borderRadius: "6px",
            padding: "0.5rem",
          },
        },
        MuiPaginationItem: {
          root: {
            "&.Mui-selected": {
              boxShadow: "0px 0px 10px 1px rgba(196, 196, 196, 0.5)",
            },
            text: {
              fontWeight: 400,
            },
          },
        },
      },
      props: {
        MuiPopover: {
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "center",
          },
        },
        MuiTooltip: {
          placement: "top",
        },
        MuiPagination: {
          shape: "rounded",
          color: "primary",
        },
      },
    };
  }, [theme]);

  return (
    <ThemeProvider theme={responsiveFontSizes(mergeDeep(theme, baseStyles))}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
