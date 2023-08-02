import { useState } from "react";
import { useSelector } from "react-redux";
import useNotify from "./useNotify";

export default function useOpenActionLoading() {
  const [open, setOpen] = useState(false);
  const { warnNotify } = useNotify();
  const { connector } = useSelector((state) => state.configSlice);

  async function onOpenClick() {
    if (!connector || connector == "null") return warnNotify("Please connect your wallet first!");
    else setOpen(true);
  }

  return { open, setOpen, onOpenClick };
}
