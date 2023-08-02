import { errorNotify } from "src/hook/useNotify";
import { updateAccountOverviewData } from "src/redux/accountDataSlice";

export default class WalletConnectConnector {
  constructor(dispatch, enqueueSnackbar, options, treatModalCloseAsError = true) {
    this.dispatch = dispatch;
    this.enqueueSnackbar = enqueueSnackbar;
    this._option = options;
    this._treatModalCloseAsError = treatModalCloseAsError;

    this._initialize = this._initialize.bind(this);
    this._handleConnect = this._handleConnect.bind(this);
    this._handleDisconnect = this._handleDisconnect.bind(this);
    this._handleChainChange = this._handleChainChange.bind(this);
    this._handleAccountChange = this._handleAccountChange.bind(this);
    this.activate = this.activate.bind(this);
    this.deactivate = this.deactivate.bind(this);
  }

  _handleConnect() { }

  _handleDisconnect() {
    if (this?.deactivate) this.deactivate();
  }

  _handleChainChange() { }

  _handleAccountChange(addresses) {
    if (addresses.length === 0) errorNotify(this.enqueueSnackbar, "change account error");
    else this.dispatch(updateAccountOverviewData(addresses[0]));
  }

  async _initialize(chainId) {
    if (this._eagerConnection) return this._eagerConnection;

    await (this._eagerConnection = import("@walletconnect/ethereum-provider").then(async (m) => {
      this.provider = new m.default({
        ...this._options,
        ...(chainId ? { chainId } : undefined),
      });

      this.provider.on("disconnect", this._handleDisconnect);
      this.provider.on("chainChanged", this._handleChainChange);
      this.provider.on("accountsChanged", this._handleAccountChange);
    }));
  }

  async activate(targetChainId) {
    if (this.provider?.connected) {
      if (targetChainId === undefined) return;
      if (targetChainId === this.provider.chainId) return;
      const desiredChainIdHex = `0x${Number(targetChainId).toString(16)}`;
      return this.provider
        ?.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: desiredChainIdHex }],
        })
        .catch(() => {
          void 0;
        });
    }
    if (targetChainId && targetChainId !== this.provider?.chainId) await this.deactivate();
    await this._initialize(targetChainId);
    try {
      const chainId = parseInt(await this.provider.request({ method: "eth_chainId" }));
      if (targetChainId && targetChainId !== chainId) {
        const desiredChainIdHex = `0x${Number(targetChainId).toString(16)}`;
        return this.provider
          ?.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: desiredChainIdHex }],
          })
          .catch(() => {
            void 0;
          });
      }
      return true;
    } catch (error) {
      if (error.message === "User closed modal") {
        if (this._treatModalCloseAsError) errorNotify(this.enqueueSnackbar, JSON.stringify(error));
        await this.deactivate();
      } else errorNotify(this.enqueueSnackbar, JSON.stringify(error?.message));
      return false;
    }
  }

  async deactivate() {
    this.provider?.off("disconnect", this._handleDisconnect);
    this.provider?.off("chainChanged", this._handleChainChange);
    this.provider?.off("accountsChanged", this._handleAccountChange);
    await this.provider?.disconnect();
    this.provider = undefined;
    this._eagerConnection = undefined;
  }
}
