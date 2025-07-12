import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Edit, MessageSquare, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { WhatsappMessage } from "@shared/schema";

export default function WhatsAppParser() {
  const { data: messages, isLoading } = useQuery<WhatsappMessage[]>({
    queryKey: ["/api/whatsapp-messages"],
  });

  const formatDate = (date: string | Date) => {
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
      case "review":
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
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
      case "review":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  return (
    <div className="flex-1 overflow-x-hidden overflow-y-auto">
      {/* Top Bar */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-neutral-700">WhatsApp Parser</h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-neutral-600">Connected to WhatsApp Business API</span>
          </div>
        </div>
      </header>

      <main className="p-6">
        {/* Status and Demo Section */}
        <Card className="border border-gray-200 mb-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-neutral-700">
              WhatsApp Message Parser
            </CardTitle>
            <p className="text-sm text-neutral-600">
              Automatically extract delivery data from WhatsApp messages
            </p>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-neutral-700 mb-2">Webhook Status</h4>
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-neutral-700">Connected to WhatsApp Business API</span>
              </div>
              <p className="text-sm text-neutral-600">
                Webhook URL: <code className="bg-white px-2 py-1 rounded text-xs">
                  {window.location.origin}/api/webhook/whatsapp
                </code>
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-neutral-700 mb-3">Sample Message Processing</h4>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-neutral-700 mb-2"><strong>Incoming Message:</strong></p>
                  <p className="text-sm text-neutral-600 italic">
                    "Hi, delivered 200 bags of rice to Mumbai factory today at 3pm. Invoice attached."
                  </p>
                  <p className="text-xs text-neutral-500 mt-2">
                    From: +91 9876543210 (ABC Trading Co.)
                  </p>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-neutral-700 mb-2"><strong>Extracted Data:</strong></p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Supplier:</span>
                      <span className="text-neutral-700 font-medium">ABC Trading Co.</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Material:</span>
                      <span className="text-neutral-700 font-medium">Rice</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Quantity:</span>
                      <span className="text-neutral-700 font-medium">200 bags</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Location:</span>
                      <span className="text-neutral-700 font-medium">Mumbai factory</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Status:</span>
                      <Badge className="bg-green-100 text-green-800 border-0">Delivered</Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-neutral-700 mb-3">Processing Statistics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-primary">1,247</div>
                    <div className="text-sm text-neutral-600">Messages Processed</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-500">94.2%</div>
                    <div className="text-sm text-neutral-600">Accuracy Rate</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-amber-500">23</div>
                    <div className="text-sm text-neutral-600">Pending Review</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-neutral-700">3.2s</div>
                    <div className="text-sm text-neutral-600">Avg Processing Time</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Parsed Messages */}
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-neutral-700">
              Recent Parsed Messages
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
                        Timestamp
                      </TableHead>
                      <TableHead className="text-xs font-medium text-neutral-600 uppercase tracking-wider">
                        Supplier
                      </TableHead>
                      <TableHead className="text-xs font-medium text-neutral-600 uppercase tracking-wider">
                        Message
                      </TableHead>
                      <TableHead className="text-xs font-medium text-neutral-600 uppercase tracking-wider">
                        Extracted Data
                      </TableHead>
                      <TableHead className="text-xs font-medium text-neutral-600 uppercase tracking-wider">
                        Status
                      </TableHead>
                      <TableHead className="text-xs font-medium text-neutral-600 uppercase tracking-wider">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {messages?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-neutral-500">
                          No WhatsApp messages found. Messages will appear here once processed.
                        </TableCell>
                      </TableRow>
                    ) : (
                      messages?.map((message) => (
                        <TableRow key={message.id} className="hover:bg-gray-50">
                          <TableCell className="text-sm text-neutral-700">
                            {formatDate(message.timestamp)}
                          </TableCell>
                          <TableCell className="text-sm text-neutral-700">
                            {message.senderName}
                          </TableCell>
                          <TableCell className="text-sm text-neutral-700 max-w-xs">
                            <div className="truncate" title={message.message}>
                              {message.message}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-neutral-700">
                            {message.extractedData ? (
                              <div className="space-y-1">
                                {Object.entries(message.extractedData as any).map(([key, value]) => (
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
                              {getStatusIcon(message.processingStatus)}
                              <Badge className={`${getStatusColor(message.processingStatus)} border-0`}>
                                {message.processingStatus}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
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
