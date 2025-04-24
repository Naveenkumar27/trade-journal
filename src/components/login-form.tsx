"use client"

import { useState, FormEvent, ComponentPropsWithoutRef } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"
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

// LoginForm component for user authentication
export function LoginForm({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  // Handles form submission and login
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setError("")

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Willkommen beim Trade-Journal</CardTitle> {/* Welcome to Trade-Journal */}
          <CardDescription>
            Login mit deiner E-Mail-Adresse und deinem Passwort {/* Login with your Email and Password */}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid gap-6">
              {/* Email Input */}
              <div className="grid gap-2">
                <Label htmlFor="email">E-Mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password Input with optional "Remember me" */}
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      id="remember"
                      type="checkbox"
                      className="h-4 w-4"
                    />
                    <Label htmlFor="remember" className="text-sm">
                      Angemeldet bleiben {/* Remember me */}
                    </Label>
                  </div>
                  <a
                    href="#"
                    className="text-sm underline-offset-4 hover:underline"
                  >
                    Passwort vergessen? {/* Forgot your password? */}
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Show error if login fails */}
              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button type="submit" className="w-full">
                Anmelden {/* Login */}
              </Button>

              {/* Navigation to signup */}
              <div className="text-center text-sm">
                Du hast noch kein Konto? {" "}
                <button
                  type="button"
                  onClick={() => router.push("/signup")}
                  className="underline underline-offset-4 text-blue-600 hover:text-blue-800"
                >
                  Registrieren {/* Sign up */}
                </button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Legal terms section */}
      <div className="text-balance  text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
        Durch Klicken auf "Weiter" stimmst du unseren <a href="#">Nutzungsbedingungen</a><br />
        und unserer <a href="#">Datenschutzrichtlinie</a> zu.
      </div>
    </div>
  )
}
