import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { IngredientFormValues } from "../../types/models";

interface IngredientFormProps {
  unitOptions: string[];
  initialValues?: IngredientFormValues;
  submitLabel: string;
  onSubmit: (values: IngredientFormValues) => void;
}

const EMPTY_VALUES: IngredientFormValues = {
  nombre: "",
  calorias: "",
  unidadBase: "g",
  cantidadBase: 100,
  notas: "",
};

export const IngredientForm = ({ unitOptions, initialValues, submitLabel, onSubmit }: IngredientFormProps) => {
  const [values, setValues] = useState<IngredientFormValues>(initialValues ?? EMPTY_VALUES);

  const isValid = useMemo(
    () =>
      values.nombre.trim().length > 0 &&
      Number(values.calorias) > 0 &&
      Number(values.cantidadBase) > 0 &&
      values.unidadBase.length > 0,
    [values],
  );

  return (
    <VStack spacing={4} align="stretch">
      <FormControl isRequired>
        <FormLabel>Nombre</FormLabel>
        <Input
          value={values.nombre}
          onChange={(event) => setValues((current) => ({ ...current, nombre: event.target.value }))}
          bg="white"
        />
      </FormControl>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
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
      </SimpleGrid>

      <FormControl>
        <FormLabel>Notas</FormLabel>
        <Textarea
          value={values.notas}
          onChange={(event) => setValues((current) => ({ ...current, notas: event.target.value }))}
          bg="white"
          resize="vertical"
        />
      </FormControl>

      <Box>
        <Button colorScheme="green" onClick={() => onSubmit(values)} isDisabled={!isValid}>
          {submitLabel}
        </Button>
      </Box>
    </VStack>
  );
};
