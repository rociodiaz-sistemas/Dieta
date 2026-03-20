import {
  Box,
  Button,
  HStack,
  Input,
  Select,
  SimpleGrid,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { IngredientFormValues, IngredientNode } from "../../types/models";

interface IngredientNodeCardProps {
  ingredient: IngredientNode;
  unitOptions: string[];
  onSave: (values: IngredientFormValues) => void;
  onDelete: () => void;
}

export const IngredientNodeCard = ({ ingredient, unitOptions, onSave, onDelete }: IngredientNodeCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [values, setValues] = useState<IngredientFormValues>({
    nombre: ingredient.nombre,
    calorias: ingredient.calorias,
    unidadBase: ingredient.unidadBase,
    cantidadBase: ingredient.cantidadBase,
    notas: ingredient.notas ?? "",
  });

  const handleSave = () => {
    onSave(values);
    setIsEditing(false);
  };

  return (
    <Box borderWidth="1px" borderColor="green.200" bg="green.50" rounded="lg" p={4}>
      {isEditing ? (
        <VStack spacing={3} align="stretch">
          <Input
            value={values.nombre}
            onChange={(event) => setValues((current) => ({ ...current, nombre: event.target.value }))}
            bg="white"
          />
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3}>
            <Input
              type="number"
              min={0}
              value={values.calorias}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  calorias: event.target.value === "" ? "" : Number(event.target.value),
                }))
              }
              bg="white"
            />
            <Select
              value={values.unidadBase}
              onChange={(event) => setValues((current) => ({ ...current, unidadBase: event.target.value }))}
              bg="white"
            >
              {unitOptions.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </Select>
            <Input
              type="number"
              min={0}
              value={values.cantidadBase}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  cantidadBase: event.target.value === "" ? "" : Number(event.target.value),
                }))
              }
              bg="white"
            />
          </SimpleGrid>
          <Textarea
            value={values.notas}
            onChange={(event) => setValues((current) => ({ ...current, notas: event.target.value }))}
            bg="white"
          />
          <HStack>
            <Button size="sm" colorScheme="green" onClick={handleSave}>
              Guardar
            </Button>
            <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
              Cancelar
            </Button>
          </HStack>
        </VStack>
      ) : (
        <VStack spacing={2} align="stretch">
          <Text fontWeight="semibold">{ingredient.nombre}</Text>
          <Text fontSize="sm" color="gray.700">
            {ingredient.calorias} calorías por {ingredient.cantidadBase} {ingredient.unidadBase}
          </Text>
          <Text fontSize="sm" color="gray.600">
            {ingredient.notas || "Sin notas"}
          </Text>
          <HStack>
            <Button size="xs" variant="outline" onClick={() => setIsEditing(true)}>
              Editar
            </Button>
            <Button size="xs" colorScheme="red" variant="outline" onClick={onDelete}>
              Eliminar
            </Button>
          </HStack>
        </VStack>
      )}
    </Box>
  );
};
