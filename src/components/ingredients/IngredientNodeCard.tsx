import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Collapse,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { IngredientEditValues, IngredientNode } from "../../types/models";
import { IngredientVariantCard } from "./IngredientVariantCard";
import { VariantForm } from "./VariantForm";

interface IngredientNodeCardProps {
  ingredient: IngredientNode;
  depth?: number;
  isSelected?: boolean;
  onSelect: () => void;
  onSave: (values: IngredientEditValues) => void;
  onDelete: () => void;
}

export const IngredientNodeCard = ({
  ingredient,
  depth = 0,
  isSelected = false,
  onSelect,
  onSave,
  onDelete,
}: IngredientNodeCardProps) => {
  const { unitOptions, variants, addVariant, updateVariant, deleteVariant } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [values, setValues] = useState<IngredientEditValues>({
    nombre: ingredient.nombre,
    notas: ingredient.notas ?? "",
  });

  useEffect(() => {
    setValues({
      nombre: ingredient.nombre,
      notas: ingredient.notas ?? "",
    });
  }, [ingredient]);

  const ingredientVariants = useMemo(
    () => variants.filter((variant) => variant.ingredientId === ingredient.id),
    [ingredient.id, variants],
  );

  const handleSave = () => {
    onSave(values);
    setIsEditing(false);
  };

  return (
    <Box>
      <Box pl={`${depth * 24}px`}>
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
          _hover={{ bg: isSelected ? "green.50" : "gray.50", borderColor: isSelected ? "green.200" : "gray.200" }}
          onClick={onSelect}
        >
          <Box w={6} display="flex" justifyContent="center" color="gray.400">
            <Text fontSize="lg" lineHeight="1">
              •
            </Text>
          </Box>

          <Box w="10px" h="12px" rounded="sm" bg="blue.400" borderWidth="1px" borderColor="blue.600" flexShrink={0} />

          <Box flex="1" minW={0}>
            <Text fontWeight={isSelected ? "semibold" : "medium"} color="gray.800" noOfLines={1}>
              {ingredient.nombre}
            </Text>
            <Text fontSize="sm" color="gray.600" noOfLines={1}>
              {ingredientVariants.length} variante{ingredientVariants.length === 1 ? "" : "s"}
            </Text>
          </Box>

          <HStack spacing={2} onClick={(event) => event.stopPropagation()}>
            <Button size="xs" variant="ghost" onClick={() => setIsEditing((current) => !current)}>
              {isEditing ? "Cerrar" : "Gestionar"}
            </Button>
            <Button size="xs" variant="ghost" colorScheme="red" onClick={onDelete}>
              Eliminar
            </Button>
          </HStack>
        </HStack>
      </Box>

      <Collapse in={isEditing} animateOpacity>
        <Box ml={`${depth * 24 + 32}px`} mt={2} borderWidth="1px" borderColor="blue.100" bg="blue.50" rounded="lg" p={4}>
          <VStack spacing={4} align="stretch">
            <Text fontWeight="semibold" color="gray.800">
              Detalle del ingrediente base
            </Text>

            <FormControl isRequired>
              <FormLabel>Nombre</FormLabel>
              <Input
                value={values.nombre}
                onChange={(event) => setValues((current) => ({ ...current, nombre: event.target.value }))}
                bg="white"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Notas</FormLabel>
              <Textarea
                value={values.notas}
                onChange={(event) => setValues((current) => ({ ...current, notas: event.target.value }))}
                bg="white"
                resize="vertical"
              />
            </FormControl>

            <HStack>
              <Button size="sm" colorScheme="green" onClick={handleSave}>
                Guardar ingrediente
              </Button>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
            </HStack>

            <Box pt={2}>
              <HStack justify="space-between" align="center" mb={3}>
                <Text fontWeight="semibold" color="gray.800">
                  Variantes y marcas
                </Text>
                <Button size="sm" variant="outline" colorScheme="green" onClick={() => setShowVariantForm((current) => !current)}>
                  Agregar variante
                </Button>
              </HStack>

              <Collapse in={showVariantForm} animateOpacity>
                <Box mb={4} rounded="lg" borderWidth="1px" borderColor="green.100" bg="whiteAlpha.700" p={4}>
                  <VariantForm
                    unitOptions={unitOptions}
                    submitLabel="Guardar variante"
                    onSubmit={(variantValues) => {
                      addVariant(ingredient.id, variantValues);
                      setShowVariantForm(false);
                    }}
                    onCancel={() => setShowVariantForm(false)}
                  />
                </Box>
              </Collapse>

              <VStack align="stretch" spacing={3}>
                {ingredientVariants.map((variant) => (
                  <IngredientVariantCard
                    key={variant.id}
                    variant={variant}
                    unitOptions={unitOptions}
                    canDelete={ingredientVariants.length > 1}
                    onSave={(variantValues) => updateVariant(variant.id, variantValues)}
                    onDelete={() => deleteVariant(variant.id)}
                  />
                ))}
              </VStack>

              {ingredientVariants.length <= 1 ? (
                <Alert status="info" rounded="md" mt={4}>
                  <AlertIcon />
                  Cada ingrediente debe conservar al menos una variante disponible.
                </Alert>
              ) : null}
            </Box>
          </VStack>
        </Box>
      </Collapse>
    </Box>
  );
};
