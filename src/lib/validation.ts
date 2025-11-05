import { z } from 'zod';

// Schema dasar untuk Category
export const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  image: z.union([z.string().url().optional(), z.instanceof(File).optional()]).optional(), // Bisa string (URL) atau File
  description: z.string().optional(),
  end: z.number().int().min(0).optional(),
  price: z.number().min(0).optional(),
  start: z.number().int().min(0).optional(),
  descriptionEn: z.string().optional(),
  isFree: z.boolean().optional(),
  isPayAsYouWish: z.boolean().optional(),
  location: z.string().optional(),
  disable: z.boolean().optional(),
  isManual: z.boolean().optional(),
  isGroup: z.boolean().optional(),
});

// Inferensi tipe dari schema untuk form input
export type CategoryFormInput = z.infer<typeof categorySchema>;

// Schema dasar untuk Link
export const linkSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  value: z.string().url('Invalid URL').min(1, 'Value is required'),
  type: z.string().min(1, 'Type is required'),
  icon: z.string().url('Invalid URL').optional(),
  tenantId: z.string().min(1, 'Tenant ID is required'),
});

// Inferensi tipe dari schema untuk form input
export type LinkFormInput = z.infer<typeof linkSchema>;