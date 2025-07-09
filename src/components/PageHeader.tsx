import { Box, Typography } from "@mui/material";

interface PageHeaderProps {
  title: string;
  description: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title }) => {
  return (
    <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#111827" }}>
         {title}
          </Typography>
          
         
          </Box>
        </Box>
   
  );
};

export default PageHeader;
