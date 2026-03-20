import {
  Box,
  Button,
  Collapse,
  HStack,
  Icon,
  IconButton,
  Input,
  Spacer,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  DeleteIcon,
  EditIcon,
} from "@chakra-ui/icons";
import { useMemo, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { CategoryNode } from "../../types/models";
import { getChildCategories, getChildIngredients } from "../../utils/tree";
import { CategoryForm } from "./CategoryForm";
import { IngredientForm } from "./IngredientForm";
import { IngredientNodeCard } from "./IngredientNodeCard";

interface TreeNodeProps {
  category: CategoryNode;
  depth?: number;
  selectedItem: { id: string; tipo: "categoria" | "ingrediente" } | null;
  onSelect: (
    item: { id: string; tipo: "categoria" | "ingrediente" } | null,
  ) => void;
}

export const TreeNode = ({
  category,
  depth = 0,
  selectedItem,
  onSelect,
}: TreeNodeProps) => {
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
  const hasChildren = childCategories.length > 0 || childIngredients.length > 0;
  const isSelected =
    selectedItem?.tipo === "categoria" && selectedItem.id === category.id;
  const indentation = useMemo(() => depth * 14, [depth]);

  const rowStyles = {
    bg: isSelected ? "green.50" : "transparent",
    borderColor: isSelected ? "green.200" : "transparent",
    _hover: {
      bg: isSelected ? "green.50" : "gray.50",
      borderColor: isSelected ? "green.200" : "gray.200",
    },
  };

  return (
    <Box>
      <Box pl={`${indentation}px`}>
        <HStack
          spacing={2}
          w="full"
          px={2}
          py={2}
          rounded="md"
          borderWidth="1px"
          cursor="pointer"
          transition="all 0.2s ease"
          align="center"
          {...rowStyles}
          onClick={() => {
            onSelect({ id: category.id, tipo: "categoria" });
            if (hasChildren) {
              setIsExpanded((current) => !current);
            }
          }}
        >
          <IconButton
            aria-label={
              isExpanded ? "Contraer categoría" : "Expandir categoría"
            }
            icon={
              hasChildren ? (
                <Icon
                  as={isExpanded ? ChevronDownIcon : ChevronRightIcon}
                  boxSize={5}
                />
              ) : (
                <Box w={5} />
              )
            }
            size="xs"
            variant="ghost"
            onClick={(event) => {
              event.stopPropagation();
              if (hasChildren) {
                setIsExpanded((current) => !current);
              }
            }}
          />

          <Box
            w="12px"
            h="10px"
            rounded="sm"
            bg={hasChildren ? "yellow.400" : "yellow.300"}
            borderWidth="1px"
            borderColor="yellow.600"
            flexShrink={0}
          />

          {isEditingName ? (
            <HStack flex="1" onClick={(event) => event.stopPropagation()}>
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
            <>
              <Text
                fontWeight={isSelected ? "semibold" : "medium"}
                color="gray.800"
              >
                {category.nombre}
              </Text>
              <HStack spacing={1} onClick={(event) => event.stopPropagation()}>
                <Tooltip label="Editar" hasArrow>
                  <IconButton
                    aria-label="Editar"
                    icon={<EditIcon boxSize={3.5} />}
                    size="xs"
                    variant="ghost"
                    colorScheme="gray"
                    onClick={() => setIsEditingName(true)}
                  />
                </Tooltip>
                <Tooltip label="Eliminar" hasArrow>
                  <IconButton
                    aria-label="Eliminar"
                    icon={<DeleteIcon boxSize={3.5} />}
                    size="xs"
                    variant="ghost"
                    onClick={() => deleteCategory(category.id)}
                  />
                </Tooltip>
              </HStack>
              <Spacer />
              <HStack spacing={2} onClick={(event) => event.stopPropagation()}>
                <Button
                  size="xs"
                  variant="ghost"
                  colorScheme="green"
                  onClick={() => setShowCategoryForm((current) => !current)}
                >
                  Agregar subcategoría
                </Button>
                <Button
                  size="xs"
                  variant="ghost"
                  colorScheme="green"
                  onClick={() => setShowIngredientForm((current) => !current)}
                >
                  Agregar ingrediente
                </Button>
              </HStack>
            </>
          )}
        </HStack>
      </Box>

      <Collapse in={showCategoryForm} animateOpacity>
        <Box ml={`${indentation + 52}px`} mt={2} mb={2}>
          <CategoryForm
            placeholder="Nombre de la subcategoría"
            buttonLabel="Guardar subcategoría"
            onSubmit={(name) => {
              addCategory(category.id, name);
              setShowCategoryForm(false);
              setIsExpanded(true);
            }}
          />
        </Box>
      </Collapse>

      <Collapse in={showIngredientForm} animateOpacity>
        <Box
          ml={`${indentation + 52}px`}
          mt={2}
          mb={2}
          borderWidth="1px"
          borderColor="gray.200"
          rounded="lg"
          p={4}
          bg="gray.50"
        >
          <IngredientForm
            unitOptions={unitOptions}
            submitLabel="Guardar ingrediente"
            onSubmit={(values) => {
              addIngredient(category.id, values);
              setShowIngredientForm(false);
              setIsExpanded(true);
            }}
          />
        </Box>
      </Collapse>

      <Collapse in={isExpanded} animateOpacity>
        <Box
          ml={`${indentation + 14}px`}
          pl={2}
          borderLeftWidth={depth >= 0 ? "1px" : "0"}
          borderColor="gray.200"
        >
          <VStack align="stretch" spacing={1} py={1}>
            {hasChildren ? (
              <>
                {childCategories.map((childCategory) => (
                  <TreeNode
                    key={childCategory.id}
                    category={childCategory}
                    depth={depth + 1}
                    selectedItem={selectedItem}
                    onSelect={onSelect}
                  />
                ))}

                {childIngredients.map((ingredient) => (
                  <IngredientNodeCard
                    key={ingredient.id}
                    ingredient={ingredient}
                    depth={depth + 1}
                    isSelected={
                      selectedItem?.tipo === "ingrediente" &&
                      selectedItem.id === ingredient.id
                    }
                    onSelect={() =>
                      onSelect({ id: ingredient.id, tipo: "ingrediente" })
                    }
                    onSave={(values) => updateIngredient(ingredient.id, values)}
                    onDelete={() => deleteIngredient(ingredient.id)}
                  />
                ))}
              </>
            ) : (
              <Text fontSize="sm" color="gray.500" px={2} py={2}>
                Carpeta vacía.
              </Text>
            )}
          </VStack>
        </Box>
      </Collapse>
    </Box>
  );
};
