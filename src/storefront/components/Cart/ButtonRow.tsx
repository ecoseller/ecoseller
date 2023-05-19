import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

interface IButton {
  onClick: () => void;
  title: string;
  disabled: boolean;
}

interface ICartButtonRowProps {
  prev: IButton;
  next: IButton;
}

const CartButtonRow = (props: ICartButtonRowProps) => {
  const { prev, next } = props;
  return (
    <Grid
      container
      spacing={{ xs: 0, md: 4, lg: 4 }}
      columns={{ xs: 10, sm: 10, md: 12 }}
      pt={4}
    >
      <Grid container item xs={2} sm={2} md={2} direction="column" pt={4}>
        <Typography
          variant="body1"
          sx={{
            cursor: "pointer",
            textDecoration: "underline",
            "&:hover": {
              color: "primary.main",
            },
          }}
          onClick={prev.onClick}
        >
          {prev.title}
        </Typography>
      </Grid>
      <Grid container item xs={6} sm={7} md={7} direction="column" pt={4} />
      <Grid container item xs={1} sm={1} md={1} direction="column" pt={4}>
        <Button
          variant={"contained"}
          disabled={next.disabled}
          onClick={next.onClick}
        >
          {next.title}
        </Button>
      </Grid>
    </Grid>
  );
};

export default CartButtonRow;
