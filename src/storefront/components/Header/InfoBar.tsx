/**
 * /components/Header/InfoBar.tsx
 * Info bar component for the header menu - it's on top of the page and it's used for displaying info messages
 */

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface IInfoBarProps {
  text: string;
}

const InfoBar = ({ text }: IInfoBarProps) => {
  return (
    <div
      style={{
        height: "30px",
        width: "100%",
        position: "relative",
        backgroundColor: "#222222",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={{
          xs: 5,
          sm: 5,
        }}
        sx={{
          margin: 0,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "white",
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ flexGrow: 1 }}
          style={{
            textDecoration: "none",
            color: "inherit",
            cursor: "pointer",
          }}
        >
          {text}
        </Typography>
      </Stack>
    </div>
  );
};

export default InfoBar;
