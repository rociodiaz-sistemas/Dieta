import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Input,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { useAppContext } from "../../context/AppContext";
import { RecipeIngredient } from "../../types/models";
import { convertToBaseUnit } from "../../utils/unitConversion";
import { IngredientSelector } from "./IngredientSelector";
import { UnitSelector } from "./UnitSelector";

interface RecipeIngredientRowProps {
  item: RecipeIngredient;
  onChange: (item: RecipeIngredient) => void;
  onDelete: () => void;
}

export const RecipeIngredientRow = ({ item, onChange, onDelete }: RecipeIngredientRowProps) => {
  const { ingredients, unitOptions } = useAppContext();
  const ingredient = ingredients.find((candidate) => candidate.id === item.ingredientId);

  const calculation = useMemo(() => {
    if (!ingredient || item.cantidad === "" || Number(item.cantidad) <= 0) {
      return { total: null as number | null, warning: "" };
    }

    const convertedAmount = convertToBaseUnit(Number(item.cantidad), item.unidad, ingredient.unidadBase);

    if (convertedAmount === null) {
      return {
        total: null,
        warning: `No se puede convertir ${item.unidad} a ${ingredient.unidadBase}.`,
      };
    }

    const total = (ingredient.calorias * convertedAmount) / ingredient.cantidadBase;
    return { total, warning: "" };
  }, [ingredient, item.cantidad, item.unidad]);

  return (
    <Box borderWidth="1px" borderColor="gray.200" rounded="xl" p={4} bg="white">
      <VStack align="stretch" spacing={4}>
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
          <IngredientSelector
            value={item.path}
            selectedIngredientId={item.ingredientId}
            onChange={({ path, ingredientId }) =>
              onChange({
                ...item,
                path,
                ingredientId,
              })
            }
          />
          <VStack align="stretch" spacing={3}>
            <Input
              type="number"
              min={0}
              value={item.cantidad}
              onChange={(event) =>
                onChange({
                  ...item,
                  cantidad: event.target.value === "" ? "" : Number(event.target.value),
                })
              }
              placeholder="Cantidad"
              bg="white"
            />
            <UnitSelector value={item.unidad} options={unitOptions} onChange={(unidad) => onChange({ ...item, unidad })} />
            <Button alignSelf="flex-start" size="sm" colorScheme="red" variant="outline" onClick={onDelete}>
              Eliminar
            </Button>
          </VStack>
        </SimpleGrid>

        {ingredient ? (
          <Box bg="gray.50" p={3} rounded="md">
            <Text fontSize="sm" color="gray.700">
              Base nutricional: {ingredient.calorias} calorías por {ingredient.cantidadBase} {ingredient.unidadBase}
            </Text>
            {calculation.warning ? (
              <Alert status="warning" mt={3} rounded="md">
                <AlertIcon />
                {calculation.warning}
              </Alert>
            ) : (
              <Text fontWeight="semibold" mt={3}>
                Calorías calculadas: {calculation.total?.toFixed(2) ?? "0.00"}
              </Text>
            )}
          </Box>
        ) : (
          <Alert status="info" rounded="md">
            <AlertIcon />
            Seleccioná un ingrediente final para calcular calorías.
          </Alert>
        )}
      </VStack>
    </Box>
  );
};
