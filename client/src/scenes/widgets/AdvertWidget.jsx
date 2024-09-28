import { Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";

const AdvertWidget = () => {
  const { palette } = useTheme();
  const { dark, main, medium } = palette.neutral;

  const adImage = "http://localhost:3001/assets/info4.jpeg"; // Store image URL in a variable

  return (
    <WidgetWrapper>
      <FlexBetween>
        <Typography color={dark} variant="h5" fontWeight="500">
          Sponsored
        </Typography>
        <Typography color={medium}>Create Ad</Typography>
      </FlexBetween>
      <img
        src={adImage} // Use the variable for the image source
        alt="Advert"
        width="100%"
        height="auto"
        style={{ borderRadius: "0.75rem", margin: "0.75rem 0" }}
      />
      <FlexBetween>
        <Typography color={main}>MikaCosmetics</Typography>
        <Typography color={medium}>mikacosmetics.com</Typography>
      </FlexBetween>
      <Typography color={medium} margin="0.5rem 0">
        Your pathway to stunning and immaculate beauty, ensuring your skin is
        exfoliated and shining like light.
      </Typography>
    </WidgetWrapper>
  );
};

export default AdvertWidget;
