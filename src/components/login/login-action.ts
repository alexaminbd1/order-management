"use server"
import { signIn } from "@/auth"

export const loginAction = async ({
  phone,
  password,
}: {
  phone: string
  password: string
}) => {
  return await signIn("credentials", { phone, password, redirect: false })
}
