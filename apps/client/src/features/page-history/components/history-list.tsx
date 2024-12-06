import {
  usePageHistoryListQuery,
  usePageHistoryQuery,
} from "@/features/page-history/queries/page-history-query";
import HistoryItem from "@/features/page-history/components/history-item";
import {
  activeHistoryIdAtom,
  historyAtoms,
} from "@/features/page-history/atoms/history-atoms";
import { useAtom } from "jotai";
import { useCallback, useEffect } from "react";
import { Button, ScrollArea, Group, Divider, Text } from "@mantine/core";
import {
  pageEditorAtom,
  titleEditorAtom,
} from "@/features/editor/atoms/editor-atoms";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";

interface Props {
  pageId: string;
}

function HistoryList({ pageId }: Props) {
  const [activeHistoryId, setActiveHistoryId] = useAtom(activeHistoryIdAtom);
  const {
    data: pageHistoryList,
    isLoading,
    isError,
  } = usePageHistoryListQuery(pageId);
  const { data: activeHistoryData } = usePageHistoryQuery(activeHistoryId);

  const [mainEditor] = useAtom(pageEditorAtom);
  const [mainEditorTitle] = useAtom(titleEditorAtom);
  const [, setHistoryModalOpen] = useAtom(historyAtoms);

  const confirmModal = () =>
    modals.openConfirmModal({
      title: "Please confirm your action",
      children: (
        <Text size="sm">
          Are you sure you want to restore this version? Any changes not
          versioned will be lost.
        </Text>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onConfirm: handleRestore,
    });

  const handleRestore = useCallback(() => {
    if (activeHistoryData) {
      mainEditorTitle
        .chain()
        .clearContent()
        .setContent(activeHistoryData.title, true)
        .run();
      mainEditor
        .chain()
        .clearContent()
        .setContent(activeHistoryData.content)
        .run();
      setHistoryModalOpen(false);
      notifications.show({ message: "Successfully restored" });
    }
  }, [activeHistoryData]);

  useEffect(() => {
    if (
      pageHistoryList &&
      pageHistoryList.items.length > 0 &&
      !activeHistoryId
    ) {
      setActiveHistoryId(pageHistoryList.items[0].id);
    }
  }, [pageHistoryList]);

  if (isLoading) {
    return <></>;
  }

  if (isError) {
    return <div>Error loading page history.</div>;
  }

  if (!pageHistoryList || pageHistoryList.items.length === 0) {
    return <>No page history saved yet.</>;
  }

  return (
    <div>
      <ScrollArea h={620} w="100%" type="scroll" scrollbarSize={5}>
        {pageHistoryList &&
          pageHistoryList.items.map((historyItem, index) => (
            <HistoryItem
              key={index}
              historyItem={historyItem}
              onSelect={setActiveHistoryId}
              isActive={historyItem.id === activeHistoryId}
            />
          ))}
      </ScrollArea>

      <Divider />

      <Group p="xs" wrap="nowrap">
        <Button size="compact-md" onClick={confirmModal}>
          Restore
        </Button>
        <Button
          variant="default"
          size="compact-md"
          onClick={() => setHistoryModalOpen(false)}
        >
          Cancel
        </Button>
      </Group>
    </div>
  );
}

export default HistoryList;
