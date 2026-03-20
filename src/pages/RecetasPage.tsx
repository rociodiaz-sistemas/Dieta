import { Button, Heading, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { PageContainer } from "../components/PageContainer";
import { RecipeForm } from "../components/recipes/RecipeForm";
import { RecipeList } from "../components/recipes/RecipeList";
import { Recipe } from "../types/models";

export const RecetasPage = () => {
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const showForm = isCreating || Boolean(editingRecipe);

  return (
    <PageContainer>
      <Stack spacing={6}>
        <Stack spacing={2}>
          <Heading color="gray.800">Recetas</Heading>
          <Text color="gray.600">
            Armá recetas usando la jerarquía de ingredientes y calculá calorías automáticamente.
          </Text>
        </Stack>

        {!showForm ? (
          <Button alignSelf="flex-start" colorScheme="green" onClick={() => setIsCreating(true)}>
            Crear receta
          </Button>
        ) : null}

        {showForm ? (
          <RecipeForm
            initialRecipe={editingRecipe}
            onClose={() => {
              setEditingRecipe(null);
              setIsCreating(false);
            }}
          />
        ) : null}

        <RecipeList
          onEdit={(recipe) => {
            setEditingRecipe(recipe);
            setIsCreating(false);
          }}
        />
      </Stack>
    </PageContainer>
  );
};
