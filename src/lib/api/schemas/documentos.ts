import { z } from 'zod';

export const UploadDocBody = z.object({
  filename: z.string(),
  content: z.string(), // base64
  visible: z.boolean().optional(),
  signable_by_employee: z.boolean().optional(),
  signable_by_legal_agent: z.boolean().optional(),
  reviewer_id: z.number().int().positive().optional(),
}).strict();

export const ProcessSignatureBody = z.object({
  signatures: z.array(z.unknown()),
}).strict();
