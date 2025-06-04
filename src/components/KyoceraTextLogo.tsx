import { Box } from "@mui/material";

import KyoCortexIcon from "../assets/KyoCortex.svg";

const KyoceraTextLogo = () => {
  return (
    <div>
      <Box
        component="img"
        src={KyoCortexIcon}
        alt="KyoCortex Logo"
        sx={{ width: 150 }}
      />
    </div>
  );
};

export default KyoceraTextLogo;
