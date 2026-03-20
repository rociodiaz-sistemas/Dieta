import { Box, Grid, GridItem, HStack, IconButton, Text, VStack } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { CalendarDayCell } from "./CalendarDayCell";
import { WEEKDAY_NAMES, buildCalendarDays, formatDateKey, getMonthLabel } from "../../utils/date";

interface CalendarGridProps {
  year: number;
  month: number;
  todayKey: string;
  dailyGoal: number;
  dayStats: Record<string, { totalCalories: number; entryCount: number }>;
  onMonthChange: (payload: { year: number; month: number }) => void;
  onDayClick: (dateKey: string) => void;
}

export const CalendarGrid = ({ year, month, todayKey, dailyGoal, dayStats, onMonthChange, onDayClick }: CalendarGridProps) => {
  const days = buildCalendarDays(year, month);

  return (
    <VStack align="stretch" spacing={4}>
      <HStack justify="space-between" bg="white" borderWidth="1px" rounded="xl" p={4}>
        <IconButton
          aria-label="Mes anterior"
          icon={<ChevronLeftIcon boxSize={5} />}
          variant="ghost"
          onClick={() => {
            const previous = new Date(year, month - 1, 1);
            onMonthChange({ year: previous.getFullYear(), month: previous.getMonth() });
          }}
        />
        <Text fontWeight="semibold" color="gray.800">
          {getMonthLabel(year, month)}
        </Text>
        <IconButton
          aria-label="Mes siguiente"
          icon={<ChevronRightIcon boxSize={5} />}
          variant="ghost"
          onClick={() => {
            const next = new Date(year, month + 1, 1);
            onMonthChange({ year: next.getFullYear(), month: next.getMonth() });
          }}
        />
      </HStack>

      <Box bg="white" borderWidth="1px" rounded="xl" p={4}>
        <Grid templateColumns="repeat(7, minmax(0, 1fr))" gap={3}>
          {WEEKDAY_NAMES.map((weekday) => (
            <GridItem key={weekday}>
              <Text textAlign="center" fontSize="sm" fontWeight="semibold" color="gray.500" py={2}>
                {weekday}
              </Text>
            </GridItem>
          ))}
          {days.map((day) => {
            const dateKey = formatDateKey(day);
            const stats = dayStats[dateKey] ?? { totalCalories: 0, entryCount: 0 };
            const status = stats.entryCount === 0 ? "sin-registro" : stats.totalCalories > dailyGoal ? "exceso" : "dentro-meta";

            return (
              <CalendarDayCell
                key={dateKey}
                dayNumber={day.getDate()}
                totalCalories={stats.totalCalories}
                entryCount={stats.entryCount}
                isCurrentMonth={day.getMonth() === month}
                isToday={dateKey === todayKey}
                status={status}
                onClick={() => onDayClick(dateKey)}
              />
            );
          })}
        </Grid>
      </Box>
    </VStack>
  );
};
