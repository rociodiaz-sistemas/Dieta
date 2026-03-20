import { CategoryNode, IngredientNode } from "../types/models";

export const getChildCategories = (
  categories: CategoryNode[],
  parentId: string | null,
) => categories.filter((category) => category.parentId === parentId);

export const getChildIngredients = (
  ingredients: IngredientNode[],
  parentId: string,
) => ingredients.filter((ingredient) => ingredient.parentId === parentId);

export const collectCategoryAndDescendants = (
  categories: CategoryNode[],
  rootId: string,
): string[] => {
  const ids = [rootId];
  const queue = [rootId];

  while (queue.length > 0) {
    const currentId = queue.shift();
    const children = categories.filter((category) => category.parentId === currentId);

    children.forEach((child) => {
      ids.push(child.id);
      queue.push(child.id);
    });
  }

  return ids;
};
