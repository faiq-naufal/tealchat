import ChatLayout from "../../components/ChatLayout";
import { useState, useEffect, useRef } from "react";
import {
  Container,
  Box,
  Center,
  Stack,
  Heading,
  Flex,
  Text,
  Input,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  InputGroup,
  Button,
  IconButton,
  InputRightElement,
  useColorModeValue,
  useBreakpointValue,
  Img,
  Skeleton,
  SkeletonCircle,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { IoChatbubblesOutline } from "@react-icons/all-files/io5/IoChatbubblesOutline";
// import { IoChatbubbleOutline } from "@react-icons/all-files/io5/IoChatbubbleOutline";
// import { IoPeopleOutline } from "@react-icons/all-files/io5/IoPeopleOutline";
import { v4 as uuidv4 } from "uuid";
import { IoPaperPlaneSharp } from "@react-icons/all-files/io5/IoPaperPlaneSharp";
import DarkModeSwitcher from "../../components/DarkModeSwitcher";
import {
  firebase,
  firebaseDB,
  firebaseAuth,
} from "../../config/firebase/client";
import { useAuth } from "../../hooks/useAuth";

export default function Chat() {
  const auth = useAuth();
  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;
  const ChatEndRef = useRef();
  const backgroundTheme = useColorModeValue("white", "gray.800");

  const [currentUser] = useState(auth.user);
  const [isLoadingChat, setIsLoadingChat] = useState(true);
  const [messages, setMessages] = useState([]);

  const ButtonSend = (props) => {
    return (
      <IconButton
        type="submit"
        colorScheme="teal"
        bgColor="teal.600"
        color="white"
        size={useBreakpointValue(["sm", "md"])}
        aria-label="Drop a message"
        title="Drop a message"
        icon={<IoPaperPlaneSharp />}
        {...props}
      />
    );
  };

  const onSubmit = async ({ message }, event) => {
    if (message) {
      const form = event.target;

      const { uid, displayName: name, photoURL: photoProfile } = currentUser;

      const data = {
        uid,
        name,
        message,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        photoProfile,
      };

      //prevent multiple submission when user hit enter multiple times
      form.reset();
      await firebaseDB.collection("messages").add(data);
    }
  };

  const scrollToBottom = () => {
    if (ChatEndRef.current) {
      ChatEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  useEffect(() => {
    if (!isLoadingChat) {
      scrollToBottom();
    }
  }, [messages, isLoadingChat]);

  useEffect(() => {
    const unsubscribe = firebaseDB
      .collection("messages")
      .orderBy("createdAt", "asc")
      .limitToLast(50)
      .onSnapshot((snapshot) => {
        setMessages(
          snapshot.docs.map((doc) => {
            return {
              id: doc.id,
              ...doc.data(),
            };
          })
        );
        setIsLoadingChat(false);
      });

    firebaseAuth.onAuthStateChanged((user) => {
      if (!user) {
        unsubscribe();
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Flex direction="column" flex="1">
      <Tabs
        d="flex"
        flex="1"
        flexDirection="column"
        variant="soft-rounded"
        size="sm"
      >
        <Box position="relative" minHeight="3.5rem" mb={8}>
          <Flex
            as="header"
            position="fixed"
            py={3}
            w="full"
            zIndex={100}
            opacity="0.9"
            boxShadow="sm"
            background={backgroundTheme}
          >
            <Container
              d="flex"
              justifyContent="space-between"
              maxW={{ lg: "1200px" }}
              px={[4, 4, 6]}
            >
              <Flex>
                <Heading
                  as="h1"
                  d="flex"
                  alignItems="center"
                  fontSize={["xl", "2xl"]}
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
              <Flex justifyContent="space-between">
                {/* <TabList>
                  <Tab
                    fontSize="sm"
                    borderRadius="10px"
                    textAlign="center"
                    px={["9px", "13px"]}
                    color={useColorModeValue(`gray.800`, `white`)}
                    border="solid 1px green.100"
                    borderWidth="1px"
                    _selected={{ color: "gray.800", background: "green.100" }}
                  >
                    <IoChatbubbleOutline />
                    <Text
                      ml={["4px", "4px", "6px"]}
                      d={["none", "none", "inline"]}
                    >
                      Messages
                    </Text>
                  </Tab>
                  <Tab
                    fontSize="sm"
                    borderRadius="10px"
                    textAlign="center"
                    ml={2}
                    px={["9px", "13px"]}
                    color={useColorModeValue(`gray.800`, `white`)}
                    border="solid 1px green.100"
                    borderWidth="1px"
                    _selected={{ color: "gray.800", background: "green.100" }}
                  >
                    <IoPeopleOutline />
                    <Text
                      ml={["4px", "4px", "6px"]}
                      d={["none", "none", "inline"]}
                    >
                      Participants
                    </Text>
                  </Tab>
                </TabList> */}
                <Center ml={2}>
                  <DarkModeSwitcher />
                </Center>
                <Box ml={2}>
                  <Button
                    size={useBreakpointValue(["sm", "md"])}
                    fontSize="sm"
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => auth.signOut()}
                  >
                    Sign Out
                  </Button>
                </Box>
              </Flex>
            </Container>
          </Flex>
        </Box>

        <Flex flex="1" direction="column">
          <TabPanels d="flex" flexDirection="column" flex="1">
            <TabPanel p="0" d="flex" flexDirection="column" flex="1">
              <Container
                d="flex"
                flexDirection="column"
                flex="1"
                maxW={{ lg: "1200px" }}
                px={[4, 4, 6]}
              >
                <Flex flex="1" direction="column">
                  {messages.length && !isLoadingChat ? (
                    <Stack direction="column" flex="1" spacing={4}>
                      {messages.map(
                        ({
                          id,
                          uid,
                          name,
                          message,
                          createdAt,
                          photoProfile,
                        }) => {
                          const isCurrentUser = uid === currentUser.uid;
                          return (
                            <Flex
                              justifyContent={
                                isCurrentUser ? "flex-end" : "flex-start"
                              }
                              key={id}
                            >
                              <Box order={isCurrentUser ? 2 : 1}>
                                <Center
                                  bgColor="teal.600"
                                  color="gray.50"
                                  borderRadius="50%"
                                  overflow="hidden"
                                  boxShadow="sm"
                                  fontSize="lg"
                                  fontWeight="600"
                                  w="36px"
                                  h="36px"
                                >
                                  {photoProfile ? (
                                    <Img
                                      objectFit="cover"
                                      width="full"
                                      height="full"
                                      src={photoProfile}
                                      alt={`${name}'s profile`}
                                    />
                                  ) : (
                                    name.charAt(0).toUpperCase()
                                  )}
                                </Center>
                              </Box>

                              <Flex
                                order={isCurrentUser ? 1 : 2}
                                mt="-4px"
                                ml={isCurrentUser ? 0 : 2}
                                mr={isCurrentUser ? 2 : 0}
                                direction="column"
                              >
                                <Text
                                  textAlign={isCurrentUser ? "right" : "left"}
                                  fontSize="xs"
                                >
                                  {isCurrentUser
                                    ? `You`
                                    : name.charAt(0).toUpperCase() +
                                      name.substring(1)}
                                </Text>

                                <Box
                                  mt="2px"
                                  py="6px"
                                  px="12px"
                                  maxWidth="240px"
                                  borderWidth="1px"
                                  borderRadius="8px"
                                  fontSize="sm"
                                  background={backgroundTheme}
                                >
                                  <Text>{message}</Text>
                                </Box>
                              </Flex>
                            </Flex>
                          );
                        }
                      )}
                      <Box m={0} ref={ChatEndRef}></Box>
                    </Stack>
                  ) : !messages.length && isLoadingChat ? (
                    <Stack direction="column" flex="1" spacing={4}>
                      {[...Array(10).keys()].map((item, index) => {
                        const isEven = item % 2 !== 0;
                        return (
                          <Flex
                            justifyContent={isEven ? "flex-end" : "flex-start"}
                            key={uuidv4()}
                            width="full"
                          >
                            <Box order={isEven ? 2 : 1}>
                              <SkeletonCircle w="36px" h="36px" />
                            </Box>

                            <Flex
                              order={isEven ? 1 : 2}
                              mt="-4px"
                              ml={isEven ? 0 : 2}
                              mr={isEven ? 2 : 0}
                              direction="column"
                            >
                              <Flex
                                justifyContent={
                                  isEven ? "flex-end" : "flex-start"
                                }
                              >
                                <Skeleton
                                  width="75%"
                                  borderRadius="4px"
                                  height="16px"
                                  fontSize="xs"
                                />
                              </Flex>

                              <Skeleton
                                mt="10px"
                                py="6px"
                                px="12px"
                                width="240px"
                                height="100px"
                                borderRadius="8px"
                                fontSize="sm"
                              />
                            </Flex>
                          </Flex>
                        );
                      })}
                    </Stack>
                  ) : (
                    <Center flex="1">
                      <Text
                        fontSize="3xl"
                        fontWeight="700"
                        color="gray.300"
                        userSelect="none"
                      >
                        Be the first one to chat here
                      </Text>
                    </Center>
                  )}
                </Flex>
              </Container>
            </TabPanel>
            <TabPanel pt="0">
              <Text>This feature is coming Soon</Text>
            </TabPanel>
          </TabPanels>
        </Flex>
        <Box minHeight={["4.5rem", "5rem"]} position="relative">
          <Box
            position="fixed"
            bottom="0"
            left="0"
            width="full"
            py={3}
            borderRadius="4px"
          >
            <Container maxW={{ lg: "1200px" }} px={[4, 4, 6]}>
              <form onSubmit={handleSubmit(onSubmit)} method="post">
                <Flex>
                  <InputGroup>
                    <Input
                      id="message"
                      name="message"
                      color="gray.800"
                      bgColor="white"
                      boxShadow="md"
                      height={["3rem", "3.5rem"]}
                      pr="4rem"
                      ref={register}
                      placeholder="Drop a message to others"
                      _placeholder={{ color: "gray.400" }}
                      _selection={{ background: "teal.600", color: "white" }}
                    />
                    <InputRightElement
                      top="50%"
                      transform="translateY(-50%)"
                      right="12px"
                      children={<ButtonSend isDisabled={isSubmitting} />}
                    />
                  </InputGroup>
                </Flex>
              </form>
            </Container>
          </Box>
        </Box>
      </Tabs>
    </Flex>
  );
}
