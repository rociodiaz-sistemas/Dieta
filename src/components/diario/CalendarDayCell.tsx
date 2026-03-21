import { Box, GridItem, Text, VStack } from "@chakra-ui/react";

interface CalendarDayCellProps {
  dayNumber: number;
  totalCalories: number;
  entryCount: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  dotColor: string;
  onClick: () => void;
}

export const CalendarDayCell = ({
  dayNumber,
  totalCalories,
  entryCount,
  isCurrentMonth,
  isToday,
  dotColor,
  onClick,
}: CalendarDayCellProps) => {
  return (
    <GridItem>
      <Box
        position="relative"
        minH={{ base: "92px", md: "120px" }}
        p={3}
        rounded="xl"
        borderWidth="1px"
        borderColor={isToday ? "blue.500" : "gray.200"}
        bg={isToday ? "blue.100" : isCurrentMonth ? "white" : "gray.100"}
        opacity={isCurrentMonth ? 1 : 0.7}
        cursor="pointer"
        transition="all 0.2s ease"
        boxShadow={isToday ? "0 0 0 1px rgba(66, 153, 225, 0.25)" : "none"}
        _hover={{
          borderColor: "blue.300",
          shadow: "sm",
          transform: "translateY(-1px)",
        }}
        onClick={onClick}
      >
        <Box position="absolute" top={3} right={3} w="10px" h="10px" rounded="full" bg={dotColor} />
        <VStack align="stretch" spacing={2} h="full" justify="space-between">
          <Text fontWeight={isToday ? "bold" : "semibold"} color={isToday ? "blue.800" : isCurrentMonth ? "gray.800" : "gray.500"}>
            {dayNumber}
          </Text>
          <VStack align="stretch" spacing={1}>
            <Text fontSize="sm" color={isToday ? "blue.800" : "brand.700"} fontWeight="semibold">
              {totalCalories.toFixed(0)} kcal
            </Text>
            <Text fontSize="xs" color={isToday ? "blue.700" : "gray.600"}>
              {entryCount} entrada{entryCount === 1 ? "" : "s"}
            </Text>
          </VStack>
        </VStack>
      </Box>
    </GridItem>
  );
};
