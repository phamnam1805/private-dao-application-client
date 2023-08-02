import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { TX_STATE } from "src/configs/constance";
import { updateAccountDataNonce } from "src/redux/accountDataSlice";
import { useImmer } from "use-immer";

export const DEFAULT_TRANSACTION_STATE = {
  isLoading: false,
  transactionStatus: TX_STATE.INITIAL,
  transactionHash: "",
  error: undefined,
};

export default function useEmitTransaction(isSingle = true) {
  const dispatch = useDispatch();
  const [transactionState, setTransactionState] = useImmer(DEFAULT_TRANSACTION_STATE);

  function emitTransaction(transactionPromise, event = {}, isUpdateUser = true) {
    setTransactionState((draft) => {
      draft["transactionStatus"] = TX_STATE.WAIT_WALLET;
      draft["isLoading"] = true;
    });
    transactionPromise.on("transactionHash", (hash) => {
      setTransactionState((draft) => {
        draft["transactionStatus"] = TX_STATE.TX_EXECUTING;
        draft["transactionHash"] = hash;
      });
      if (event?.transactionHashEvent) event?.transactionHashEvent(setTransactionState, hash);
    });
    transactionPromise.then((receipt) => {
      if (isUpdateUser) dispatch(updateAccountDataNonce());
      if (isSingle)
        setTransactionState((draft) => {
          draft["transactionStatus"] = TX_STATE.TX_SUCCESS;
        });
      if (event?.thenEvent) event?.thenEvent(setTransactionState, receipt);
    });
    transactionPromise.catch((error) => {
      let _state = TX_STATE.TX_FAIL;
      if (error.code === 4001) _state = TX_STATE.WALLET_REJECT;
      setTransactionState((draft) => {
        draft["transactionStatus"] = _state;
        draft["isLoading"] = false;
      });
      if (event?.errorEvent) event?.errorEvent(error);
    });
  }

  return useMemo(() => {
    return { transactionState, setTransactionState, emitTransaction };
  }, [transactionState]);
}
