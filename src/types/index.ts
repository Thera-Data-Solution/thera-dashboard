import { z } from "zod";

export interface ICategory {
  id: string,
  name: string,
  description: string | null,
  descriptionEn: string | null,
  disable: boolean,
  image: string | null,
  isFree: boolean,
  isGroup: boolean,
  isManual: boolean,
  isPayAsYouWish: boolean,
  location: string | null,
  price: number | null,
  slug: string,
  start: number,
  end: number,
}

export const CategoriesSchema = z
  .object({
    name: z.string().min(1, {
      message: "Category name is required.",
    }),
    description: z
      .string()
      .max(500, {
        message: "max 500",
      })
      .optional(),
    descriptionEn: z
      .string()
      .max(500, {
        message: "max 500",
      })
      .optional(),
    image: z.any().optional(),
    start: z
      .number()
      .int()
      .refine((val) => val >= 0, {
        message: "Start must be a non-negative integer",
      }),
    end: z
      .number()
      .int()
      .refine((val) => val >= 0, {
        message: "End must be a non-negative integer",
      }),
    price: z
      .number()
      .int()
      .refine((val) => val >= 0, {
        message: "Price must be a non-negative integer",
      }),
    isGroup: z.boolean(),
    isManual: z.boolean(),
    disable: z.boolean(),
    isFree: z.boolean(),
    location: z.string(),
    isPayAsYouWish: z.boolean(),
  })
  .superRefine((data, ctx) => {
    // Cek jika isFree
    if (data.isFree) {
      if (data.price !== 0) {
        ctx.addIssue({
          path: ["price"],
          code: z.ZodIssueCode.custom,
          message: "Harga harus 0 jika gratis",
        });
      }
      if (data.isPayAsYouWish) {
        ctx.addIssue({
          path: ["isPayAsYouWish"],
          code: z.ZodIssueCode.custom,
          message: "Tidak boleh pilih Pay As You Wish jika gratis",
        });
      }
    }

    // Cek jika isPayAsYouWish
    if (data.isPayAsYouWish) {
      if (data.price !== 0) {
        ctx.addIssue({
          path: ["price"],
          code: z.ZodIssueCode.custom,
          message: "Harga harus 0 jika Pay As You Wish",
        });
      }
      if (data.isFree) {
        ctx.addIssue({
          path: ["isFree"],
          code: z.ZodIssueCode.custom,
          message: "Tidak boleh pilih Free jika Pay As You Wish",
        });
      }
    }

    // Jika bukan free dan bukan pay as you wish
    if (!data.isFree && !data.isPayAsYouWish && data.price <= 0) {
      ctx.addIssue({
        path: ["price"],
        code: z.ZodIssueCode.custom,
        message:
          "Harga wajib diisi jika tidak gratis dan bukan Pay As You Wish",
      });
    }
  });

export type CategoryAdmin = {
  id: string;
  name: string;
  start: number;
  end: number;
  price: number;
  image: string | null;
};

export type ScheduleAdmin = {
  id: string;
  date: string;
  time: string;
  dateTime: Date;
  status: string;
  categories: CategoryAdmin;
};


export interface IBooking {
  id: string
  bookedAt: string
  user: {
    id: string;
    fullName: string
    email: string
    avatar: string
  }
  schedule: {
    id: string
    dateTime: string
    status: string;
    categories: {
      id: string;
      name: string
      location: string
      image: string
    }
  }
}