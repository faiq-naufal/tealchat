import { Link as ChakraLink } from "@chakra-ui/react";
import NextLink from "next/link";

export default function Link({ children, href, ...others }) {
  return (
    <NextLink passHref href={href}>
      <ChakraLink {...others}>{children}</ChakraLink>
    </NextLink>
  );
}
