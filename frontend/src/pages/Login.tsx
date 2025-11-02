import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import  AuthContext  from "@/context/AuthContext";
import api from "@/services/api";

const Login = () => {
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const { toast } = useToast();

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const trimmed = password.trim();
  if (!trimmed) return;             // avoid empty/whitespace submit
  setIsLoading(true);
  try {
    const res = await api.post("/auth/login", { password: trimmed });
    if (res?.data?.success && res?.data?.token) {
      const ok = login(res.data.token);   // pass only the token

      if (ok) {
        toast({ title: "تم تسجيل الدخول", description: "تم تسجيل الدخول بنجاح." });
        navigate("/");
      } else {
        toast({
          title: "فشل تسجيل الدخول",
          description: "انتهت صلاحية التذكرة أو غير صالحة.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "فشل تسجيل الدخول",
        description: res?.data?.message || "كلمة المرور غير صحيحة. حاول مرة أخرى.",
        variant: "destructive",
      });
    }
  } catch (err: unknown) {
    const message =
      (err as any)?.response?.data?.message ??
      "حدث خطأ أثناء محاولة تسجيل الدخول. حاول مرة أخرى.";
    toast({ title: "فشل تسجيل الدخول", description: message, variant: "destructive" });
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader dir="rtl" className="mx-auto max-w-2xl space-y-4">
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-between">
            <div className="relative h-16 w-16 shrink-0 rounded-full bg-primary/10 p-2 sm:h-20 sm:w-20">
              <img
                src="/cropped-log1o.png"
                alt="شعار مركز تطوير البلديات ودعم اللامركزية"
                className="h-full w-full object-contain"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="min-w-0 text-center sm:flex-1 sm:text-right">
              <CardTitle className="font-semibold leading-tight">نظام أرشفة النماذج التدريبية</CardTitle>
              <div className="mt-1 text-lg text-primary sm:text-xl">مركز تطوير البلديات و دعم اللامركزية</div>
            </div>
          </div>
          <CardDescription className="text-center text-muted-foreground sm:text-right">
            أدخل كلمة المرور للدخول إلى النظام
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" aria-busy={isLoading} autoComplete="on">
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPw ? "text" : "password"}
                  placeholder="أدخل كلمة المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  autoFocus
                  required
                  minLength={3}
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? "إخفاء كلمة المرور" : "عرض كلمة المرور"}
                  aria-pressed={showPw}
                  className="absolute inset-y-0 right-3 flex items-center"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
