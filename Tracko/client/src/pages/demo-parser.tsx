import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Sparkles, CheckCircle, Clock } from "lucide-react";
import { insertWhatsappMessageSchema, type InsertWhatsappMessage } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export default function DemoParser() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [senderName, setSenderName] = useState("");
  const [sampleMessage, setSampleMessage] = useState("");
  const [parsedResult, setParsedResult] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const sampleMessages = [
    "Hi, delivered 200 bags of rice to Mumbai factory today at 3pm. Invoice attached.",
    "Shipment of 500 tons raw steel delivered to Chennai plant on time. Quality looks good.",
    "Delayed delivery - 300 units electronics will reach Delhi warehouse by 5pm due to traffic.",
    "Confirmed: 1000 yards textile fabric delivered to Bangalore facility this morning.",
    "Invoice INV-2024-001 for ₹75,000 - 150 boxes components delivered to Pune factory."
  ];

  const processMessageMutation = useMutation({
    mutationFn: async (data: InsertWhatsappMessage) => {
      const response = await apiRequest("POST", "/api/whatsapp-messages", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Message processed successfully",
        description: "WhatsApp message has been parsed and added to the system.",
      });
      
      // Simulate AI processing result
      const mockResult = {
        supplier: senderName || "Auto-detected Supplier",
        material: extractMaterial(message),
        quantity: extractQuantity(message),
        location: extractLocation(message),
        status: extractStatus(message),
        date: new Date().toISOString().split('T')[0],
        confidence: 0.92
      };
      
      setParsedResult(mockResult);
      queryClient.invalidateQueries({ queryKey: ["/api/whatsapp-messages"] });
    },
    onError: () => {
      toast({
        title: "Processing failed",
        description: "Failed to process WhatsApp message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const extractMaterial = (text: string) => {
    const materials = ["rice", "steel", "electronics", "textile", "components"];
    const found = materials.find(m => text.toLowerCase().includes(m));
    return found ? found.charAt(0).toUpperCase() + found.slice(1) : "Raw Material";
  };

  const extractQuantity = (text: string) => {
    const match = text.match(/(\d+)\s*(bags|tons|units|yards|boxes)/i);
    return match ? `${match[1]} ${match[2]}` : "N/A";
  };

  const extractLocation = (text: string) => {
    const locations = ["Mumbai", "Chennai", "Delhi", "Bangalore", "Pune"];
    const found = locations.find(l => text.toLowerCase().includes(l.toLowerCase()));
    return found ? `${found} facility` : "Factory Location";
  };

  const extractStatus = (text: string) => {
    if (text.toLowerCase().includes("delivered")) return "delivered";
    if (text.toLowerCase().includes("delayed")) return "delayed";
    if (text.toLowerCase().includes("confirmed")) return "delivered";
    return "in-transit";
  };

  const handleProcess = async () => {
    if (!message.trim()) {
      toast({
        title: "Message required",
        description: "Please enter a WhatsApp message to process.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setParsedResult(null);

    // Simulate processing delay
    setTimeout(() => {
      processMessageMutation.mutate({
        senderId: "demo-user",
        senderName: senderName || "Demo Supplier",
        message: message.trim(),
        processingStatus: "processing",
        extractedData: null,
        confidence: null,
        deliveryId: null,
      });
      setIsProcessing(false);
    }, 2000);
  };

  const handleSampleMessage = (sample: string) => {
    setMessage(sample);
    setSampleMessage(sample);
  };

  const handleReset = () => {
    setMessage("");
    setSenderName("");
    setSampleMessage("");
    setParsedResult(null);
  };

  return (
    <div className="flex-1 overflow-x-hidden overflow-y-auto">
      {/* Top Bar */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-neutral-700">WhatsApp Parser Demo</h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-neutral-600">Demo mode active</span>
          </div>
        </div>
      </header>

      <main className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Demo Section */}
          <Card className="border border-gray-200 mb-6">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-neutral-700 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-primary" />
                Try WhatsApp Message Parser
              </CardTitle>
              <p className="text-sm text-neutral-600">
                Test how our AI extracts delivery information from WhatsApp messages
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-neutral-700 mb-3">Input Message</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="senderName" className="text-sm font-medium text-neutral-700">
                        Sender Name (Optional)
                      </Label>
                      <Input
                        id="senderName"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        placeholder="ABC Trading Co."
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="message" className="text-sm font-medium text-neutral-700">
                        WhatsApp Message
                      </Label>
                      <Textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Paste your WhatsApp message here..."
                        rows={4}
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="flex space-x-3">
                      <Button
                        onClick={handleProcess}
                        disabled={isProcessing || processMessageMutation.isPending}
                        className="bg-primary hover:bg-primary/90"
                      >
                        {isProcessing ? (
                          <>
                            <Clock className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Parse Message
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleReset}
                        disabled={isProcessing || processMessageMutation.isPending}
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-neutral-700 mb-3">Extracted Data</h4>
                  
                  {isProcessing ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                        <span className="text-sm text-blue-700">
                          Processing message with AI...
                        </span>
                      </div>
                    </div>
                  ) : parsedResult ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-green-700">
                          Successfully Parsed
                        </span>
                        <Badge className="bg-green-100 text-green-800 border-0">
                          {Math.round(parsedResult.confidence * 100)}% confidence
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Supplier:</span>
                          <span className="font-medium text-neutral-700">{parsedResult.supplier}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Material:</span>
                          <span className="font-medium text-neutral-700">{parsedResult.material}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Quantity:</span>
                          <span className="font-medium text-neutral-700">{parsedResult.quantity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Location:</span>
                          <span className="font-medium text-neutral-700">{parsedResult.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Status:</span>
                          <Badge className={`${
                            parsedResult.status === "delivered" ? "bg-green-100 text-green-800" :
                            parsedResult.status === "delayed" ? "bg-amber-100 text-amber-800" :
                            "bg-blue-100 text-blue-800"
                          } border-0`}>
                            {parsedResult.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Date:</span>
                          <span className="font-medium text-neutral-700">{parsedResult.date}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                      <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        Enter a message above to see extracted data
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sample Messages */}
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-neutral-700">
                Sample Messages
              </CardTitle>
              <p className="text-sm text-neutral-600">
                Try these sample messages to see how the parser works
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sampleMessages.map((sample, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      sampleMessage === sample
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleSampleMessage(sample)}
                  >
                    <p className="text-sm text-neutral-700 italic">
                      "{sample}"
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}