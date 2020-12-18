import { Heading, Box, Flex, Text, Container } from "@chakra-ui/react";
import { IoChatbubblesOutline } from "@react-icons/all-files/io5/IoChatbubblesOutline";
import DarkModeSwitcher from "../DarkModeSwitcher";

export default function AuthLayout({ children }) {
  return (
    <Container
      flex="1"
      d="flex"
      flexDirection="column"
      maxW={{ lg: "1200px" }}
      px={[4, 4, 6]}
    >
      <Flex mt={[5, 6]} justifyContent="space-between">
        <Flex flex="1" justifyContent="center" alignItems="center">
          <Heading
            d="flex"
            alignItems="center"
            transform="translateX(10px)"
            fontSize={["2xl", "3xl"]}
          >
            <IoChatbubblesOutline color="#38B2AC" />{" "}
            <Text as="span" fontWeight={600} ml={2}>
              Teal
            </Text>
            <Text as="span" color="teal.400">
              Chat
            </Text>
          </Heading>
        </Flex>
        <Box>
          <Flex alignItems="center" justifyContent="center">
            <DarkModeSwitcher />
          </Flex>
        </Box>
      </Flex>
      <Flex
        flex="1"
        mt={[5, 6]}
        width="full"
        align="center"
        justifyContent="center"
      >
        {children}
      </Flex>
    </Container>
  );
}
