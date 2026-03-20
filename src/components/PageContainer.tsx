import { Box, BoxProps } from "@chakra-ui/react";
import { ReactNode } from "react";

export const PageContainer = ({
  children,
  ...props
}: BoxProps & { children: ReactNode }) => (
  <Box maxW="1200px" mx="auto" px={{ base: 4, md: 8 }} py={8} {...props}>
    {children}
  </Box>
);
