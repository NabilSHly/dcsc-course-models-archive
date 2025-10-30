import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card } from "./ui/card";
import { FileText } from "lucide-react";
import { toast } from "sonner";
import type { Course } from "@/lib/mockData";
import { getCourseFields } from "@/lib/courseFields";

const courseSchema = z.object({
  courseNumber: z.string().min(1, "رقم الدورة مطلوب").max(32),
  courseCode: z.string().min(1, "كود الدورة مطلوب").max(32),
  courseField: z.string().min(1, "مجال الدورة مطلوب").max(64),
  courseName: z.string().min(1, "اسم الدورة مطلوب").max(128),
  numberOfBeneficiaries: z.coerce.number().min(1, "يجب أن يكون على الأقل 1"),
  numberOfGraduates: z.coerce.number().min(0, "لا يمكن أن يكون سالباً"),
  courseDuration: z.coerce.number().min(1, "يجب أن يكون يوم واحد على الأقل"),
  courseHours: z.coerce.number().min(1, "يجب أن تكون ساعة واحدة على الأقل"),
  courseVenue: z.string().min(1, "المكان مطلوب").max(128),
  courseStartDate: z.string().min(1, "تاريخ البدء مطلوب"),
  courseEndDate: z.string().min(1, "تاريخ الانتهاء مطلوب"),
  trainerName: z.string().min(1, "اسم المدرب مطلوب").max(128),
  trainerPhoneNumber: z.string().min(1, "رقم الهاتف مطلوب").max(32),
  notes: z.string().max(1000).optional(),
});

type CourseFormValues = z.infer<typeof courseSchema>;

interface CourseFormProps {
  course?: Course;
}

export const CourseForm = ({ course }: CourseFormProps) => {
  const navigate = useNavigate();
  const courseFields = getCourseFields();
  const [documents, setDocuments] = useState<{
    traineesDataForm?: File;
    trainerDataForm?: File;
    attendanceForm?: File;
    generalReportForm?: File;
    courseCertificate?: File;
  }>({});

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: course ? {
      courseNumber: course.courseNumber,
      courseCode: course.courseCode,
      courseField: course.courseField,
      courseName: course.courseName,
      numberOfBeneficiaries: course.numberOfBeneficiaries,
      numberOfGraduates: course.numberOfGraduates,
      courseDuration: course.courseDuration,
      courseHours: course.courseHours,
      courseVenue: course.courseVenue,
      courseStartDate: course.courseStartDate,
      courseEndDate: course.courseEndDate,
      trainerName: course.trainerName,
      trainerPhoneNumber: course.trainerPhoneNumber,
      notes: course.notes || "",
    } : {
      courseNumber: "",
      courseCode: "",
      courseField: "",
      courseName: "",
      numberOfBeneficiaries: 0,
      numberOfGraduates: 0,
      courseDuration: 1,
      courseHours: 0,
      courseVenue: "",
      courseStartDate: "",
      courseEndDate: "",
      trainerName: "",
      trainerPhoneNumber: "",
      notes: "",
    },
  });

  const handleFileChange = (type: keyof typeof documents, file: File | undefined) => {
    setDocuments(prev => ({
      ...prev,
      [type]: file
    }));
  };

  const onSubmit = (data: CourseFormValues) => {
    console.log(data);
    console.log('Documents:', documents);
    toast.success(course ? "تم تحديث الدورة بنجاح" : "تم إنشاء الدورة بنجاح");
    navigate("/");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="courseNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>رقم الدورة *</FormLabel>
                <FormControl>
                  <Input placeholder="مثال: MDC-2024-001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="courseCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>كود الدورة *</FormLabel>
                <FormControl>
                  <Input placeholder="مثال: GOV-ADM-101" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="courseField"
            render={({ field }) => (
              <FormItem>
                <FormLabel>المجال *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المجال" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {courseFields.map((cf) => (
                      <SelectItem key={cf.id} value={cf.name}>
                        {cf.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="courseName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>اسم الدورة *</FormLabel>
                <FormControl>
                  <Input placeholder="أدخل اسم الدورة" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="courseVenue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>المكان *</FormLabel>
                <FormControl>
                  <Input placeholder="مثال: مركز التدريب، القاعة الرئيسية" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="courseStartDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>تاريخ البدء *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="courseEndDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>تاريخ الانتهاء *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="courseDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>المدة (أيام) *</FormLabel>
                <FormControl>
                  <Input type="number" min="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="courseHours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>إجمالي الساعات *</FormLabel>
                <FormControl>
                  <Input type="number" min="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="numberOfBeneficiaries"
            render={({ field }) => (
              <FormItem>
                <FormLabel>عدد المستفيدين *</FormLabel>
                <FormControl>
                  <Input type="number" min="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="numberOfGraduates"
            render={({ field }) => (
              <FormItem>
                <FormLabel>عدد الخريجين *</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="trainerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>اسم المدرب *</FormLabel>
                <FormControl>
                  <Input placeholder="مثال: د. أحمد حسن" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="trainerPhoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>هاتف المدرب *</FormLabel>
                <FormControl>
                  <Input placeholder="مثال: 100 123 4567 20+" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ملاحظات (اختياري)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="أضف أي ملاحظات أو ملاحظات إضافية..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">مستندات الدورة</h3>
          </div>
          <p className="mb-6 text-sm text-muted-foreground">
            تحميل المستندات الرسمية للدورة (ملفات PDF موصى بها)
          </p>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                نموذج بيانات المتدربين
              </label>
              <div className="flex items-center gap-3">
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange('traineesDataForm', e.target.files?.[0])}
                  className="flex-1"
                />
                {documents.traineesDataForm && (
                  <span className="text-sm text-muted-foreground">
                    {documents.traineesDataForm.name}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                نموذج بيانات المدرب
              </label>
              <div className="flex items-center gap-3">
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange('trainerDataForm', e.target.files?.[0])}
                  className="flex-1"
                />
                {documents.trainerDataForm && (
                  <span className="text-sm text-muted-foreground">
                    {documents.trainerDataForm.name}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                نموذج الحضور
              </label>
              <div className="flex items-center gap-3">
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange('attendanceForm', e.target.files?.[0])}
                  className="flex-1"
                />
                {documents.attendanceForm && (
                  <span className="text-sm text-muted-foreground">
                    {documents.attendanceForm.name}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                نموذج التقرير العام
              </label>
              <div className="flex items-center gap-3">
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange('generalReportForm', e.target.files?.[0])}
                  className="flex-1"
                />
                {documents.generalReportForm && (
                  <span className="text-sm text-muted-foreground">
                    {documents.generalReportForm.name}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                شهادة الدورة
              </label>
              <div className="flex items-center gap-3">
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange('courseCertificate', e.target.files?.[0])}
                  className="flex-1"
                />
                {documents.courseCertificate && (
                  <span className="text-sm text-muted-foreground">
                    {documents.courseCertificate.name}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" size="lg">
            {course ? "تحديث الدورة" : "إنشاء الدورة"}
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={() => navigate("/")}>
            إلغاء
          </Button>
        </div>
      </form>
    </Form>
  );
};
