import Link from "next/link";
import Image from "next/image";
import useMediaQuery from "@mui/material/useMediaQuery";
import useTheme from "@mui/material/styles/useTheme";

const Logo = () => {
  const theme = useTheme();

  const largeScreen = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <Link href="/" shallow={false} prefetch={false}>
      <div
        style={{
          width: largeScreen ? `150px` : `100px`,
          height: `30px`,
          flexShrink: 0,
          cursor: `pointer`,
          position: `relative`,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Image
          alt={`logo`}
          src={`/logo/main.svg`}
          style={{
            objectFit: `contain`,
            objectPosition: `left center`,
            margin: "0 auto",
            display: "block",
          }}
          fill
          sizes="100vw"
          priority
        />
      </div>
    </Link>
  );
};

export default Logo;
