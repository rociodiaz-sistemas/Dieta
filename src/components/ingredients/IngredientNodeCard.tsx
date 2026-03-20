import {
  Box,
  Button,
  Collapse,
  HStack,
  Input,
  Select,
  SimpleGrid,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { IngredientFormValues, IngredientNode } from "../../types/models";

interface IngredientNodeCardProps {
  ingredient: IngredientNode;
  unitOptions: string[];
  depth?: number;
  isSelected?: boolean;
  onSelect: () => void;
  onSave: (values: IngredientFormValues) => void;
  onDelete: () => void;
}

export const IngredientNodeCard = ({
  ingredient,
  unitOptions,
  depth = 0,
  isSelected = false,
  onSelect,
  onSave,
  onDelete,
}: IngredientNodeCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [values, setValues] = useState<IngredientFormValues>({
    nombre: ingredient.nombre,
    calorias: ingredient.calorias,
    unidadBase: ingredient.unidadBase,
    cantidadBase: ingredient.cantidadBase,
    notas: ingredient.notas ?? "",
  });

  useEffect(() => {
    setValues({
      nombre: ingredient.nombre,
      calorias: ingredient.calorias,
      unidadBase: ingredient.unidadBase,
      cantidadBase: ingredient.cantidadBase,
      notas: ingredient.notas ?? "",
    });
  }, [ingredient]);

  const handleSave = () => {
    onSave(values);
    setIsEditing(false);
  };

  return (
    <Box>
      <Box pl={`${depth * 14}px`}>
        <HStack
          spacing={2}
          px={2}
          py={2}
          rounded="md"
          borderWidth="1px"
          borderColor={isSelected ? "green.200" : "transparent"}
          bg={isSelected ? "green.50" : "transparent"}
          cursor="pointer"
          transition="all 0.2s ease"
          _hover={{
            bg: isSelected ? "green.50" : "gray.50",
            borderColor: isSelected ? "green.200" : "gray.200",
          }}
          onClick={onSelect}
        >
          <Box w={6} display="flex" justifyContent="center" color="gray.400">
            <Text fontSize="lg" lineHeight="1">
              •
            </Text>
          </Box>

          <Box
            w="10px"
            h="12px"
            rounded="sm"
            bg="blue.400"
            borderWidth="1px"
            borderColor="blue.600"
            flexShrink={0}
          />

          <Box flex="1" minW={0}>
            <Text
              fontWeight={isSelected ? "semibold" : "medium"}
              color="gray.800"
              noOfLines={1}
            >
              {ingredient.nombre}
            </Text>
            <Text fontSize="sm" color="gray.600" noOfLines={1}>
              {ingredient.calorias} calorías por {ingredient.cantidadBase}{" "}
              {ingredient.unidadBase}
            </Text>
          </Box>

          <HStack spacing={2} onClick={(event) => event.stopPropagation()}>
            <Button
              size="xs"
              variant="ghost"
              onClick={() => setIsEditing((current) => !current)}
            >
              {isEditing ? "Cerrar" : "Editar"}
            </Button>
            <Button
              size="xs"
              variant="ghost"
              colorScheme="red"
              onClick={onDelete}
            >
              Eliminar
            </Button>
          </HStack>
        </HStack>
      </Box>

      <Collapse in={isEditing} animateOpacity>
        <Box
          ml={`${depth * 24 + 32}px`}
          mt={2}
          borderWidth="1px"
          borderColor="blue.100"
          bg="blue.50"
          rounded="lg"
          p={4}
        >
          <VStack spacing={3} align="stretch">
            <Input
              value={values.nombre}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  nombre: event.target.value,
                }))
              }
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
                    calorias:
                      event.target.value === ""
                        ? ""
                        : Number(event.target.value),
                  }))
                }
                bg="white"
              />
              <Select
                value={values.unidadBase}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    unidadBase: event.target.value,
                  }))
                }
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
                    cantidadBase:
                      event.target.value === ""
                        ? ""
                        : Number(event.target.value),
                  }))
                }
                bg="white"
              />
            </SimpleGrid>
            <Textarea
              value={values.notas}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  notas: event.target.value,
                }))
              }
              bg="white"
            />
            <HStack>
              <Button size="sm" colorScheme="green" onClick={handleSave}>
                Guardar
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancelar
              </Button>
            </HStack>
          </VStack>
        </Box>
      </Collapse>
    </Box>
  );
};
