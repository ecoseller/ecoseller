import { ISummaryValue } from "@/types/order";
import { Dictionary } from "@editorjs/editorjs";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { alpha, styled } from "@mui/material/styles";

const StyledIcon = styled("div")(({ theme }) => ({
  margin: "auto",
  display: "flex",
  borderRadius: "50%",
  alignItems: "center",
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: "center",
  marginBottom: theme.spacing(3),
}));

interface ISummaryWidget {
  title: string;
  value: ISummaryValue[];
  icon: React.ReactNode;
  color: string;
  sx?: any;
}

const SummaryWidget = ({
  title,
  value,
  icon,
  color,
  sx,
  ...props
}: ISummaryWidget) => {
  console.log("VALUE", value);

  return (
    <Card
      sx={{
        py: 5,
        boxShadow: 0,
        textAlign: "center",
        color: (theme: any) => theme.palette[color].darker,
        bgcolor: (theme: any) => theme.palette[color].lighter,
        ...sx,
      }}
      {...props}
    >
      <StyledIcon
        sx={{
          color: (theme: any) => theme.palette[color].darker,
          backgroundImage: `linear-gradient(150deg, ${alpha(
            "#8D44AD",
            0
          )} 0%, ${alpha("#8D44AD", 0.24)} 100%)`,
        }}
      >
        {icon}
      </StyledIcon>
      {value &&
        value.map((item: ISummaryValue) => (
          <Typography variant="h5">
            {item.code} {Math.round(item.value)} {item.symbol}
          </Typography>
        ))}
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        {title}
      </Typography>
    </Card>
  );
};

export default SummaryWidget;
