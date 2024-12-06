import React from 'react';
import { useSpaceQuery } from '@/features/space/queries/space-query.ts';
import { EditSpaceForm } from '@/features/space/components/edit-space-form.tsx';
import { Button, Divider, Group, Text } from '@mantine/core';
import DeleteSpaceModal from './delete-space-modal';
import { useDisclosure } from "@mantine/hooks";
import ExportModal from "@/components/common/export-modal.tsx";

interface SpaceDetailsProps {
  spaceId: string;
  readOnly?: boolean;
}
export default function SpaceDetails({ spaceId, readOnly }: SpaceDetailsProps) {
  const { data: space, isLoading } = useSpaceQuery(spaceId);
  const [exportOpened, { open: openExportModal, close: closeExportModal }] =
    useDisclosure(false);

  return (
    <>
      {space && (
        <div>
          <Text my="md" fw={600}>
            Details
          </Text>
          <EditSpaceForm space={space} readOnly={readOnly} />

          {!readOnly && (
            <>

              <Divider my="lg" />

              <Group justify="space-between" wrap="nowrap" gap="xl">
                <div>
                  <Text size="md">Export space</Text>
                  <Text size="sm" c="dimmed">
                    Export all pages and attachments in this space
                  </Text>
                </div>

                <Button onClick={openExportModal}>
                  Export
                </Button>
              </Group>

              <Divider my="lg" />

              <Group justify="space-between" wrap="nowrap" gap="xl">
                <div>
                  <Text size="md">Delete space</Text>
                  <Text size="sm" c="dimmed">
                    Delete this space with all its pages and data.
                  </Text>
                </div>

                <DeleteSpaceModal space={space} />
              </Group>

              <ExportModal
                type="space"
                id={space.id}
                open={exportOpened}
                onClose={closeExportModal}
              />
            </>
          )}
        </div>
      )}
    </>
  );
}
