import { useColorMode, IconButton, useColorModeValue } from "@chakra-ui/react";
import { RiMoonFill } from "@react-icons/all-files/ri/RiMoonFill";
import { RiSunFill } from "@react-icons/all-files/ri/RiSunFill";

export default function DarkModeSwitcher() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <IconButton
      size="sm"
      w={[8, 10]}
      h={[8, 10]}
      color="#fcc21b"
      aria-label={
        colorMode === "dark" ? `Toggle Light Mode` : `Toggle Dark Mode`
      }
      title={colorMode === "dark" ? `Toggle Light Mode` : `Toggle Dark Mode`}
      icon={colorMode === "dark" ? <RiSunFill /> : <RiMoonFill />}
      onClick={toggleColorMode}
    />
  );
}
