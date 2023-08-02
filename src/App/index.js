import { IconButton } from "@material-ui/core";
import { SnackbarProvider } from "notistack";
import { createRef } from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import LayoutWrapper from "src/components/Wrappers/LayoutWrapper";
import ThemeWrapper from "src/components/Wrappers/ThemeWrapper";
import store from "src/redux/store";
import RouteApp from "./RouteApp";
import CloseIcon from "@material-ui/icons/Close";

export default function ProviderApp() {
  const notistackRef = createRef();
  const onClickDismiss = (key) => () => {
    notistackRef.current.closeSnackbar(key);
  };

  return (
    <Provider store={store}>
      <Router>
        <ThemeWrapper>
          <SnackbarProvider
            maxSnack={3}
            ref={notistackRef}
            action={(key) => (
              <IconButton size="small" onClick={onClickDismiss(key)}>
                <CloseIcon style={{ color: "#FFFFFF" }} />
              </IconButton>
            )}
          >
            <LayoutWrapper>
              <RouteApp />
            </LayoutWrapper>
          </SnackbarProvider>
        </ThemeWrapper>
      </Router>
    </Provider>
  );
}
