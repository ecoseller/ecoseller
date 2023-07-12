import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";

const PaginationWrapper = ({
  totalPageCount,
  currentPage,
  setPage,
}: {
  totalPageCount: number;
  currentPage: number;
  setPage: (page: number) => void;
}) => {
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    console.log("Handle page change", event, value);
    setPage(value);
  };

  return (
    <Box mt={2}>
      <Pagination
        count={totalPageCount}
        page={currentPage}
        onChange={handleChange}
        shape="rounded"
      />
    </Box>
  );
};

export default PaginationWrapper;
