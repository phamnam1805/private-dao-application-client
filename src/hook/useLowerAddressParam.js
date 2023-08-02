import { useMemo } from "react";
import { useParams } from "react-router-dom";

export default function useLowerAddressParam() {
  const data = useParams();
  return useMemo(() => {
    const result = {};
    const keyList = Object.keys(data);
    for (var _key of keyList) {
      const _data = data[_key];
      result[_key] = _data.toLowerCase();
    }
    return result;
  }, [data]);
}
