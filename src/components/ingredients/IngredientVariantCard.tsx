import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { IngredientVariant, VariantFormValues } from "../../types/models";
import { VariantForm } from "./VariantForm";

interface IngredientVariantCardProps {
  variant: IngredientVariant;
  unitOptions: string[];
  canDelete: boolean;
  onSave: (values: VariantFormValues) => void;
  onDelete: () => void;
}

export const IngredientVariantCard = ({ variant, unitOptions, canDelete, onSave, onDelete }: IngredientVariantCardProps) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Box rounded="lg" borderWidth="1px" borderColor="gray.200" bg="white" p={4}>
      {isEditing ? (
        <VariantForm
          unitOptions={unitOptions}
          initialValues={{
            marca: variant.marca,
            calorias: variant.calorias,
            unidadBase: variant.unidadBase,
            cantidadBase: variant.cantidadBase,
          }}
          submitLabel="Guardar variante"
          onSubmit={(values) => {
            onSave(values);
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <HStack justify="space-between" align="start" spacing={4}>
          <VStack align="stretch" spacing={1} flex="1">
            <Text fontWeight="semibold" color="gray.800">
              {variant.marca}
            </Text>
            <Text fontSize="sm" color="gray.600">
              {variant.calorias} calorías por {variant.cantidadBase} {variant.unidadBase}
            </Text>
          </VStack>
          <HStack>
            <Button size="xs" variant="ghost" onClick={() => setIsEditing(true)}>
              Editar
            </Button>
            <Button size="xs" variant="ghost" colorScheme="red" onClick={onDelete} isDisabled={!canDelete}>
              Eliminar
            </Button>
          </HStack>
        </HStack>
      )}
    </Box>
  );
};
