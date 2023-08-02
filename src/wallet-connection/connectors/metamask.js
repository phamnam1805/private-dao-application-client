import { errorNotify } from "src/hook/useNotify";
import { updateAccountOverviewData } from "src/redux/accountDataSlice";

export default class MetamaskConnector {
  constructor(dispatch, enqueueSnackbar) {
    this.dispatch = dispatch;
    this.enqueueSnackbar = enqueueSnackbar;

    this._initialize = this._initialize.bind(this);
    this._handleConnect = this._handleConnect.bind(this);
    this._handleDisconnect = this._handleDisconnect.bind(this);
    this._handleChainChange = this._handleChainChange.bind(this);
    this._handleAccountChange = this._handleAccountChange.bind(this);
    this.activate = this.activate.bind(this);
    this.deactivate = this.deactivate.bind(this);
  }

  async _initialize() {
    if (this._eagerConnection) return this._eagerConnection;

    await (this._eagerConnection = import("@metamask/detect-provider")
      .then((m) => m.default(this.options))
      .then((provider) => {
        if (provider) {
          this.provider = provider;
          this.provider.on("connect", this._handleConnect);
          this.provider.on("disconnect", this._handleDisconnect);
          this.provider.on("chainChanged", this._handleChainChange);
          this.provider.on("accountsChanged", this._handleAccountChange);
        }
      }));
  }

  _handleConnect() {
    console.debug("metamask connected");
  }

  _handleDisconnect() {
    console.debug("metamask disconnected");
  }

  _handleChainChange(chainId) {
    console.debug("metamask change chain: ", chainId);
  }

  _handleAccountChange(addresses) {
    console.debug("metamask change account: ", addresses);
    if (addresses.length === 0) errorNotify(this.enqueueSnackbar, "change account error");
    else {
      this.dispatch(updateAccountOverviewData(addresses[0]));
    }
  }

  async activate(targetChainId) {
    await this._initialize();
    if (!this.provider) {
      errorNotify(this.enqueueSnackbar, "Metamask is not installed");
      return;
    }
    const chainId = await this.provider.request({ method: "eth_chainId" });
    const receiveChainId = parseInt(chainId);
    if (!targetChainId || receiveChainId === parseInt(targetChainId)) return true;
    const desiredChainIdHex = `0x${Number(targetChainId).toString(16)}`;
    try {
      await this.provider.request({ method: "wallet_switchEthereumChain", params: [{ chainId: desiredChainIdHex }] });
      return true;
    } catch (error) {
      if (error.code === 4902) {
        try {
          await this.provider.request({ method: "wallet_addEthereumChain", params: [{ chainId: desiredChainIdHex }] });
        } catch (error) {
          errorNotify(this.enqueueSnackbar, JSON.stringify(error?.message));
        }
      } else errorNotify(this.enqueueSnackbar, JSON.stringify(error?.message));
      return false;
    }
  }

  async deactivate() {
    this.provider?.removeListener("connect", this._handleConnect);
    this.provider?.removeListener("disconnect", this._handleDisconnect);
    this.provider?.removeListener("chainChanged", this._handleChainChange);
    this.provider?.removeListener("accountsChanged", this._handleAccountChange);
    this.provider = undefined;
    this._eagerConnection = undefined;
  }
}
