import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Input,
  Select,
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
  const { ingredients, variants, unitOptions } = useAppContext();
  const ingredient = ingredients.find((candidate) => candidate.id === item.ingredientId);
  const variantOptions = useMemo(
    () => variants.filter((variant) => variant.ingredientId === item.ingredientId),
    [item.ingredientId, variants],
  );
  const variant = variantOptions.find((candidate) => candidate.id === item.variantId);

  const calculation = useMemo(() => {
    if (!variant || item.cantidad === "" || Number(item.cantidad) <= 0) {
      return { total: null as number | null, warning: "" };
    }

    const convertedAmount = convertToBaseUnit(Number(item.cantidad), item.unidad, variant.unidadBase);

    if (convertedAmount === null) {
      return {
        total: null,
        warning: `No se puede convertir ${item.unidad} a ${variant.unidadBase}.`,
      };
    }

    const total = (variant.calorias * convertedAmount) / variant.cantidadBase;
    return { total, warning: "" };
  }, [item.cantidad, item.unidad, variant]);

  return (
    <Box borderWidth="1px" borderColor="gray.200" rounded="xl" p={4} bg="white">
      <VStack align="stretch" spacing={4}>
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
          <VStack align="stretch" spacing={3}>
            <IngredientSelector
              value={item.path}
              selectedIngredientId={item.ingredientId}
              onChange={({ path, ingredientId }) =>
                onChange({
                  ...item,
                  path,
                  ingredientId,
                  variantId: null,
                })
              }
            />
            <Select
              value={item.variantId ?? ""}
              placeholder="Seleccionar marca o variante"
              onChange={(event) =>
                onChange({
                  ...item,
                  variantId: event.target.value || null,
                })
              }
              bg="white"
              isDisabled={!item.ingredientId}
            >
              {variantOptions.map((variantOption) => (
                <option key={variantOption.id} value={variantOption.id}>
                  {variantOption.marca}
                </option>
              ))}
            </Select>
          </VStack>

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

        {ingredient && variant ? (
          <Box bg="gray.50" p={3} rounded="md">
            <Text fontSize="sm" color="gray.700">
              Variante seleccionada: {ingredient.nombre} - {variant.marca}
            </Text>
            <Text fontSize="sm" color="gray.700" mt={1}>
              Base nutricional: {variant.calorias} calorías por {variant.cantidadBase} {variant.unidadBase}
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
        ) : ingredient ? (
          <Alert status="info" rounded="md">
            <AlertIcon />
            Seleccioná una variante o marca para calcular calorías.
          </Alert>
        ) : (
          <Alert status="info" rounded="md">
            <AlertIcon />
            Seleccioná un ingrediente base para continuar.
          </Alert>
        )}
      </VStack>
    </Box>
  );
};
