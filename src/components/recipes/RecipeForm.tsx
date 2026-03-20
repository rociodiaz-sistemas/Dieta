import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Heading,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { Recipe } from "../../types/models";
import { createId } from "../../utils/id";
import { convertToBaseUnit } from "../../utils/unitConversion";
import { RecipeIngredientRow } from "./RecipeIngredientRow";

interface RecipeFormProps {
  initialRecipe?: Recipe | null;
  onClose: () => void;
}

export const RecipeForm = ({ initialRecipe, onClose }: RecipeFormProps) => {
  const { variants, createEmptyRecipeIngredient, saveRecipe } = useAppContext();
  const [nombre, setNombre] = useState(initialRecipe?.nombre ?? "");
  const [items, setItems] = useState(
    initialRecipe?.ingredientes.length ? initialRecipe.ingredientes : [createEmptyRecipeIngredient()],
  );
  const [showValidation, setShowValidation] = useState(false);

  const totalCalories = useMemo(
    () =>
      items.reduce((accumulator, item) => {
        const variant = variants.find((candidate) => candidate.id === item.variantId);
        if (!variant || item.cantidad === "") {
          return accumulator;
        }

        const convertedAmount = convertToBaseUnit(Number(item.cantidad), item.unidad, variant.unidadBase);

        if (convertedAmount === null) {
          return accumulator;
        }

        return accumulator + (variant.calorias * convertedAmount) / variant.cantidadBase;
      }, 0),
    [items, variants],
  );

  const isValid =
    nombre.trim().length > 0 &&
    items.length > 0 &&
    items.every(
      (item) =>
        item.ingredientId &&
        item.variantId &&
        item.path.length > 0 &&
        item.cantidad !== "" &&
        Number(item.cantidad) > 0 &&
        item.unidad,
    );

  return (
    <Box bg="white" borderWidth="1px" rounded="xl" p={6}>
      <VStack align="stretch" spacing={5}>
        <Heading size="md">{initialRecipe ? "Editar receta" : "Nueva receta"}</Heading>

        <Input value={nombre} onChange={(event) => setNombre(event.target.value)} placeholder="Nombre de la receta" bg="white" />

        <VStack align="stretch" spacing={4}>
          {items.map((item) => (
            <RecipeIngredientRow
              key={item.id}
              item={item}
              onChange={(nextItem) =>
                setItems((current) => current.map((candidate) => (candidate.id === item.id ? nextItem : candidate)))
              }
              onDelete={() =>
                setItems((current) =>
                  current.length === 1 ? [createEmptyRecipeIngredient()] : current.filter((candidate) => candidate.id !== item.id),
                )
              }
            />
          ))}
        </VStack>

        <Button alignSelf="flex-start" variant="outline" colorScheme="green" onClick={() => setItems((current) => [...current, createEmptyRecipeIngredient()])}>
          Agregar ingrediente
        </Button>

        {!isValid && showValidation ? (
          <Alert status="warning" rounded="md">
            <AlertIcon />
            Completá el nombre, la ruta jerárquica, el ingrediente base, la variante, la cantidad y la unidad.
          </Alert>
        ) : null}

        <Box bg="green.50" rounded="lg" p={4}>
          <Text fontWeight="semibold">Total de calorías: {totalCalories.toFixed(2)}</Text>
        </Box>

        <Box display="flex" gap={3} flexWrap="wrap">
          <Button
            colorScheme="green"
            onClick={() => {
              if (!isValid) {
                setShowValidation(true);
                return;
              }

              saveRecipe({
                id: initialRecipe?.id ?? createId(),
                nombre: nombre.trim(),
                ingredientes: items,
              });
              onClose();
            }}
          >
            Guardar receta
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        </Box>
      </VStack>
    </Box>
  );
};
