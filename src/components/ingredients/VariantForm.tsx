import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
  VStack,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { VariantFormValues } from "../../types/models";

interface VariantFormProps {
  unitOptions: string[];
  initialValues?: VariantFormValues;
  submitLabel: string;
  onSubmit: (values: VariantFormValues) => void;
  onCancel?: () => void;
}

const EMPTY_VALUES: VariantFormValues = {
  marca: "N/A",
  calorias: "",
  unidadBase: "g",
  cantidadBase: 100,
};

export const VariantForm = ({ unitOptions, initialValues, submitLabel, onSubmit, onCancel }: VariantFormProps) => {
  const [values, setValues] = useState<VariantFormValues>(initialValues ?? EMPTY_VALUES);

  const isValid = useMemo(
    () => values.marca.trim().length > 0 && Number(values.cantidadBase) > 0 && Number(values.calorias) >= 0,
    [values],
  );

  return (
    <VStack align="stretch" spacing={3}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
        <FormControl isRequired>
          <FormLabel>Marca o variante</FormLabel>
          <Input
            value={values.marca}
            onChange={(event) => setValues((current) => ({ ...current, marca: event.target.value }))}
            bg="white"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Calorías</FormLabel>
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
        </FormControl>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
        <FormControl isRequired>
          <FormLabel>Cantidad base</FormLabel>
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
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Unidad base</FormLabel>
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
        </FormControl>
      </SimpleGrid>

      <Box display="flex" gap={3} flexWrap="wrap">
        <Button colorScheme="green" size="sm" onClick={() => onSubmit(values)} isDisabled={!isValid}>
          {submitLabel}
        </Button>
        {onCancel ? (
          <Button size="sm" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        ) : null}
      </Box>
    </VStack>
  );
};
