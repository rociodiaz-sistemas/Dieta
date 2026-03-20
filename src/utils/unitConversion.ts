const UNIT_FACTORS: Record<string, { family: "masa" | "volumen" | "unidad"; factor: number }> = {
  g: { family: "masa", factor: 1 },
  kg: { family: "masa", factor: 1000 },
  ml: { family: "volumen", factor: 1 },
  l: { family: "volumen", factor: 1000 },
  unidad: { family: "unidad", factor: 1 },
};

export const convertToBaseUnit = (
  amount: number,
  unit: string,
  baseUnit: string,
) => {
  const from = UNIT_FACTORS[unit];
  const to = UNIT_FACTORS[baseUnit];

  if (!from || !to || from.family !== to.family) {
    return null;
  }

  return (amount * from.factor) / to.factor;
};
