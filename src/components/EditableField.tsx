import { Box, Button, HStack, Input, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface EditableFieldProps {
  label: string;
  value: string;
  onSave: (value: string) => void;
  placeholder?: string;
}

export const EditableField = ({ label, value, onSave, placeholder }: EditableFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draftValue, setDraftValue] = useState(value);

  useEffect(() => {
    setDraftValue(value);
  }, [value]);

  const handleSave = () => {
    onSave(draftValue);
    setIsEditing(false);
  };

  return (
    <Box>
      <Text fontSize="sm" color="gray.500" mb={1}>
        {label}
      </Text>
      {isEditing ? (
        <HStack align="start">
          <Input
            value={draftValue}
            onChange={(event) => setDraftValue(event.target.value)}
            placeholder={placeholder}
            size="sm"
            bg="white"
          />
          <Button size="sm" colorScheme="green" onClick={handleSave}>
            Guardar
          </Button>
        </HStack>
      ) : (
        <HStack justify="space-between" align="center">
          <Text>{value || "Sin dato"}</Text>
          <Button size="xs" variant="ghost" onClick={() => setIsEditing(true)}>
            Editar
          </Button>
        </HStack>
      )}
    </Box>
  );
};
