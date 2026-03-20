import { Select } from "@chakra-ui/react";

interface UnitSelectorProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

export const UnitSelector = ({ value, options, onChange }: UnitSelectorProps) => (
  <Select value={value} onChange={(event) => onChange(event.target.value)} bg="white">
    {options.map((unit) => (
      <option key={unit} value={unit}>
        {unit}
      </option>
    ))}
  </Select>
);
