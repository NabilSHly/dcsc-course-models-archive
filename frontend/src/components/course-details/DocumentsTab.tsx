import { useState } from "react";
import { FileText, Download, Eye } from "lucide-react";
import type { Course } from "@/lib/mockData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getDocumentTypeName } from "@/lib/mockData";

interface DocumentsTabProps {
  course: Course;
}

export const DocumentsTab = ({ course }: DocumentsTabProps) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  
  // Group documents by type
  const documentsByType = course.documents.reduce((acc, doc) => {
    if (!acc[doc.type]) {
      acc[doc.type] = [];
    }
    acc[doc.type].push(doc);
    return acc;
  }, {} as Record<string, typeof course.documents>);

  const documentTypes = Object.keys(documentsByType);

  return (
    <div className="space-y-4 pt-6">
      {documentTypes.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">لم يتم رفع أي مستندات بعد</p>
        </Card>
      ) : (
        documentTypes.map((type) => {
          const docs = documentsByType[type];
          const docCount = docs.length;
          
          return (
            <Card key={type} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{getDocumentTypeName(type)}</p>
                    <p className="text-sm text-muted-foreground">
                      {docCount} {docCount === 1 ? 'ملف' : 'ملفات'}
                    </p>
                  </div>
                </div>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => setSelectedType(type)}>
                      <Eye className="h-4 w-4" />
                      عرض
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{getDocumentTypeName(type)}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                      {docs.map((doc) => (
                        <Card key={doc.id} className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                              <p className="text-sm text-foreground truncate">{doc.fileName}</p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="gap-2 flex-shrink-0"
                              onClick={() => {
                                // In a real app, this would download the file
                                console.log('Downloading:', doc.path);
                              }}
                            >
                              <Download className="h-4 w-4" />
                              تحميل
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </Card>
          );
        })
      )}
    </div>
  );
};
