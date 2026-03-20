import { Box, Button, Heading, HStack, Input, Text, VStack } from "@chakra-ui/react";
import { useMemo } from "react";
import { useAppContext } from "../../context/AppContext";
import { JournalIngredientEntry } from "../../types/models";
import { calculateRecipeIngredientCalories } from "../../utils/calorieCalculations";
import { RecipeIngredientRow } from "../recipes/RecipeIngredientRow";

interface DailyIngredientEntryCardProps {
  entry: JournalIngredientEntry;
}

export const DailyIngredientEntryCard = ({ entry }: DailyIngredientEntryCardProps) => {
  const { variants, updateJournalIngredientEntry, deleteJournalEntry } = useAppContext();
  const result = useMemo(() => calculateRecipeIngredientCalories(entry.item, variants), [entry.item, variants]);

  return (
    <Box borderWidth="1px" rounded="xl" p={4} bg="white">
      <VStack align="stretch" spacing={3}>
        <HStack justify="space-between">
          <Heading size="sm">Ingrediente individual</Heading>
          <Button size="sm" variant="ghost" colorScheme="red" onClick={() => deleteJournalEntry(entry.id)}>
            Eliminar
          </Button>
        </HStack>
        <RecipeIngredientRow
          item={entry.item}
          onChange={(item) => updateJournalIngredientEntry(entry.id, item)}
          onDelete={() => deleteJournalEntry(entry.id)}
        />
        <Text fontSize="sm" color="gray.600">
          Total de esta entrada: {result.total.toFixed(2)} kcal
        </Text>
        {result.warning ? (
          <Text fontSize="sm" color="orange.500">
            {result.warning}
          </Text>
        ) : null}
      </VStack>
    </Box>
  );
};
