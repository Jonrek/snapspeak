import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { type InsertUser } from "@shared/schema";
import { motion } from "framer-motion";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const { loginMutation, registerMutation, user } = useAuth();
  const [, navigate] = useLocation();

  // Redirect if already logged in
  if (user) {
    navigate("/home");
    return null;
  }

  const form = useForm<InsertUser>({
    resolver: zodResolver(
      mode === "login"
        ? insertUserSchema.pick({ username: true, password: true, rememberMe: true })
        : insertUserSchema
    ),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "student",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: InsertUser) => {
    if (mode === "login") {
      await loginMutation.mutateAsync({
        username: data.username,
        password: data.password,
        rememberMe: data.rememberMe,
      });
    } else {
      await registerMutation.mutateAsync(data);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-800 py-8 px-4">
      <div className="container grid lg:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-0 shadow-xl bg-zinc-900/80 backdrop-blur">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                {mode === "login" ? "تسجيل الدخول" : "إنشاء حساب جديد"}
              </CardTitle>
              <CardDescription className="text-center text-zinc-400">
                {mode === "login"
                  ? "قم بتسجيل الدخول للوصول إلى حسابك"
                  : "قم بإنشاء حساب جديد للبدء"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-100">اسم المستخدم</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-zinc-900/50 border-zinc-800 text-zinc-100" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {mode === "register" && (
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-100">البريد الإلكتروني</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" className="bg-zinc-900/50 border-zinc-800 text-zinc-100" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-100">كلمة المرور</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} className="bg-zinc-900/50 border-zinc-800 text-zinc-100" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {mode === "register" && (
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-100">تأكيد كلمة المرور</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} className="bg-zinc-900/50 border-zinc-800 text-zinc-100" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {mode === "register" && (
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-100">نوع الحساب</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-zinc-900/50 border-zinc-800 text-zinc-100">
                                <SelectValue placeholder="اختر نوع الحساب" className="text-zinc-400" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-zinc-900 border-zinc-800">
                              <SelectItem value="student" className="text-zinc-100">طالب</SelectItem>
                              <SelectItem value="librarian" className="text-zinc-100">صاحب مكتبة</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="rememberMe"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0 rtl:space-x-reverse">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-medium leading-none text-zinc-100">
                          تذكرني
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90"
                    disabled={loginMutation.isPending || registerMutation.isPending}
                  >
                    {mode === "login" ? "تسجيل الدخول" : "إنشاء حساب"}
                  </Button>
                </form>
              </Form>
              <div className="mt-4 text-center">
                <Button
                  variant="link"
                  onClick={() => setMode(mode === "login" ? "register" : "login")}
                  className="text-zinc-400 hover:text-primary hover:underline"
                >
                  {mode === "login"
                    ? "ليس لديك حساب؟ سجل الآن"
                    : "لديك حساب؟ سجل دخولك"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden lg:block relative"
        >
          <div className="relative z-10">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                viewBox="0 0 400 400"
                className="w-96 h-96 opacity-20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 100 L300 100 L300 300 L100 300 Z"
                  fill="none"
                  stroke="url(#grad1)"
                  strokeWidth="4"
                />
                <path
                  d="M150 120 L250 120 M150 140 L250 140 M150 160 L250 160"
                  stroke="url(#grad1)"
                  strokeWidth="2"
                  opacity="0.5"
                />
                <path
                  d="M80 200 Q200 50 320 200"
                  fill="none"
                  stroke="url(#grad2)"
                  strokeWidth="4"
                />
                <circle cx="80" cy="200" r="20" fill="url(#grad2)" />
                <circle cx="320" cy="200" r="20" fill="url(#grad2)" />

                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(24 95% 50%)" />
                    <stop offset="100%" stopColor="hsl(15 95% 50%)" />
                  </linearGradient>
                  <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(24 95% 50%)" />
                    <stop offset="100%" stopColor="hsl(15 95% 50%)" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="text-center space-y-6 relative z-20">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                مرحباً بك في SnapSpeak
              </h1>
              <p className="text-lg text-zinc-400 max-w-md mx-auto">
                قم بتحويل النصوص من الصور إلى ملفات صوتية بكل سهولة. سجل دخولك الآن
                للبدء في استخدام التطبيق.
              </p>
            </div>

            <div className="absolute inset-0 -z-10">
              <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}