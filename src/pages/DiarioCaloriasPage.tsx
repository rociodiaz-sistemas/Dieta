import { Box, FormControl, FormLabel, Heading, Input, Stack, Text, useDisclosure } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { CalendarGrid } from "../components/diario/CalendarGrid";
import { DayDetailModal } from "../components/diario/DayDetailModal";
import { PageContainer } from "../components/PageContainer";
import { useAppContext } from "../context/AppContext";
import { calculateJournalEntryCalories } from "../utils/calorieCalculations";
import { formatDateKey } from "../utils/date";

export const DiarioCaloriasPage = () => {
  const today = new Date();
  const todayKey = formatDateKey(today);
  const [visibleMonth, setVisibleMonth] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(todayKey);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { journalEntries, variants, dailyCalorieGoal, setDailyCalorieGoal } = useAppContext();

  const dayStats = useMemo(() => {
    return journalEntries.reduce<Record<string, { totalCalories: number; entryCount: number }>>((accumulator, entry) => {
      const current = accumulator[entry.fecha] ?? { totalCalories: 0, entryCount: 0 };
      accumulator[entry.fecha] = {
        totalCalories: current.totalCalories + calculateJournalEntryCalories(entry, variants),
        entryCount: current.entryCount + 1,
      };
      return accumulator;
    }, {});
  }, [journalEntries, variants]);

  return (
    <PageContainer>
      <Stack spacing={6}>
        <Stack spacing={2}>
          <Heading color="gray.800">Diario de calorías</Heading>
          <Text color="gray.600">
            Registrá lo que comés cada día desde un calendario, con totales visibles por jornada y detalle editable en cada fecha.
          </Text>
        </Stack>

        <Box bg="white" borderWidth="1px" rounded="xl" p={5}>
          <FormControl maxW="280px">
            <FormLabel>Meta diaria de calorías</FormLabel>
            <Input
              type="number"
              min={0}
              value={dailyCalorieGoal}
              onChange={(event) => setDailyCalorieGoal(Number(event.target.value) || 0)}
              bg="white"
            />
          </FormControl>
        </Box>

        <CalendarGrid
          year={visibleMonth.year}
          month={visibleMonth.month}
          todayKey={todayKey}
          dailyGoal={dailyCalorieGoal}
          dayStats={dayStats}
          onMonthChange={setVisibleMonth}
          onDayClick={(dateKey) => {
            setSelectedDate(dateKey);
            onOpen();
          }}
        />

        <DayDetailModal dateKey={selectedDate} isOpen={isOpen} onClose={onClose} />
      </Stack>
    </PageContainer>
  );
};
