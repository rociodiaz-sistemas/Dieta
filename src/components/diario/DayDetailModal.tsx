import {
  Box,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { calculateJournalEntryCalories } from "../../utils/calorieCalculations";
import { formatLongDate } from "../../utils/date";
import { DailyIngredientEntryCard } from "./DailyIngredientEntryCard";
import { DailyRecipeEntryCard } from "./DailyRecipeEntryCard";

interface DayDetailModalProps {
  dateKey: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DayDetailModal = ({ dateKey, isOpen, onClose }: DayDetailModalProps) => {
  const { journalEntries, recipes, variants, addJournalIngredientEntry, addJournalRecipeEntry } = useAppContext();
  const [selectedRecipeId, setSelectedRecipeId] = useState("");

  const entries = useMemo(
    () => journalEntries.filter((entry) => entry.fecha === dateKey),
    [dateKey, journalEntries],
  );

  const totalCalories = useMemo(
    () => entries.reduce((sum, entry) => sum + calculateJournalEntryCalories(entry, variants), 0),
    [entries, variants],
  );

  if (!dateKey) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{formatLongDate(dateKey)}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack align="stretch" spacing={5}>
            <Box bg="green.50" rounded="xl" p={4}>
              <Text fontWeight="semibold">Total del día: {totalCalories.toFixed(2)} kcal</Text>
              <Text fontSize="sm" color="gray.600">
                {entries.length} entrada{entries.length === 1 ? "" : "s"} registrada{entries.length === 1 ? "" : "s"}
              </Text>
            </Box>

            <Stack direction={{ base: "column", lg: "row" }} spacing={4}>
              <Button colorScheme="green" onClick={() => addJournalIngredientEntry(dateKey)}>
                Agregar ingrediente
              </Button>
              <HStack align="stretch" spacing={3} flex="1">
                <Select
                  placeholder="Seleccionar receta base"
                  value={selectedRecipeId}
                  onChange={(event) => setSelectedRecipeId(event.target.value)}
                  bg="white"
                >
                  {recipes.map((recipe) => (
                    <option key={recipe.id} value={recipe.id}>
                      {recipe.nombre}
                    </option>
                  ))}
                </Select>
                <Button
                  colorScheme="green"
                  variant="outline"
                  onClick={() => {
                    if (!selectedRecipeId) {
                      return;
                    }
                    addJournalRecipeEntry(dateKey, selectedRecipeId);
                    setSelectedRecipeId("");
                  }}
                  isDisabled={!selectedRecipeId}
                >
                  Agregar receta
                </Button>
              </HStack>
            </Stack>

            <VStack align="stretch" spacing={4}>
              {entries.length === 0 ? (
                <Box borderWidth="1px" rounded="xl" p={6} bg="gray.50">
                  <Text color="gray.500">
                    Todavía no hay entradas en este día. Podés agregar ingredientes sueltos o una receta desde la base de datos.
                  </Text>
                </Box>
              ) : (
                entries.map((entry) =>
                  entry.tipo === "ingrediente" ? (
                    <DailyIngredientEntryCard key={entry.id} entry={entry} />
                  ) : (
                    <DailyRecipeEntryCard key={entry.id} entry={entry} />
                  ),
                )
              )}
            </VStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
