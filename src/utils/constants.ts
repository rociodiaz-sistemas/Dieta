import { AppData } from "../types/models";
import { createId } from "./id";

const lacteosId = createId();
const lecheId = createId();
const lecheDescremadaId = createId();
const lecheAlmendrasId = createId();
const ilolayId = createId();
const serenisimaId = createId();
const avenaId = createId();
const cerealId = createId();
const instantaneaId = createId();
const avenaQuakerId = createId();

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
    {
      id: lecheDescremadaId,
      nombre: "Leche descremada",
      parentId: lecheId,
      tipo: "categoria",
    },
    {
      id: lecheAlmendrasId,
      nombre: "Leche de almendras",
      parentId: lecheId,
      tipo: "categoria",
    },
    { id: avenaId, nombre: "Avena", parentId: null, tipo: "categoria" },
    { id: cerealId, nombre: "Cereal", parentId: avenaId, tipo: "categoria" },
    {
      id: instantaneaId,
      nombre: "Instantánea",
      parentId: cerealId,
      tipo: "categoria",
    },
  ],
  ingredients: [
    {
      id: ilolayId,
      nombre: "Leche descremada Ilolay",
      parentId: lecheDescremadaId,
      tipo: "ingrediente",
      calorias: 35,
      unidadBase: "ml",
      cantidadBase: 100,
      notas: "Ideal para desayunos y café.",
    },
    {
      id: serenisimaId,
      nombre: "Leche de almendras Serenísima",
      parentId: lecheAlmendrasId,
      tipo: "ingrediente",
      calorias: 18,
      unidadBase: "ml",
      cantidadBase: 100,
      notas: "Sin azúcar agregada.",
    },
    {
      id: avenaQuakerId,
      nombre: "Avena instantánea Quaker",
      parentId: instantaneaId,
      tipo: "ingrediente",
      calorias: 389,
      unidadBase: "g",
      cantidadBase: 100,
      notas: "Aporta fibra y saciedad.",
    },
  ],
  recipes: [],
};
