import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CloudUpload, Camera, FileText, AlertCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onUploadSuccess?: (document: any) => void;
}

export default function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("documentType", "invoice");

      const response = await apiRequest("POST", "/api/documents/upload", formData);
      const document = await response.json();

      toast({
        title: "Upload successful",
        description: `${file.name} has been uploaded and is being processed.`,
      });

      onUploadSuccess?.(document);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  }, [toast, onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpg', '.jpeg', '.png'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
  });

  return (
    <Card className="border border-gray-200">
      <CardContent className="p-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-gray-300 hover:border-primary"
          }`}
        >
          <input {...getInputProps()} />
          
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <CloudUpload className="w-8 h-8 text-gray-400" />
          </div>
          
          <h4 className="text-lg font-medium text-neutral-700 mb-2">
            {uploading ? "Uploading..." : "Upload Documents"}
          </h4>
          
          <p className="text-sm text-neutral-600 mb-4">
            {isDragActive
              ? "Drop the file here..."
              : "Drag and drop files here, or click to browse"}
          </p>
          
          <div className="flex items-center justify-center space-x-4">
            <Button 
              disabled={uploading}
              className="bg-primary hover:bg-primary/90"
            >
              <FileText className="w-4 h-4 mr-2" />
              Choose Files
            </Button>
            <Button variant="outline" disabled={uploading}>
              <Camera className="w-4 h-4 mr-2" />
              Take Photo
            </Button>
          </div>
          
          <p className="text-xs text-neutral-500 mt-3">
            Supports: PDF, JPG, PNG, DOC, DOCX (Max 10MB)
          </p>
        </div>

        {uploading && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span className="text-sm text-blue-700">
                Processing your document...
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
