import { Heading, Stack, Text } from "@chakra-ui/react";
import { IngredientTree } from "../components/ingredients/IngredientTree";
import { PageContainer } from "../components/PageContainer";

export const IngredientesPage = () => (
  <PageContainer>
    <Stack spacing={6}>
      <Stack spacing={2}>
        <Heading color="gray.800">Ingredientes</Heading>
        <Text color="gray.600">
          Gestioná categorías, subcategorías e ingredientes finales con una estructura jerárquica flexible.
        </Text>
      </Stack>
      <IngredientTree />
    </Stack>
  </PageContainer>
);
