import { Box, Button, Heading, Input, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { CategoryNode } from "../../types/models";
import { CategoryForm } from "./CategoryForm";
import { TreeNode } from "./TreeNode";

const categoryMatches = (
  category: CategoryNode,
  search: string,
  categories: CategoryNode[],
  ingredients: { nombre: string; parentId: string }[],
): boolean => {
  if (category.nombre.toLowerCase().includes(search)) {
    return true;
  }

  if (
    ingredients.some(
      (ingredient) => ingredient.parentId === category.id && ingredient.nombre.toLowerCase().includes(search),
    )
  ) {
    return true;
  }

  const children = categories.filter((item) => item.parentId === category.id);
  return children.some((child) => categoryMatches(child, search, categories, ingredients));
};

export const IngredientTree = () => {
  const { categories, ingredients, addCategory } = useAppContext();
  const [showRootForm, setShowRootForm] = useState(false);
  const [search, setSearch] = useState("");

  const rootCategories = categories.filter((category) => category.parentId === null);
  const lowered = search.trim().toLowerCase();

  const filteredCategories = useMemo(() => {
    if (!lowered) {
      return rootCategories;
    }

    return rootCategories.filter((category) => categoryMatches(category, lowered, categories, ingredients));
  }, [categories, ingredients, lowered, rootCategories]);

  return (
    <VStack align="stretch" spacing={6}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <Box bg="white" p={5} rounded="xl" borderWidth="1px">
          <Heading size="sm" mb={2}>
            Estructura jerárquica
          </Heading>
          <Text color="gray.600" fontSize="sm">
            Creá categorías anidadas sin límite y agregá ingredientes finales con calorías, unidad base y notas.
          </Text>
        </Box>
        <Box bg="white" p={5} rounded="xl" borderWidth="1px">
          <Heading size="sm" mb={2}>
            Buscar
          </Heading>
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar categorías o ingredientes"
            bg="white"
          />
        </Box>
      </SimpleGrid>

      <Box bg="white" borderWidth="1px" rounded="xl" p={5}>
        <Button colorScheme="green" onClick={() => setShowRootForm((current) => !current)}>
          Agregar categoría principal
        </Button>
        {showRootForm ? (
          <Box mt={4}>
            <CategoryForm
              placeholder="Nombre de la categoría principal"
              buttonLabel="Guardar categoría"
              onSubmit={(name) => {
                addCategory(null, name);
                setShowRootForm(false);
              }}
            />
          </Box>
        ) : null}
      </Box>

      <VStack align="stretch" spacing={4}>
        {filteredCategories.length === 0 ? (
          <Box bg="white" borderWidth="1px" rounded="xl" p={6}>
            <Text color="gray.500">No se encontraron categorías para la búsqueda actual.</Text>
          </Box>
        ) : (
          filteredCategories.map((category) => <TreeNode key={category.id} category={category} />)
        )}
      </VStack>
    </VStack>
  );
};
