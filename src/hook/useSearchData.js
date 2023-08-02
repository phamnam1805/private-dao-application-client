import { useMemo } from "react";

export default function useSearchData(fullData, searchText, searchAction) {
  return useMemo(() => {
    if (searchText) {
      if (searchText.length === 0) return fullData;
      else return fullData.filter((element, index) => searchAction(element, index, searchText));
    }
    return fullData;
  }, [fullData, searchText, searchAction]);
}
