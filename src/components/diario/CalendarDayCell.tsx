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
}: CalendarDayCellProps) => {
  const hasEntries = entryCount > 0;

  return (
    <GridItem>
      <Box
        minH={{ base: "92px", md: "120px" }}
        p={3}
        rounded="xl"
        borderWidth="1px"
        borderColor={
          isToday ? "green.500" : hasEntries ? "#dff94e" : "gray.200"
        }
        bg={
          isToday
            ? "green.100"
            : hasEntries
              ? "#e5f1a345"
              : isCurrentMonth
                ? "white"
                : "gray.100"
        }
        opacity={isCurrentMonth ? 1 : 0.7}
        cursor="pointer"
        transition="all 0.2s ease"
        boxShadow={isToday ? "0 0 0 1px rgba(56, 161, 105, 0.25)" : "none"}
        _hover={{
          borderColor: "green.400",
          shadow: "sm",
          transform: "translateY(-1px)",
        }}
        onClick={onClick}
      >
        <VStack align="stretch" spacing={2} h="full" justify="space-between">
          <Text
            fontWeight={isToday ? "bold" : "semibold"}
            color={
              isToday ? "green.800" : isCurrentMonth ? "gray.800" : "gray.500"
            }
          >
            {dayNumber}
          </Text>
          <VStack align="stretch" spacing={1}>
            <Text
              fontSize="sm"
              color={isToday ? "green.800" : "brand.700"}
              fontWeight="semibold"
            >
              {totalCalories.toFixed(0)} kcal
            </Text>
            <Text fontSize="xs" color={isToday ? "green.700" : "gray.600"}>
              {entryCount} entrada{entryCount === 1 ? "" : "s"}
            </Text>
          </VStack>
        </VStack>
      </Box>
    </GridItem>
  );
};
