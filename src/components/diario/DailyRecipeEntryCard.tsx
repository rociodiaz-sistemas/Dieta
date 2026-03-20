import { Box, Button, Heading, HStack, Input, Text, VStack } from "@chakra-ui/react";
import { useMemo } from "react";
import { useAppContext } from "../../context/AppContext";
import { JournalRecipeEntry } from "../../types/models";
import { calculateRecipeCalories } from "../../utils/calorieCalculations";
import { RecipeIngredientRow } from "../recipes/RecipeIngredientRow";

interface DailyRecipeEntryCardProps {
  entry: JournalRecipeEntry;
}

export const DailyRecipeEntryCard = ({ entry }: DailyRecipeEntryCardProps) => {
  const { variants, createEmptyRecipeIngredient, updateJournalRecipeEntry, deleteJournalEntry } = useAppContext();
  const total = useMemo(() => calculateRecipeCalories(entry.recipe, variants), [entry.recipe, variants]);

  return (
    <Box borderWidth="1px" rounded="xl" p={4} bg="white">
      <VStack align="stretch" spacing={4}>
        <HStack justify="space-between" align="start">
          <VStack align="stretch" spacing={2} flex="1">
            <Heading size="sm">Receta del día</Heading>
            <Input
              value={entry.recipe.nombre}
              onChange={(event) =>
                updateJournalRecipeEntry(entry.id, {
                  ...entry.recipe,
                  nombre: event.target.value,
                })
              }
              placeholder="Nombre de la receta"
              bg="white"
            />
          </VStack>
          <Button size="sm" variant="ghost" colorScheme="red" onClick={() => deleteJournalEntry(entry.id)}>
            Eliminar
          </Button>
        </HStack>

        <VStack align="stretch" spacing={3}>
          {entry.recipe.ingredientes.map((item) => (
            <RecipeIngredientRow
              key={item.id}
              item={item}
              onChange={(nextItem) =>
                updateJournalRecipeEntry(entry.id, {
                  ...entry.recipe,
                  ingredientes: entry.recipe.ingredientes.map((candidate) =>
                    candidate.id === item.id ? nextItem : candidate,
                  ),
                })
              }
              onDelete={() =>
                updateJournalRecipeEntry(entry.id, {
                  ...entry.recipe,
                  ingredientes:
                    entry.recipe.ingredientes.length === 1
                      ? [createEmptyRecipeIngredient()]
                      : entry.recipe.ingredientes.filter((candidate) => candidate.id !== item.id),
                })
              }
            />
          ))}
        </VStack>

        <HStack justify="space-between" align="center">
          <Button
            size="sm"
            variant="outline"
            colorScheme="green"
            onClick={() =>
              updateJournalRecipeEntry(entry.id, {
                ...entry.recipe,
                ingredientes: [...entry.recipe.ingredientes, createEmptyRecipeIngredient()],
              })
            }
          >
            Agregar ingrediente
          </Button>
          <Text fontWeight="semibold" color="brand.700">
            Total: {total.toFixed(2)} kcal
          </Text>
        </HStack>
      </VStack>
    </Box>
  );
};
