import { useEffect, useState } from "react";

export default function usePagination(data, config) {
  const pageIndex = config?.pageIndex ?? 1;
  const rowPerPage = config?.rowPerPage ?? 10;

  const [currentPage, setCurrentPage] = useState(pageIndex);
  const maxPage = Math.ceil(data.length / rowPerPage);

  function next() {
    setCurrentPage((currentPage) => Math.min(currentPage + 1, maxPage));
  }

  function prev() {
    setCurrentPage((currentPage) => Math.max(currentPage - 1, 1));
  }

  function jump(page) {
    const pageNumber = Math.max(1, page);
    setCurrentPage(Math.min(pageNumber, maxPage));
  }

  useEffect(() => {
    jump(1);
  }, [data]);

  return {
    next,
    prev,
    jump,
    data: data.slice(currentPage * rowPerPage - rowPerPage, currentPage * rowPerPage),
    currentPage,
    maxPage,
  };
}
