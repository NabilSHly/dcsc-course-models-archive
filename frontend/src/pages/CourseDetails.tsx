import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockCourses } from "@/lib/mockData";
import { OverviewTab } from "@/components/course-details/OverviewTab";
import { DocumentsTab } from "@/components/course-details/DocumentsTab";
import { GalleryTab } from "@/components/course-details/GalleryTab";
import { toast } from "sonner";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const course = mockCourses.find(c => c.id === Number(id));

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">لم يتم العثور على الدورة التدريبية</p>
          <Button onClick={() => navigate("/")} className="mt-4">
            العودة إلى لوحة التحكم
          </Button>
        </Card>
      </div>
    );
  }

  const handleDelete = () => {
    toast.success("تم حذف الدورة التدريبية بنجاح");
    navigate("/");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          العودة إلى لوحة التحكم
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/edit-course/${course.id}`)} className="gap-2">
            <Edit className="h-4 w-4" />
            تعديل
          </Button>
          <Button variant="destructive" onClick={handleDelete} className="gap-2">
            <Trash2 className="h-4 w-4" />
            حذف
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">{course.courseName}</h1>
          <p className="text-muted-foreground">رقم الدورة التدريبية: {course.courseNumber}</p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="documents">المستندات</TabsTrigger>
            <TabsTrigger value="gallery">المعرض</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab course={course} />
          </TabsContent>

          <TabsContent value="documents">
            <DocumentsTab course={course} />
          </TabsContent>

          <TabsContent value="gallery">
            <GalleryTab course={course} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default CourseDetails;
