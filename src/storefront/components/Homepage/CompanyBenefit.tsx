import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  elevation: 0,
  square: false,
}));

interface ICompanyBenefitProps {
  title: string;
  subtitle: string;
}

const CompanyBenefit = ({ title, subtitle }: ICompanyBenefitProps) => {
  return (
    <Item square={true} elevation={1}>
      <Typography variant="h6" fontWeight={700}>
        {title}
      </Typography>
      <Typography variant="body2">{subtitle}</Typography>
    </Item>
  );
};

export default CompanyBenefit;
