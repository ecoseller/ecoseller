import Box from "@mui/material/Box";
import Card from "@mui/material/Card";

interface IEditorCardProps {
  children: React.ReactNode;
}
const EditorCard = ({ children }: IEditorCardProps) => {
  return (
    <Card elevation={0} sx={{}}>
      <Box m={3}>{children}</Box>
    </Card>
  );
};

export default EditorCard;
