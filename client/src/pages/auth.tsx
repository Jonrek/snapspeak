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
    navigate("/");
    return null;
  }

  const form = useForm<InsertUser>({
    resolver: zodResolver(
      mode === "login"
        ? insertUserSchema.pick({ username: true, password: true })
        : insertUserSchema
    ),
    defaultValues: {
      username: "",
      password: "",
      role: "student",
    },
  });

  const onSubmit = async (data: InsertUser) => {
    if (mode === "login") {
      await loginMutation.mutateAsync({
        username: data.username,
        password: data.password,
      });
    } else {
      await registerMutation.mutateAsync(data);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50/50 py-8 px-4">
      <div className="container grid lg:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">
                {mode === "login" ? "تسجيل الدخول" : "إنشاء حساب جديد"}
              </CardTitle>
              <CardDescription className="text-center">
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
                        <FormLabel>اسم المستخدم</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>كلمة المرور</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {mode === "register" && (
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>نوع الحساب</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر نوع الحساب" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="student">طالب</SelectItem>
                              <SelectItem value="librarian">صاحب مكتبة</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loginMutation.isPending || registerMutation.isPending}
                  >
                    {mode === "login" ? "تسجيل الدخول" : "إنشاء حساب"}
                  </Button>
                </form>
              </Form>
              <div className="mt-4 text-center">
                <Button
                  variant="link"
                  onClick={() =>
                    setMode(mode === "login" ? "register" : "login")
                  }
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
          className="hidden lg:block"
        >
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              مرحباً بك في SnapSpeak
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              قم بتحويل النصوص من الصور إلى ملفات صوتية بكل سهولة. سجل دخولك الآن
              للبدء في استخدام التطبيق.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
