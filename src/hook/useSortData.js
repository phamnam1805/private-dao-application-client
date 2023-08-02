import { useMemo, useState } from "react";

export default function useSortData(sortData, defaultSortType = "desc", defaultSortKey = undefined) {
  const [sortType, setSortType] = useState(defaultSortType);
  const [sortKey, setSortKey] = useState(defaultSortKey);

  function update(key) {
    if (key === sortKey) {
      if (sortType === "desc") setSortType("asc");
      else setSortType("desc");
    } else {
      setSortKey(key);
      setSortType("desc");
    }
  }

  const realData = useMemo(() => {
    if (sortKey) {
      if (sortType === "asc") return sortData.sort((x, y) => x[sortKey] - y[sortKey]);
      else return sortData.sort((x, y) => y[sortKey] - x[sortKey]);
    }
    return sortData;
  }, [sortData, sortType, sortKey]);

  return { update, data: realData, sortType, sortKey };
}
