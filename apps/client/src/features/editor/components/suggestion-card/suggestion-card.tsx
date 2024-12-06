import { FC } from "react";
import { Card, Text, Group, Button } from "@mantine/core";
import { useEditor } from "@tiptap/react";

interface SuggestionCardProps {
  editor: ReturnType<typeof useEditor>;
  originalText: string;
  suggestedText: string;
  onAccept: () => void;
  onReject: () => void;
}

export const SuggestionCard: FC<SuggestionCardProps> = ({
  editor,
  originalText,
  suggestedText,
  onAccept,
  onReject,
}) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Text fw={500} size="lg" mb="md">
        Sugestão de Alteração
      </Text>

      <Text c="dimmed" mb="xs">
        Texto Original:
      </Text>
      <Text mb="md" style={{ backgroundColor: "#fdebeb" }}>
        {originalText}
      </Text>

      <Text c="dimmed" mb="xs">
        Sugestão:
      </Text>
      <Text mb="lg" style={{ backgroundColor: "#acf79f" }}>
        {suggestedText}
      </Text>

      <Group justify="flex-end">
        <Button variant="light" color="red" onClick={onReject}>
          Rejeitar
        </Button>
        <Button variant="light" color="green" onClick={onAccept}>
          Aceitar
        </Button>
      </Group>
    </Card>
  );
};
