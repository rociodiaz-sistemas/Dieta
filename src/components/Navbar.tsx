import { Box, Button, Flex, Heading, HStack } from "@chakra-ui/react";
import { NavLink, useLocation } from "react-router-dom";

const links = [
  { to: "/ingredientes", label: "Ingredientes" },
  { to: "/recetas", label: "Recetas" },
];

export const Navbar = () => {
  const location = useLocation();

  return (
    <Box bg="white" borderBottomWidth="1px" borderColor="gray.200" px={{ base: 4, md: 8 }} py={4}>
      <Flex
        maxW="1200px"
        mx="auto"
        align={{ base: "flex-start", md: "center" }}
        direction={{ base: "column", md: "row" }}
        gap={4}
        justify="space-between"
      >
        <Heading size="md" color="brand.700">
          Planificador de dieta
        </Heading>
        <HStack spacing={3} flexWrap="wrap">
          {links.map((link) => {
            const isActive = location.pathname === link.to;

            return (
              <Button
                key={link.to}
                as={NavLink}
                to={link.to}
                variant={isActive ? "solid" : "ghost"}
                colorScheme={isActive ? "green" : undefined}
              >
                {link.label}
              </Button>
            );
          })}
        </HStack>
      </Flex>
    </Box>
  );
};
