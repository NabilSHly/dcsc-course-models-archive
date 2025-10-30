import { GraduationCap, LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { logout } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export const Header = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "تم تسجيل الخروج",
      description: "تم تسجيل الخروج بنجاح.",
    });
    navigate("/login");
  };

  return (
    <header className="border-b bg-card shadow-sm">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
          <div className="flex h-15 w-12 items-center justify-center bg-primary/10 p-1 rounded-lg ">
            <img src="/cropped-log1o.png" alt="Logo" className="" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
       مركز تطوير البلديات و دعم اللامركزية
            </h1>
            <p className="text-sm text-muted-foreground">نظام أرشفة النماذج التدريبية </p>
          </div>
          </div>
          <div className="flex  gap-2">
            <Button className="bg-primary/10" variant="outline" size="icon" onClick={() => navigate("/settings")} title="الإعدادات">
              <Settings className="h-4 w-4" />
            </Button>
            <Button className="bg-primary/10" variant="outline" size="icon" onClick={handleLogout} title="تسجيل الخروج">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
