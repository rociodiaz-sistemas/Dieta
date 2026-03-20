import { Box, Button, Heading, HStack, Stack, Text } from "@chakra-ui/react";
import { useMemo } from "react";
import { useAppContext } from "../../context/AppContext";
import { Recipe } from "../../types/models";
import { convertToBaseUnit } from "../../utils/unitConversion";

interface RecipeListProps {
  onEdit: (recipe: Recipe) => void;
}

export const RecipeList = ({ onEdit }: RecipeListProps) => {
  const { recipes, ingredients, variants, deleteRecipe } = useAppContext();

  const totals = useMemo(() => {
    return recipes.reduce<Record<string, number>>((accumulator, recipe) => {
      const total = recipe.ingredientes.reduce((sum, recipeIngredient) => {
        const variant = variants.find((candidate) => candidate.id === recipeIngredient.variantId);
        if (!variant || recipeIngredient.cantidad === "") {
          return sum;
        }

        const convertedAmount = convertToBaseUnit(Number(recipeIngredient.cantidad), recipeIngredient.unidad, variant.unidadBase);

        if (convertedAmount === null) {
          return sum;
        }

        return sum + (variant.calorias * convertedAmount) / variant.cantidadBase;
      }, 0);

      accumulator[recipe.id] = total;
      return accumulator;
    }, {});
  }, [recipes, variants]);

  if (recipes.length === 0) {
    return (
      <Box bg="white" borderWidth="1px" rounded="xl" p={6}>
        <Text color="gray.500">Todavía no hay recetas guardadas.</Text>
      </Box>
    );
  }

  return (
    <Stack spacing={4}>
      {recipes.map((recipe) => (
        <Box key={recipe.id} bg="white" borderWidth="1px" rounded="xl" p={5}>
          <Heading size="sm" mb={3}>
            {recipe.nombre}
          </Heading>
          <Stack spacing={2} mb={4}>
            {recipe.ingredientes.map((item) => {
              const ingredient = ingredients.find((candidate) => candidate.id === item.ingredientId);
              const variant = variants.find((candidate) => candidate.id === item.variantId);
              const routeText = item.path.join(" → ");

              return (
                <Text key={item.id} fontSize="sm" color="gray.700">
                  {routeText}
                  {routeText ? " → " : ""}
                  {ingredient?.nombre ?? "Ingrediente eliminado"}
                  {variant ? ` (${variant.marca})` : ""} | {item.cantidad || 0} {item.unidad}
                </Text>
              );
            })}
          </Stack>
          <Text fontWeight="semibold" color="brand.700" mb={4}>
            Total: {totals[recipe.id]?.toFixed(2) ?? "0.00"} calorías
          </Text>
          <HStack>
            <Button size="sm" variant="outline" onClick={() => onEdit(recipe)}>
              Editar
            </Button>
            <Button size="sm" variant="outline" colorScheme="red" onClick={() => deleteRecipe(recipe.id)}>
              Eliminar
            </Button>
          </HStack>
        </Box>
      ))}
    </Stack>
  );
};
