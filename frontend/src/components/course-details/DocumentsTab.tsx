import { FileText, Download } from "lucide-react";
import type { Course } from "@/lib/mockData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getDocumentTypeName } from "@/lib/mockData";

interface DocumentsTabProps {
  course: Course;
}

export const DocumentsTab = ({ course }: DocumentsTabProps) => {
  return (
    <div className="space-y-4 pt-6">
      {course.documents.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">لم يتم رفع أي مستندات بعد</p>
        </Card>
      ) : (
        course.documents.map((doc) => (
          <Card key={doc.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{getDocumentTypeName(doc.type)}</p>
                  <p className="text-sm text-muted-foreground">{doc.fileName}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                تحميل
              </Button>
            </div>
          </Card>
        ))
      )}
    </div>
  );
};
