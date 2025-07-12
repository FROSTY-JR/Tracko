import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Eye, Download, CheckCircle, Clock, AlertCircle } from "lucide-react";
import FileUpload from "@/components/file-upload";
import { Document } from "@shared/schema";

export default function DocumentUpload() {
  const { data: documents, isLoading, refetch } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
  });

  const [uploadedDocuments, setUploadedDocuments] = useState<Document[]>([]);

  const handleUploadSuccess = (document: Document) => {
    setUploadedDocuments(prev => [document, ...prev]);
    refetch();
  };

  const formatDate = (date: string | Date | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "processing":
        return <Clock className="w-4 h-4 text-amber-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) return "🗟";
    if (fileType.includes("image")) return "📷";
    if (fileType.includes("word")) return "📄";
    return "📎";
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "-";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`;
  };

  return (
    <div className="flex-1 overflow-x-hidden overflow-y-auto">
      {/* Top Bar */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-neutral-700">Document Upload</h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-neutral-600">OCR service active</span>
          </div>
        </div>
      </header>

      <main className="p-6">
        {/* Upload Section */}
        <Card className="border border-gray-200 mb-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-neutral-700">
              Document Upload & Processing
            </CardTitle>
            <p className="text-sm text-neutral-600">
              Upload invoices, PDFs, and receipts for automatic data extraction
            </p>
          </CardHeader>
          <CardContent>
            <FileUpload onUploadSuccess={handleUploadSuccess} />
            
            {/* Processing Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-700">Invoice Processing</h4>
                    <p className="text-sm text-neutral-600">Extract supplier, amounts, dates</p>
                  </div>
                </div>
                <div className="text-sm text-neutral-600">
                  <CheckCircle className="w-4 h-4 inline mr-2 text-green-500" />
                  OCR enabled
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-lg">🚚</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-700">Delivery Receipts</h4>
                    <p className="text-sm text-neutral-600">Track delivery confirmations</p>
                  </div>
                </div>
                <div className="text-sm text-neutral-600">
                  <CheckCircle className="w-4 h-4 inline mr-2 text-green-500" />
                  Table detection
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-lg">🤝</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-700">Contracts</h4>
                    <p className="text-sm text-neutral-600">Extract key terms and dates</p>
                  </div>
                </div>
                <div className="text-sm text-neutral-600">
                  <CheckCircle className="w-4 h-4 inline mr-2 text-green-500" />
                  AI processing
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Uploads */}
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-neutral-700">
              Recent Uploads
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="text-xs font-medium text-neutral-600 uppercase tracking-wider">
                        File Name
                      </TableHead>
                      <TableHead className="text-xs font-medium text-neutral-600 uppercase tracking-wider">
                        Type
                      </TableHead>
                      <TableHead className="text-xs font-medium text-neutral-600 uppercase tracking-wider">
                        Size
                      </TableHead>
                      <TableHead className="text-xs font-medium text-neutral-600 uppercase tracking-wider">
                        Upload Date
                      </TableHead>
                      <TableHead className="text-xs font-medium text-neutral-600 uppercase tracking-wider">
                        Processing Status
                      </TableHead>
                      <TableHead className="text-xs font-medium text-neutral-600 uppercase tracking-wider">
                        Extracted Data
                      </TableHead>
                      <TableHead className="text-xs font-medium text-neutral-600 uppercase tracking-wider">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...uploadedDocuments, ...(documents || [])].length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-neutral-500">
                          No documents uploaded yet. Upload your first document to get started.
                        </TableCell>
                      </TableRow>
                    ) : (
                      [...uploadedDocuments, ...(documents || [])].map((document) => (
                        <TableRow key={document.id} className="hover:bg-gray-50">
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <span className="text-lg">
                                {getFileIcon(document.fileType)}
                              </span>
                              <span className="text-sm font-medium text-neutral-700">
                                {document.fileName}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-neutral-700">
                            {document.documentType}
                          </TableCell>
                          <TableCell className="text-sm text-neutral-700">
                            {formatFileSize(document.fileSize)}
                          </TableCell>
                          <TableCell className="text-sm text-neutral-700">
                            {formatDate(document.uploadedAt)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(document.processingStatus)}
                              <Badge className={`${getStatusColor(document.processingStatus)} border-0`}>
                                {document.processingStatus}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-neutral-700">
                            {document.extractedData ? (
                              <div className="space-y-1">
                                {Object.entries(document.extractedData as any).slice(0, 2).map(([key, value]) => (
                                  <div key={key} className="text-xs">
                                    <span className="font-medium">{key}:</span> {String(value)}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
