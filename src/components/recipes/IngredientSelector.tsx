import { Alert, AlertIcon, Select, Text, VStack } from "@chakra-ui/react";
import { useMemo } from "react";
import { useAppContext } from "../../context/AppContext";
import { CategoryNode, IngredientNode } from "../../types/models";

interface IngredientSelectorProps {
  value: string[];
  selectedIngredientId: string | null;
  onChange: (payload: { path: string[]; ingredientId: string | null }) => void;
}

const getCategoryByName = (categories: CategoryNode[], name: string, parentId: string | null) =>
  categories.find((category) => category.nombre === name && category.parentId === parentId);

export const IngredientSelector = ({ value, selectedIngredientId, onChange }: IngredientSelectorProps) => {
  const { categories, ingredients } = useAppContext();

  const steps = useMemo(() => {
    const result: Array<{ parentId: string | null; options: CategoryNode[]; stepLabel: string }> = [];
    let currentParentId: string | null = null;
    let level = 0;

    while (true) {
      const options = categories.filter((category) => category.parentId === currentParentId);
      if (options.length === 0) {
        break;
      }

      result.push({
        parentId: currentParentId,
        options,
        stepLabel: level === 0 ? "Categoría principal" : `Subcategoría ${level}`,
      });

      const selectedName = value[level];
      const selectedCategory: CategoryNode | undefined = selectedName
        ? getCategoryByName(categories, selectedName, currentParentId)
        : undefined;

      if (!selectedCategory) {
        break;
      }

      currentParentId = selectedCategory.id;
      level += 1;
    }

    return result;
  }, [categories, value]);

  const lastSelectedCategory = useMemo(() => {
    if (value.length === 0) {
      return null;
    }

    let parentId: string | null = null;
    let lastCategory: CategoryNode | null = null;

    for (const name of value) {
      const current = getCategoryByName(categories, name, parentId);
      if (!current) {
        return null;
      }
      lastCategory = current;
      parentId = current.id;
    }

    return lastCategory;
  }, [categories, value]);

  const ingredientOptions = useMemo(() => {
    if (!lastSelectedCategory) {
      return [] as IngredientNode[];
    }

    return ingredients.filter((ingredient) => ingredient.parentId === lastSelectedCategory.id);
  }, [ingredients, lastSelectedCategory]);

  return (
    <VStack align="stretch" spacing={3}>
      {steps.map((step, index) => (
        <Select
          key={`${step.parentId ?? "root"}-${index}`}
          value={value[index] ?? ""}
          placeholder={`Seleccionar ${step.stepLabel.toLowerCase()}`}
          onChange={(event) => {
            const nextValue = [...value.slice(0, index), event.target.value].filter(Boolean);
            onChange({ path: nextValue, ingredientId: null });
          }}
          bg="white"
        >
          {step.options.map((option) => (
            <option key={option.id} value={option.nombre}>
              {option.nombre}
            </option>
          ))}
        </Select>
      ))}

      {lastSelectedCategory ? (
        <>
          <Text fontSize="sm" color="gray.600">
            Ingrediente base
          </Text>
          <Select
            value={selectedIngredientId ?? ""}
            placeholder="Seleccionar ingrediente base"
            onChange={(event) =>
              onChange({
                path: value,
                ingredientId: event.target.value || null,
              })
            }
            bg="white"
          >
            {ingredientOptions.map((ingredient) => (
              <option key={ingredient.id} value={ingredient.id}>
                {ingredient.nombre}
              </option>
            ))}
          </Select>
          {ingredientOptions.length === 0 ? (
            <Alert status="warning" rounded="md">
              <AlertIcon />
              No hay ingredientes base dentro de esta rama.
            </Alert>
          ) : null}
        </>
      ) : (
        <Alert status="info" rounded="md">
          <AlertIcon />
          Elegí una ruta completa para llegar al ingrediente base.
        </Alert>
      )}
    </VStack>
  );
};
