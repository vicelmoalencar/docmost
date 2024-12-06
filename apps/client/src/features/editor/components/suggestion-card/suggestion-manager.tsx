import { FC, useState } from "react";
import { useEditor } from "@tiptap/react";
import { SuggestionCard } from "./suggestion-card";
import { Modal } from "@mantine/core";

interface SuggestionManagerProps {
  editor: ReturnType<typeof useEditor>;
}

export const SuggestionManager: FC<SuggestionManagerProps> = ({ editor }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestion, setSuggestion] = useState({
    originalText: "",
    suggestedText: "",
  });

  const handleAccept = () => {
    if (editor && suggestion.suggestedText) {
      editor
        .chain()
        .focus()
        .setColor("")
        .insertContent(suggestion.suggestedText)
        .run();
      setIsOpen(false);
    }
  };

  const handleReject = () => {
    setIsOpen(false);
  };

  // Função para ser chamada quando uma sugestão é feita
  const showSuggestion = (original: string, suggested: string) => {
    setSuggestion({
      originalText: original,
      suggestedText: suggested,
    });
    setIsOpen(true);
  };

  return (
    <Modal 
      opened={isOpen} 
      onClose={() => setIsOpen(false)}
      title=""
      centered
      size="lg"
    >
      <SuggestionCard
        editor={editor}
        originalText={suggestion.originalText}
        suggestedText={suggestion.suggestedText}
        onAccept={handleAccept}
        onReject={handleReject}
      />
    </Modal>
  );
};
