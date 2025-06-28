import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { registerUser } from "../redux/slices/authSlice"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

const formSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

const themeGradients = {
  default: "bg-gradient-to-br from-[#39D08A] to-[#179651] dark:from-[#176943] dark:to-[#137144]",
  "green-teal": "bg-gradient-to-br from-[#3B82F6] to-[#14B8A6]",
  "purple-blue": "bg-gradient-to-br from-purple-400 to-blue-400",
  "red-orange": "bg-gradient-to-br from-red-400 to-orange-400",
}

const themeText = {
  default: {
    title: "Join DataViz",
    subtitle: "Start your data visualization journey today"
  },
  "green-teal": {
    title: "Join DataViz",
    subtitle: "Start your data visualization journey today"
  },
  "purple-blue": {
    title: "Join DataViz",
    subtitle: "Start your data visualization journey today"
  },
  "red-orange": {
    title: "Join DataViz",
    subtitle: "Start your data visualization journey today"
  },
}

export function SignupForm({
  className,
  theme = "default",
  ...props
}) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading, error } = useSelector((state) => state.auth)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (values) => {
    try {
      const { confirmPassword: _confirmPassword, ...submitData } = values
      const result = await dispatch(registerUser(submitData))
      if (result.type === "auth/registerUser/fulfilled") {
        navigate("/dashboard")
      }
    } catch (err) {
      // Optionally log or handle unexpected errors
    }
  }

  const imageGradient = themeGradients[theme] || themeGradients.default
  const welcomeText = themeText[theme] || themeText.default

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 min-h-[600px] shadow-lg bg-transparent">
        <CardContent className="grid p-0 md:grid-cols-2 h-full">
          {/* Left: Signup Form */}
          <div className="flex flex-col justify-center bg-white dark:bg-neutral-900 h-full p-6 md:p-8">
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold text-black dark:text-white">Create Account</h1>
                  <p className="text-muted-foreground text-balance">
                    Enter your details below to create your account
                  </p>
                </div>
                
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="grid gap-3">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    type="text" 
                    placeholder="Enter your full name" 
                    {...form.register("name")}
                    className={form.formState.errors.name ? "border-red-500" : ""}
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="m@example.com" 
                    {...form.register("email")}
                    className={form.formState.errors.email ? "border-red-500" : ""}
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Create a password"
                    {...form.register("password")}
                    className={form.formState.errors.password ? "border-red-500" : ""}
                  />
                  {form.formState.errors.password && (
                    <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
                  )}
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    placeholder="Confirm your password"
                    {...form.register("confirmPassword")}
                    className={form.formState.errors.confirmPassword ? "border-red-500" : ""}
                  />
                  {form.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-500">{form.formState.errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create account"}
                </Button>

                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <Link to="/login" className="underline underline-offset-4">
                    Sign in
                  </Link>
                </div>
              </div>
            </form>
          </div>
          
          {/* Right: Gradient with Welcome Text */}
          <div className={`relative hidden md:flex items-center justify-center ${imageGradient} h-full`}>
            <div className="text-center text-white px-6">
              <h2 className="text-3xl font-bold mb-3">{welcomeText.title}</h2>
              <p className="text-lg opacity-90 leading-relaxed">{welcomeText.subtitle}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <div
        className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4 mt-2 mb-0"
      >
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
} 