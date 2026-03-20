import { Box, GridItem, Text, VStack } from "@chakra-ui/react";

interface CalendarDayCellProps {
  dayNumber: number;
  totalCalories: number;
  entryCount: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  onClick: () => void;
}

export const CalendarDayCell = ({
  dayNumber,
  totalCalories,
  entryCount,
  isCurrentMonth,
  isToday,
  onClick,
}: CalendarDayCellProps) => (
  <GridItem>
    <Box
      minH={{ base: "92px", md: "120px" }}
      p={3}
      rounded="xl"
      borderWidth="1px"
      borderColor={isToday ? "green.300" : "gray.200"}
      bg={isCurrentMonth ? "white" : "gray.100"}
      opacity={isCurrentMonth ? 1 : 0.7}
      cursor="pointer"
      transition="all 0.2s ease"
      _hover={{ borderColor: "green.300", shadow: "sm", transform: "translateY(-1px)" }}
      onClick={onClick}
    >
      <VStack align="stretch" spacing={2} h="full" justify="space-between">
        <Text fontWeight={isToday ? "bold" : "semibold"} color={isCurrentMonth ? "gray.800" : "gray.500"}>
          {dayNumber}
        </Text>
        <VStack align="stretch" spacing={1}>
          <Text fontSize="sm" color="brand.700" fontWeight="semibold">
            {totalCalories.toFixed(0)} kcal
          </Text>
          <Text fontSize="xs" color="gray.600">
            {entryCount} entrada{entryCount === 1 ? "" : "s"}
          </Text>
        </VStack>
      </VStack>
    </Box>
  </GridItem>
);
