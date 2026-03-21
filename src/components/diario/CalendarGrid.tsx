import { Box, Grid, GridItem, HStack, IconButton, Text, VStack } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { CalendarDayCell } from "./CalendarDayCell";
import { MonthlyCalorieTarget } from "../../types/models";
import { DEFAULT_MONTHLY_CALORIE_TARGET } from "../../utils/constants";
import { WEEKDAY_NAMES, buildCalendarDays, formatDateKey, formatMonthKey, getMonthLabel } from "../../utils/date";

interface CalendarGridProps {
  year: number;
  month: number;
  todayKey: string;
  monthlyTargets: Record<string, MonthlyCalorieTarget>;
  dayStats: Record<string, { totalCalories: number; entryCount: number }>;
  onMonthChange: (payload: { year: number; month: number }) => void;
  onDayClick: (dateKey: string) => void;
}

const getDotColor = (entryCount: number, totalCalories: number, target: MonthlyCalorieTarget) => {
  if (entryCount === 0) {
    return "gray.400";
  }

  if (totalCalories <= target.goal) {
    return "hsl(120, 70%, 42%)";
  }

  const effectiveMaintenance = Math.max(target.maintenance, target.goal);

  if (totalCalories >= effectiveMaintenance) {
    return "hsl(0, 78%, 56%)";
  }

  const range = Math.max(effectiveMaintenance - target.goal, 1);
  const progress = (totalCalories - target.goal) / range;
  const hue = 120 * (1 - progress);

  return `hsl(${hue}, 78%, 48%)`;
};

export const CalendarGrid = ({ year, month, todayKey, monthlyTargets, dayStats, onMonthChange, onDayClick }: CalendarGridProps) => {
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
            const monthKey = formatMonthKey(day.getFullYear(), day.getMonth());
            const monthTarget = monthlyTargets[monthKey] ?? DEFAULT_MONTHLY_CALORIE_TARGET;
            const stats = dayStats[dateKey] ?? { totalCalories: 0, entryCount: 0 };

            return (
              <CalendarDayCell
                key={dateKey}
                dayNumber={day.getDate()}
                totalCalories={stats.totalCalories}
                entryCount={stats.entryCount}
                isCurrentMonth={day.getMonth() === month}
                isToday={dateKey === todayKey}
                dotColor={getDotColor(stats.entryCount, stats.totalCalories, monthTarget)}
                onClick={() => onDayClick(dateKey)}
              />
            );
          })}
        </Grid>
      </Box>
    </VStack>
  );
};
