import { Box, Button, Heading, HStack, Stack, Text } from "@chakra-ui/react";
import { useMemo } from "react";
import { useAppContext } from "../../context/AppContext";
import { Recipe } from "../../types/models";
import { calculateRecipeCalories } from "../../utils/calorieCalculations";

interface RecipeListProps {
  onEdit: (recipe: Recipe) => void;
  onAddToToday: (recipeId: string) => void;
  searchTerm: string;
  minCalories: number | "";
  maxCalories: number | "";
  remainingCalories: number;
  calorieAwareOnly: boolean;
}

export const RecipeList = ({
  onEdit,
  onAddToToday,
  searchTerm,
  minCalories,
  maxCalories,
  remainingCalories,
  calorieAwareOnly,
}: RecipeListProps) => {
  const { recipes, ingredients, variants, deleteRecipe } = useAppContext();

  const totals = useMemo(() => {
    return recipes.reduce<Record<string, number>>((accumulator, recipe) => {
      accumulator[recipe.id] = calculateRecipeCalories(recipe, variants);
      return accumulator;
    }, {});
  }, [recipes, variants]);

  const filteredRecipes = useMemo(() => {
    const loweredSearch = searchTerm.trim().toLowerCase();

    return recipes.filter((recipe) => {
      const total = totals[recipe.id] ?? 0;
      const matchesSearch = loweredSearch.length === 0 || recipe.nombre.toLowerCase().includes(loweredSearch);
      const matchesMin = minCalories === "" || total >= minCalories;
      const matchesMax = maxCalories === "" || total <= maxCalories;
      const matchesRemaining = !calorieAwareOnly || total <= remainingCalories;

      return matchesSearch && matchesMin && matchesMax && matchesRemaining;
    });
  }, [calorieAwareOnly, maxCalories, minCalories, recipes, remainingCalories, searchTerm, totals]);

  if (recipes.length === 0) {
    return (
      <Box bg="white" borderWidth="1px" rounded="xl" p={6}>
        <Text color="gray.500">Todavía no hay recetas guardadas.</Text>
      </Box>
    );
  }

  if (filteredRecipes.length === 0) {
    return (
      <Box bg="white" borderWidth="1px" rounded="xl" p={6}>
        <Text color="gray.500">No hay recetas que coincidan con la búsqueda, el rango o las calorías restantes de hoy.</Text>
      </Box>
    );
  }

  return (
    <Stack spacing={4}>
      {filteredRecipes.map((recipe) => (
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
          <HStack flexWrap="wrap">
            <Button size="sm" colorScheme="green" onClick={() => onAddToToday(recipe.id)}>
              Agregar al día actual
            </Button>
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
