import { Box, Button, FormControl, FormHelperText, FormLabel, Heading, Input, SimpleGrid, Stack, Switch, Text, useToast } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { PageContainer } from "../components/PageContainer";
import { RecipeForm } from "../components/recipes/RecipeForm";
import { RecipeList } from "../components/recipes/RecipeList";
import { useAppContext } from "../context/AppContext";
import { Recipe } from "../types/models";
import { calculateJournalEntryCalories } from "../utils/calorieCalculations";
import { formatDateKey, formatMonthKey } from "../utils/date";

export const RecetasPage = () => {
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [minCalories, setMinCalories] = useState<number | "">("");
  const [maxCalories, setMaxCalories] = useState<number | "">("");
  const [calorieAwareOnly, setCalorieAwareOnly] = useState(false);
  const toast = useToast();
  const { journalEntries, variants, monthlyCalorieGoals, addJournalRecipeEntry } = useAppContext();

  const showForm = isCreating || Boolean(editingRecipe);
  const today = new Date();
  const todayKey = formatDateKey(today);
  const currentMonthKey = formatMonthKey(today.getFullYear(), today.getMonth());
  const currentMonthGoal = monthlyCalorieGoals[currentMonthKey] ?? 1600;

  const consumedToday = useMemo(
    () =>
      journalEntries
        .filter((entry) => entry.fecha === todayKey)
        .reduce((sum, entry) => sum + calculateJournalEntryCalories(entry, variants), 0),
    [journalEntries, todayKey, variants],
  );

  const remainingCalories = currentMonthGoal - consumedToday;

  return (
    <PageContainer>
      <Stack spacing={6}>
        <Stack spacing={2}>
          <Heading color="gray.800">Recetas</Heading>
          <Text color="gray.600">
            Armá recetas usando la jerarquía de ingredientes y calculá calorías automáticamente.
          </Text>
        </Stack>

        <Box bg="white" borderWidth="1px" rounded="xl" p={5}>
          <Stack spacing={4}>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar por nombre"
                bg="white"
              />
              <Input
                type="number"
                min={0}
                value={minCalories}
                onChange={(event) => setMinCalories(event.target.value === "" ? "" : Number(event.target.value))}
                placeholder="Calorías mínimas"
                bg="white"
              />
              <Input
                type="number"
                min={0}
                value={maxCalories}
                onChange={(event) => setMaxCalories(event.target.value === "" ? "" : Number(event.target.value))}
                placeholder="Calorías máximas"
                bg="white"
              />
            </SimpleGrid>

            <FormControl display="flex" alignItems="flex-start">
              <Switch mt={1} mr={3} isChecked={calorieAwareOnly} onChange={(event) => setCalorieAwareOnly(event.target.checked)} colorScheme="green" />
              <Box>
                <FormLabel m={0}>Mostrar solo recetas que entren en mis calorías restantes de hoy</FormLabel>
                <FormHelperText m={0}>
                  Hoy consumiste {consumedToday.toFixed(2)} kcal. Te quedan {remainingCalories.toFixed(2)} kcal según la meta del mes actual.
                </FormHelperText>
              </Box>
            </FormControl>
          </Stack>
        </Box>

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
          searchTerm={searchTerm}
          minCalories={minCalories}
          maxCalories={maxCalories}
          remainingCalories={remainingCalories}
          calorieAwareOnly={calorieAwareOnly}
          onAddToToday={(recipeId) => {
            addJournalRecipeEntry(todayKey, recipeId);
            toast({
              title: "Agregado al día actual",
              description: "La receta se agregó como una copia editable para hoy.",
              status: "success",
              duration: 2500,
              isClosable: true,
            });
          }}
          onEdit={(recipe) => {
            setEditingRecipe(recipe);
            setIsCreating(false);
          }}
        />
      </Stack>
    </PageContainer>
  );
};
