import { useState } from "react";
import { BookOpen, Users, Clock, Plus, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { CourseTable } from "./CourseTable";
import { mockCourses } from "@/lib/mockData";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const totalCourses = mockCourses.length;
  const totalGraduates = mockCourses.reduce((sum, course) => sum + course.numberOfGraduates, 0);
  const totalHours = mockCourses.reduce((sum, course) => sum + course.courseHours, 0);

  const filteredCourses = mockCourses.filter(course =>
    course.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.courseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.trainerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">إجمالي الدورات</p>
              <p className="text-3xl font-bold text-foreground">{totalCourses}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
              <Users className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">إجمالي الخريجين</p>
              <p className="text-3xl font-bold text-foreground">{totalGraduates}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
              <Clock className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">إجمالي الساعات</p>
              <p className="text-3xl font-bold text-foreground">{totalHours}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold text-foreground">أرشيف الدورات</h2>
          <Button onClick={() => navigate("/add-course")} className="gap-2">
            <Plus className="h-4 w-4" />
            إضافة دورة جديدة
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="البحث باسم الدورة التدريبية أو الرقم أو المدرب..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <CourseTable courses={filteredCourses} />
      </Card>
    </div>
  );
};
