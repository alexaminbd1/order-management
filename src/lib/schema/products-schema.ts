import z from "zod"
export const productSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Products name must be above 3 character!" }),
  about: z
    .string()
    .min(5, { message: "Products name must be above 5 character!" })
    .optional(),
  image: z.string().url({ message: "Image must be URL" }).optional(),
  price: z
    .number({ message: "Price must be number" })
    .positive({ message: "Product price must be positive number" })
    .min(1, { message: "Product price must be above 1 tk" }),
  byPrice: z
    .number({ message: "Price must be number" })
    .positive({ message: "Product buy price must be positive number" })
    .min(1, { message: "Product buy price must be above 1 tk" })
    .optional(),
  maxPrice: z
    .number({ message: "Max Price must be number" })
    .positive({ message: "Product max price must be positive number" })
    .min(1, { message: "Product max price must be above 1 tk" })
    .optional(),
  suggestPrice: z
    .number({ message: "Suggest Price must be number" }).optional(),
    // .positive({ message: "Product suggest price must be positive number" })
    // .min(1, { message: "Product max price must be above 1 tk" })
    // .optional(),
  courier: z.string({ message: "Courier Id is number" }),
  status: z.string().default("DRAFT"),
})

export type productType = z.infer<typeof productSchema>
