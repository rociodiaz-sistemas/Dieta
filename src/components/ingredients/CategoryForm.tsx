import { Button, HStack, Input } from "@chakra-ui/react";
import { useState } from "react";

interface CategoryFormProps {
  placeholder: string;
  buttonLabel: string;
  onSubmit: (name: string) => void;
}

export const CategoryForm = ({ placeholder, buttonLabel, onSubmit }: CategoryFormProps) => {
  const [nombre, setNombre] = useState("");

  const handleSubmit = () => {
    const trimmed = nombre.trim();

    if (!trimmed) {
      return;
    }

    onSubmit(trimmed);
    setNombre("");
  };

  return (
    <HStack align="start">
      <Input
        value={nombre}
        onChange={(event) => setNombre(event.target.value)}
        placeholder={placeholder}
        size="sm"
        bg="white"
      />
      <Button size="sm" colorScheme="green" onClick={handleSubmit}>
        {buttonLabel}
      </Button>
    </HStack>
  );
};
