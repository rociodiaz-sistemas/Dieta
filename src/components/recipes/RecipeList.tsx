import {
  Box,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
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
  const { recipes, variants, deleteRecipe } = useAppContext();

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
    <SimpleGrid columns={{ base: 1, sm: 2, lg: 3, xl: 4 }} spacing={4}>
      {filteredRecipes.map((recipe) => (
        <Box
          key={recipe.id}
          bg="white"
          borderWidth="1px"
          rounded="xl"
          p={4}
          minH="132px"
          transition="all 0.18s ease"
          _hover={{ borderColor: "green.200", shadow: "sm", transform: "translateY(-1px)" }}
        >
          <Stack spacing={4} h="full" justify="space-between">
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={3}>
              <Heading size="sm" color="gray.800" noOfLines={2} pr={1}>
                {recipe.nombre}
              </Heading>

              <Menu placement="bottom-end">
                <MenuButton
                  as={IconButton}
                  aria-label={`Acciones para ${recipe.nombre}`}
                  variant="ghost"
                  size="sm"
                  icon={<Box as="span" fontSize="xl" lineHeight="1">?</Box>}
                />
                <MenuList>
                  <MenuItem onClick={() => onAddToToday(recipe.id)}>Agregar al día actual</MenuItem>
                  <MenuItem onClick={() => onEdit(recipe)}>Editar</MenuItem>
                  <MenuItem color="red.500" onClick={() => deleteRecipe(recipe.id)}>
                    Eliminar
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>

            <Text fontSize="lg" fontWeight="semibold" color="green.700">
              {totals[recipe.id]?.toFixed(2) ?? "0.00"} kcal
            </Text>
          </Stack>
        </Box>
      ))}
    </SimpleGrid>
  );
};
