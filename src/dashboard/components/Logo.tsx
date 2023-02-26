// next.js
import Link from "next/link";
// mui
import Box from "@mui/material/Box";
const Logo = () => {
  return (
    <Link href="/dashboard/overview">
      <Box
        component="img"
        src="/logo/dashboard.svg"
        sx={{
          display: "inline-flex",
          //   width: 150,
          height: 23,
          mr: 1,
        }}
      />
    </Link>
  );
};

export default Logo;
