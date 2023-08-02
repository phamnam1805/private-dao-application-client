import { makeStyles, TextField } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import SearchIcon from "@material-ui/icons/Search";
import clsx from "clsx";

const useStyle = makeStyles(() => ({
  cleanIcon: {
    cursor: "pointer",
  },
  hideCleanIcon: {
    visibility: "hidden",
  },
}));

export default function SearchTextField({ searchText, setSearchText, ...props }) {
  const cls = useStyle();

  const onSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <TextField
      size="small"
      {...props}
      value={searchText}
      onChange={onSearchChange}
      InputProps={{
        ...props?.InputProps,
        startAdornment: <>{props?.InputProps?.startAdornment ?? <SearchIcon fontSize="small" />}</>,
        endAdornment: (
          <CloseIcon
            fontSize="small"
            className={clsx({ [cls.cleanIcon]: searchText.length > 0, [cls.hideCleanIcon]: searchText.length === 0 })}
            onClick={() => setSearchText("")}
          />
        ),
      }}
    />
  );
}
