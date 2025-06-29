import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { loginUser } from "../redux/slices/authSlice"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useColorTheme } from "@/components/theme-context"

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

const themeGradients = {
  default: "bg-gradient-to-br from-[#39D08A] to-[#179651] dark:from-[#176943] dark:to-[#137144]",
  "green-teal": "bg-gradient-to-br from-[#3B82F6] to-[#14B8A6]",
  "purple-blue": "bg-gradient-to-br from-purple-400 to-blue-400",
  "red-orange": "bg-gradient-to-br from-red-400 to-orange-400",
}

const themeText = {
  default: {
    title: "Welcome Back",
    subtitle: "Ready to explore your data insights?"
  },
  "green-teal": {
    title: "Welcome Back",
    subtitle: "Ready to explore your data insights?"
  },
  "purple-blue": {
    title: "Welcome Back", 
    subtitle: "Ready to explore your data insights?"
  },
  "red-orange": {
    title: "Welcome Back",
    subtitle: "Ready to explore your data insights?"
  },
}

const colorThemes = [
  { id: "default", name: "Excel Green", gradient: themeGradients.default },
  { id: "green-teal", name: "Ocean Drive", gradient: themeGradients["green-teal"] },
  { id: "purple-blue", name: "Royal Twilight", gradient: themeGradients["purple-blue"] },
  { id: "red-orange", name: "Sunset Blaze", gradient: themeGradients["red-orange"] },
]

export function LoginForm({
  className,
  theme = "default",
  ...props
}) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading, error } = useSelector((state) => state.auth)
  const { colorTheme, setColorTheme } = useColorTheme()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values) => {
    try {
      const result = await dispatch(loginUser(values))
      if (result.type === "auth/loginUser/fulfilled") {
        navigate("/dashboard")
      }
    } catch (err) {
      // Optionally log or handle unexpected errors
    }
  }

  const imageGradient = themeGradients[colorTheme] || themeGradients.default
  const welcomeText = themeText[colorTheme] || themeText.default

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 min-h-[600px] shadow-lg bg-transparent">
        <CardContent className="grid p-0 md:grid-cols-2 h-full">
          <div className="flex flex-col justify-center bg-white dark:bg-neutral-900 h-full p-6 md:p-8">
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold text-black dark:text-white">Welcome back</h1>
                  <p className="text-muted-foreground text-balance">
                    Login to your account
                  </p>
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
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
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link to="#" className="ml-auto text-sm underline-offset-2 hover:underline">
                      Forgot your password?
                    </Link>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    {...form.register("password")}
                    className={form.formState.errors.password ? "border-red-500" : ""}
                  />
                  {form.formState.errors.password && (
                    <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Login"}
                </Button>
                {/* Color Theme Selector below button */}
                <div className="flex justify-center my-4">
                  <div className="flex gap-4">
                    {colorThemes.map((t) => (
                      <button
                        type="button"
                        key={t.id}
                        className={`w-8 h-8 rounded-full border-2 transition-all duration-150 ${colorTheme === t.id ? 'border-primary scale-110 shadow-lg' : 'border-transparent opacity-70 hover:opacity-100'} ${t.gradient}`}
                        title={t.name}
                        onClick={() => setColorTheme(t.id)}
                        aria-label={t.name}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link to="/signup" className="underline underline-offset-4">
                    Sign up
                  </Link>
                </div>
              </div>
            </form>
          </div>
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
