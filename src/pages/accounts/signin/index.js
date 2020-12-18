import { useState } from "react";
import {
  Stack,
  Heading,
  Box,
  Text,
  Button,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useColorModeValue,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../../hooks/useAuth";
import AuthLayout from "../../../components/AuthLayout";
import Link from "../../../components/Link";
import ErrorAlert from "../../../components/ErrorAlert";

export default function SignIn() {
  const { register, handleSubmit, errors: errorField, formState } = useForm();
  const [errorState, setErrorState] = useState(null);
  const { isSubmitting } = formState;
  const auth = useAuth();

  const onSubmit = async (data) => {
    const response = await auth.signIn(data);

    if (response && response.error) {
      console.log(response.error);
      setErrorState(response.error);
    }
  };

  const onSignInWithGoogle = async () => {
    try {
      await auth.signInWithGoogle();
    } catch (error) {
      console.log(error);
      setErrorState(error);
    }
  };

  return (
    <AuthLayout>
      <Box
        p={[6, 6, 8]}
        width="full"
        maxWidth="360px"
        borderWidth={1}
        borderRadius={8}
        boxShadow="md"
        bg={useColorModeValue("white", "gray.800")}
      >
        <Box textAlign="center">
          <Heading as="h1" fontSize="3xl">
            Sign In
          </Heading>
        </Box>
        <Box mt={5} textAlign="left">
          <form onSubmit={handleSubmit(onSubmit)} method="post">
            {errorState && <ErrorAlert message={errorState.message} />}
            <Stack spacing={[4, 4, 5]}>
              <FormControl isInvalid={errorField.email}>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  focusBorderColor="teal.400"
                  ref={register({
                    required: "Please enter an email address",
                    pattern: {
                      value: /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/,
                      message: "Not a valid email address",
                    },
                  })}
                  id="email"
                  name="email"
                  type="email"
                  variant="filled"
                  placeholder="example@email.com"
                />
                {errorField.email && (
                  <FormErrorMessage>
                    {errorField.email.message}
                  </FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={errorField.password}>
                <FormLabel htmlFor="password">Password</FormLabel>
                <Input
                  focusBorderColor="teal.400"
                  ref={register({
                    required: "Please enter a password",
                    minLength: {
                      value: 6,
                      message: "Password should have at least 6 characters",
                    },
                  })}
                  id="password"
                  name="password"
                  type="password"
                  variant="filled"
                  autoComplete="on"
                  placeholder="******"
                />
                {errorField.password && (
                  <FormErrorMessage>
                    {errorField.password.message}
                  </FormErrorMessage>
                )}
              </FormControl>
              <Text textAlign="center">
                Don't have an account?{" "}
                <Link href="/accounts/signup">Sign Up</Link>
              </Text>
            </Stack>
            <Box>
              <Button
                width="full"
                mt={5}
                isLoading={isSubmitting}
                loadingText="Signing In..."
                colorScheme="teal"
                variant="solid"
                type="submit"
              >
                Sign In
              </Button>
            </Box>
            <Text
              my={2}
              //trick for text between two horizontal line
              overflow="hidden"
              textAlign="center"
              _before={{
                content: "''",
                height: "1px",
                right: "0.5em",
                marginLeft: "-50%",
                display: "inline-block",
                position: "relative",
                verticalAlign: "middle",
                width: "50%",
                backgroundColor: useColorModeValue("gray.400", "gray.100"),
              }}
              _after={{
                content: "''",
                height: "1px",
                left: "0.5em",
                marginRight: "-50%",
                display: "inline-block",
                position: "relative",
                verticalAlign: "middle",
                width: "50%",
                backgroundColor: useColorModeValue("gray.400", "gray.100"),
              }}
            >
              Or
            </Text>

            <Box textAlign="center">
              <Button
                width="full"
                onClick={onSignInWithGoogle}
                colorScheme="teal"
                fontWeight={400}
                variant="outline"
              >
                Sign In With Google
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </AuthLayout>
  );
}
