import { AppData } from "../types/models";
import { createId } from "./id";

const lacteosId = createId();
const lecheId = createId();
const avenaId = createId();
const cerealId = createId();
const instantaneaId = createId();

const lecheDescremadaIngredientId = createId();
const lecheAlmendrasIngredientId = createId();
const avenaInstantaneaIngredientId = createId();

export const DEFAULT_VARIANT_NAME = "N/A";

export const UNIT_OPTIONS = [
  "g",
  "kg",
  "ml",
  "l",
  "unidad",
  "cucharada",
  "cucharadita",
  "taza",
];

export const INITIAL_DATA: AppData = {
  categories: [
    { id: lacteosId, nombre: "Lácteos", parentId: null, tipo: "categoria" },
    { id: lecheId, nombre: "Leche", parentId: lacteosId, tipo: "categoria" },
    { id: avenaId, nombre: "Avena", parentId: null, tipo: "categoria" },
    { id: cerealId, nombre: "Cereal", parentId: avenaId, tipo: "categoria" },
    { id: instantaneaId, nombre: "Instantánea", parentId: cerealId, tipo: "categoria" },
  ],
  ingredients: [
    {
      id: lecheDescremadaIngredientId,
      nombre: "Leche descremada",
      parentId: lecheId,
      tipo: "ingrediente",
      notas: "Base para desayunos, café y preparaciones livianas.",
    },
    {
      id: lecheAlmendrasIngredientId,
      nombre: "Leche de almendras",
      parentId: lecheId,
      tipo: "ingrediente",
      notas: "Alternativa vegetal para licuados y café.",
    },
    {
      id: avenaInstantaneaIngredientId,
      nombre: "Avena instantánea",
      parentId: instantaneaId,
      tipo: "ingrediente",
      notas: "Aporta fibra y saciedad.",
    },
  ],
  variants: [
    {
      id: createId(),
      ingredientId: lecheDescremadaIngredientId,
      marca: "N/A",
      calorias: 36,
      unidadBase: "ml",
      cantidadBase: 100,
    },
    {
      id: createId(),
      ingredientId: lecheDescremadaIngredientId,
      marca: "Serenísima",
      calorias: 35,
      unidadBase: "ml",
      cantidadBase: 100,
    },
    {
      id: createId(),
      ingredientId: lecheDescremadaIngredientId,
      marca: "Ilolay",
      calorias: 38,
      unidadBase: "ml",
      cantidadBase: 100,
    },
    {
      id: createId(),
      ingredientId: lecheAlmendrasIngredientId,
      marca: "N/A",
      calorias: 20,
      unidadBase: "ml",
      cantidadBase: 100,
    },
    {
      id: createId(),
      ingredientId: lecheAlmendrasIngredientId,
      marca: "Serenísima",
      calorias: 18,
      unidadBase: "ml",
      cantidadBase: 100,
    },
    {
      id: createId(),
      ingredientId: avenaInstantaneaIngredientId,
      marca: "N/A",
      calorias: 389,
      unidadBase: "g",
      cantidadBase: 100,
    },
    {
      id: createId(),
      ingredientId: avenaInstantaneaIngredientId,
      marca: "Quaker",
      calorias: 389,
      unidadBase: "g",
      cantidadBase: 100,
    },
  ],
  recipes: [],
  journalEntries: [],
};
