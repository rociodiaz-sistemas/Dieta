import { Box, Button, Heading, HStack, Input, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { CategoryNode } from "../../types/models";
import { getChildCategories, getChildIngredients } from "../../utils/tree";
import { CategoryForm } from "./CategoryForm";
import { IngredientForm } from "./IngredientForm";
import { IngredientNodeCard } from "./IngredientNodeCard";

interface TreeNodeProps {
  category: CategoryNode;
  depth?: number;
}

export const TreeNode = ({ category, depth = 0 }: TreeNodeProps) => {
  const {
    categories,
    ingredients,
    unitOptions,
    addCategory,
    updateCategory,
    deleteCategory,
    addIngredient,
    updateIngredient,
    deleteIngredient,
  } = useAppContext();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditingName, setIsEditingName] = useState(false);
  const [draftName, setDraftName] = useState(category.nombre);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showIngredientForm, setShowIngredientForm] = useState(false);

  const childCategories = getChildCategories(categories, category.id);
  const childIngredients = getChildIngredients(ingredients, category.id);

  return (
    <Box pl={depth === 0 ? 0 : 4} borderLeftWidth={depth === 0 ? 0 : "2px"} borderColor="gray.200">
      <Box bg="white" borderWidth="1px" rounded="xl" p={4} shadow="sm">
        <VStack align="stretch" spacing={3}>
          <HStack justify="space-between" align={{ base: "stretch", md: "center" }} flexWrap="wrap">
            <HStack align="center" flexWrap="wrap">
              <Button size="xs" variant="outline" onClick={() => setIsExpanded((current) => !current)}>
                {isExpanded ? "Ocultar" : "Expandir"}
              </Button>
              {isEditingName ? (
                <HStack>
                  <Input
                    size="sm"
                    value={draftName}
                    onChange={(event) => setDraftName(event.target.value)}
                    bg="white"
                  />
                  <Button
                    size="sm"
                    colorScheme="green"
                    onClick={() => {
                      const trimmed = draftName.trim();
                      if (trimmed) {
                        updateCategory(category.id, trimmed);
                      }
                      setIsEditingName(false);
                    }}
                  >
                    Guardar
                  </Button>
                </HStack>
              ) : (
                <Heading size="sm">{category.nombre}</Heading>
              )}
            </HStack>

            <HStack flexWrap="wrap">
              {!isEditingName ? (
                <Button size="xs" variant="ghost" onClick={() => setIsEditingName(true)}>
                  Editar
                </Button>
              ) : null}
              <Button
                size="xs"
                variant="outline"
                colorScheme="green"
                onClick={() => setShowCategoryForm((current) => !current)}
              >
                Agregar subcategoría
              </Button>
              <Button
                size="xs"
                variant="outline"
                colorScheme="green"
                onClick={() => setShowIngredientForm((current) => !current)}
              >
                Agregar ingrediente
              </Button>
              <Button size="xs" variant="outline" colorScheme="red" onClick={() => deleteCategory(category.id)}>
                Eliminar
              </Button>
            </HStack>
          </HStack>

          {showCategoryForm ? (
            <CategoryForm
              placeholder="Nombre de la subcategoría"
              buttonLabel="Guardar subcategoría"
              onSubmit={(name) => {
                addCategory(category.id, name);
                setShowCategoryForm(false);
              }}
            />
          ) : null}

          {showIngredientForm ? (
            <Box borderWidth="1px" borderColor="gray.200" rounded="lg" p={4} bg="gray.50">
              <IngredientForm
                unitOptions={unitOptions}
                submitLabel="Guardar ingrediente"
                onSubmit={(values) => {
                  addIngredient(category.id, values);
                  setShowIngredientForm(false);
                }}
              />
            </Box>
          ) : null}

          {isExpanded ? (
            <VStack align="stretch" spacing={3}>
              {childCategories.length === 0 && childIngredients.length === 0 ? (
                <Text fontSize="sm" color="gray.500">
                  No hay subcategorías ni ingredientes en este nivel.
                </Text>
              ) : null}

              {childCategories.map((childCategory) => (
                <TreeNode key={childCategory.id} category={childCategory} depth={depth + 1} />
              ))}

              {childIngredients.map((ingredient) => (
                <Box key={ingredient.id} pl={4}>
                  <IngredientNodeCard
                    ingredient={ingredient}
                    unitOptions={unitOptions}
                    onSave={(values) => updateIngredient(ingredient.id, values)}
                    onDelete={() => deleteIngredient(ingredient.id)}
                  />
                </Box>
              ))}
            </VStack>
          ) : null}
        </VStack>
      </Box>
    </Box>
  );
};
