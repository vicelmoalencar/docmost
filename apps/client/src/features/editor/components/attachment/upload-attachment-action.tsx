import { handleAttachmentUpload } from "@docmost/editor-ext";
import { uploadFile } from "@/features/page/services/page-service.ts";
import { notifications } from "@mantine/notifications";
import {getFileUploadSizeLimit} from "@/lib/config.ts";
import {formatBytes} from "@/lib";

export const uploadAttachmentAction = handleAttachmentUpload({
  onUpload: async (file: File, pageId: string): Promise<any> => {
    try {
      return await uploadFile(file, pageId);
    } catch (err) {
      notifications.show({
        color: "red",
        message: err?.response.data.message,
      });
      throw err;
    }
  },
  validateFn: (file) => {
    if (file.type.includes("image/") || file.type.includes("video/")) {
      return false;
    }
    if (file.size > getFileUploadSizeLimit()) {
      notifications.show({
        color: "red",
        message: `File exceeds the ${formatBytes(getFileUploadSizeLimit())} attachment limit`,
      });
      return false;
    }

    return true;
  },
});
