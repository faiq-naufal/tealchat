import { Box, Alert, AlertIcon, AlertDescription } from "@chakra-ui/react";

export default function ErrorAlert({ message }) {
  return (
    <Box my={5}>
      <Alert status="error" borderRadius={4} variant="left-accent">
        <AlertIcon />
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </Box>
  );
}
