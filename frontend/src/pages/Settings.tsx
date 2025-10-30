import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCourseFields, addCourseField, deleteCourseField } from "@/lib/courseFields";
import { login } from "@/lib/auth";
import { toast } from "sonner";

const Settings = () => {
  const navigate = useNavigate();
  const [courseFields, setCourseFields] = useState(getCourseFields());
  const [newFieldName, setNewFieldName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleAddField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFieldName.trim()) {
      toast.error("الرجاء إدخال اسم المجال");
      return;
    }
    
    const newField = addCourseField(newFieldName.trim());
    setCourseFields([...courseFields, newField]);
    setNewFieldName("");
    toast.success("تم إضافة المجال بنجاح");
  };

  const handleDeleteField = (id: number) => {
    deleteCourseField(id);
    setCourseFields(courseFields.filter(f => f.id !== id));
    toast.success("تم حذف المجال بنجاح");
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword || !newPassword) {
      toast.error("الرجاء ملء جميع الحقول");
      return;
    }

    if (!login(currentPassword)) {
      toast.error("كلمة المرور الحالية غير صحيحة");
      return;
    }

    // Update password in localStorage
    localStorage.setItem('appPassword', newPassword);
    setCurrentPassword("");
    setNewPassword("");
    toast.success("تم تغيير كلمة المرور بنجاح");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            العودة إلى لوحة التحكم
          </Button>
        </div>

        <h1 className="mb-8 text-3xl font-bold text-foreground">الإعدادات</h1>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Course Fields Section */}
          <Card className="p-6">
            <h2 className="mb-4 text-xl font-semibold text-foreground">إدارة المجالات</h2>
            
            <form onSubmit={handleAddField} className="mb-6">
              <Label htmlFor="newField" className="mb-2 block">
                إضافة مجال جديد
              </Label>
              <div className="flex gap-2">
                <Input
                  id="newField"
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  placeholder="اسم المجال"
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </form>

            <div className="space-y-2">
              <Label className="mb-2 block">المجالات الحالية</Label>
              {courseFields.length === 0 ? (
                <p className="text-sm text-muted-foreground">لا توجد مجالات متاحة</p>
              ) : (
                courseFields.map((field) => (
                  <div
                    key={field.id}
                    className="flex items-center justify-between rounded-lg border bg-card p-3"
                  >
                    <span className="text-foreground">{field.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteField(field.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Change Password Section */}
          <Card className="p-6">
            <h2 className="mb-4 text-xl font-semibold text-foreground">تغيير كلمة المرور</h2>
            
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">كلمة المرور الحالية *</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور الحالية"
                />
              </div>

              <div>
                <Label htmlFor="newPassword">كلمة المرور الجديدة *</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور الجديدة"
                />
              </div>

              <Button type="submit" className="w-full">
                تغيير كلمة المرور
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
