"use client"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
// import { signIn } from "next-auth/react"
import { toast } from "react-toastify"
import { Loader } from "lucide-react"
import { useRouter } from "next/navigation"
import { loginAction } from "./login-action"

export const description =
  "A login form with email and password. There's an option to login with Google and a link to sign up if you don't have an account."

export function LoginForm() {
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const login = async () => {
    if (!phone && !password && password.length < 6) {
      toast("Phone Number and Password is required for login!", {
        type: "error",
      })
      return
    }
    try {
      setLoading(true)
      await loginAction({ phone, password })
      toast("Your account login success!", {
        type: "success",
      })
      setLoading(false)
      router.push("/dashboard")
      return
    } catch {
      toast("Login fail please try again using correct information!", {
        type: "error",
      })
      setLoading(false)
      return
    }
  }
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Phone Number</Label>
            <Input
              id="phone"
              placeholder="01700000000"
              required
              onChange={(v) => setPhone(v.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="******"
              required
              onChange={(v) => setPassword(v.target.value)}
            />
          </div>
          {loading ? (
            <Button disabled>
              <Loader className="animate-spin" /> Loading
            </Button>
          ) : (
            <Button
              onClick={async () => await login()}
              type="submit"
              className="w-full"
            >
              Login
            </Button>
          )}

          <Button variant="outline" className="w-full">
            Login with Google
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="#" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
