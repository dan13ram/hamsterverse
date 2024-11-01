import { createContext, ReactNode, useContext } from "react";
import { useCallback, useMemo, useState } from "react";

const PageContext = createContext<{ page: number, totalPages: number, setPage: (page: number) => void }>({
  page: 0,
  totalPages: 0,
  setPage: () => { },
});

type Props = {
  children: ReactNode;
};

const MAX_PAGES = 10;

export const PageProvider = ({ children }: Props) => {
  const [page, setPageInner] = useState(0);

  const setPage = useCallback((page: number) => {
    if (page < 0) {
      setPageInner(0);
    } else if (page >= MAX_PAGES) {
      setPageInner(MAX_PAGES - 1);
    } else {
      setPageInner(page);
    }
  }, []);

  const value = useMemo(() => ({
    page,
    totalPages: MAX_PAGES,
    setPage,
  }), [page, setPage]);

  return <PageContext.Provider value={value}>{children}</PageContext.Provider>;
};

export const usePage = () => {
  const value = useContext(PageContext);
  if (!value) throw new Error("Must be used within a PageProvider");
  return value;
};
