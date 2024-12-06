export enum QueueName {
  EMAIL_QUEUE = '{email-queue}',
  ATTACHEMENT_QUEUE = '{attachment-queue}',
}

export enum QueueJob {
  SEND_EMAIL = 'send-email',
  DELETE_SPACE_ATTACHMENTS = 'delete-space-attachments',
  DELETE_PAGE_ATTACHMENTS = 'delete-page-attachments',
}
