import { Box } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";

export default function CssPagination({ paginationProps, ...props }) {
  return (
    <Box {...props} display="flex" justifyContent="flex-end" alignItems="center">
      <Pagination {...paginationProps} showFirstButton showLastButton />
    </Box>
  );
}
