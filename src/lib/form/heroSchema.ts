import * as z from "zod";

export interface ActionResponse<T = any> {
  success: boolean;
  message: string;
  errors?: {
    [K in keyof T]?: string[];
  };
  inputs?: T;
}
export const heroSchema = z.object({
  title: z.string({ required_error: "This field is required" }),
  subtitle: z.string({ required_error: "This field is required" }),
  description: z.string({ required_error: "This field is required" }),
  buttonText: z.string({ required_error: "This field is required" }).optional(),
  buttonLink: z.string({ required_error: "This field is required" }).optional(),
  themeType: z.string().min(1, "Please select an item").optional(),
  image: z
    .any()
    .optional(), // image bisa File, string, atau tidak ada
});
