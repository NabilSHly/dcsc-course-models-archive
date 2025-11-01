import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CourseForm } from "@/components/CourseForm";
import { mockCourses } from "@/lib/mockData";

const AddEditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const course = isEdit ? mockCourses.find(c => c.id === Number(id)) : undefined;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          العودة إلى لوحة التحكم
        </Button>
      </div>

      <Card className="p-6">
        <h1 className="mb-6 text-3xl font-bold text-foreground">
          {isEdit ? "تعديل الدورة التدريبية" : "إضافة دورة جديدة"}
        </h1>
        <CourseForm course={course} />
      </Card>
    </div>
  );
};

export default AddEditCourse;
