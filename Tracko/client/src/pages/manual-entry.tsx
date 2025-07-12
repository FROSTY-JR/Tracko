import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Save, X } from "lucide-react";
import { insertDeliverySchema, type InsertDelivery, type Supplier } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export default function ManualEntry() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [notifySupplier, setNotifySupplier] = useState(false);

  const { data: suppliers } = useQuery<Supplier[]>({
    queryKey: ["/api/suppliers"],
  });

  const form = useForm<InsertDelivery>({
    resolver: zodResolver(insertDeliverySchema.extend({
      expectedDate: insertDeliverySchema.shape.expectedDate.optional(),
      actualDate: insertDeliverySchema.shape.actualDate.optional(),
    })),
    defaultValues: {
      supplierName: "",
      materialType: "",
      quantity: "",
      unit: "units",
      status: "pending",
      currency: "INR",
      deliveryLocation: "",
      notes: "",
      source: "manual",
      processingStatus: "completed",
    },
  });

  const createDeliveryMutation = useMutation({
    mutationFn: async (data: InsertDelivery) => {
      const response = await apiRequest("POST", "/api/deliveries", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Delivery entry has been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/deliveries"] });
      form.reset();
      setNotifySupplier(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save delivery entry. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertDelivery) => {
    // Convert date strings to Date objects
    const formattedData = {
      ...data,
      expectedDate: data.expectedDate ? new Date(data.expectedDate) : null,
      actualDate: data.actualDate ? new Date(data.actualDate) : null,
      invoiceAmount: data.invoiceAmount || null,
    };

    createDeliveryMutation.mutate(formattedData);
  };

  const handleSupplierChange = (supplierId: string) => {
    const supplier = suppliers?.find(s => s.id === parseInt(supplierId));
    if (supplier) {
      form.setValue("supplierId", supplier.id);
      form.setValue("supplierName", supplier.name);
    }
  };

  const handleReset = () => {
    form.reset();
    setNotifySupplier(false);
  };

  return (
    <div className="flex-1 overflow-x-hidden overflow-y-auto">
      {/* Top Bar */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-neutral-700">Manual Data Entry</h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-neutral-600">Ready for input</span>
          </div>
        </div>
      </header>

      <main className="p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-neutral-700">
                Manual Data Entry
              </CardTitle>
              <p className="text-sm text-neutral-600">
                Add delivery information manually or correct extracted data
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="supplier" className="text-sm font-medium text-neutral-700">
                      Supplier Name
                    </Label>
                    <Select onValueChange={handleSupplierChange}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select supplier..." />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers?.map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id.toString()}>
                            {supplier.name}
                          </SelectItem>
                        ))}
                        <SelectItem value="new">+ Add New Supplier</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="materialType" className="text-sm font-medium text-neutral-700">
                      Material Type
                    </Label>
                    <Input
                      id="materialType"
                      className="mt-2"
                      placeholder="e.g., Raw Steel, Electronics"
                      {...form.register("materialType")}
                    />
                  </div>

                  <div>
                    <Label htmlFor="quantity" className="text-sm font-medium text-neutral-700">
                      Quantity
                    </Label>
                    <div className="flex space-x-2 mt-2">
                      <Input
                        id="quantity"
                        type="number"
                        className="flex-1"
                        placeholder="100"
                        {...form.register("quantity")}
                      />
                      <Select onValueChange={(value) => form.setValue("unit", value)}>
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="units">units</SelectItem>
                          <SelectItem value="tons">tons</SelectItem>
                          <SelectItem value="kg">kg</SelectItem>
                          <SelectItem value="bags">bags</SelectItem>
                          <SelectItem value="boxes">boxes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="expectedDate" className="text-sm font-medium text-neutral-700">
                      Expected Delivery Date
                    </Label>
                    <Input
                      id="expectedDate"
                      type="date"
                      className="mt-2"
                      {...form.register("expectedDate")}
                    />
                  </div>

                  <div>
                    <Label htmlFor="actualDate" className="text-sm font-medium text-neutral-700">
                      Actual Delivery Date
                    </Label>
                    <Input
                      id="actualDate"
                      type="date"
                      className="mt-2"
                      {...form.register("actualDate")}
                    />
                  </div>

                  <div>
                    <Label htmlFor="status" className="text-sm font-medium text-neutral-700">
                      Delivery Status
                    </Label>
                    <Select onValueChange={(value) => form.setValue("status", value)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select status..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="in-transit">In Transit</SelectItem>
                        <SelectItem value="delayed">Delayed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="invoiceAmount" className="text-sm font-medium text-neutral-700">
                      Invoice Amount
                    </Label>
                    <div className="flex space-x-2 mt-2">
                      <Select onValueChange={(value) => form.setValue("currency", value)}>
                        <SelectTrigger className="w-20">
                          <SelectValue placeholder="₹" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INR">₹</SelectItem>
                          <SelectItem value="USD">$</SelectItem>
                          <SelectItem value="EUR">€</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        id="invoiceAmount"
                        type="number"
                        className="flex-1"
                        placeholder="50000"
                        {...form.register("invoiceAmount")}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="deliveryLocation" className="text-sm font-medium text-neutral-700">
                      Delivery Location
                    </Label>
                    <Input
                      id="deliveryLocation"
                      className="mt-2"
                      placeholder="e.g., Mumbai Factory, Warehouse A"
                      {...form.register("deliveryLocation")}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes" className="text-sm font-medium text-neutral-700">
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    rows={3}
                    className="mt-2"
                    placeholder="Additional notes about the delivery..."
                    {...form.register("notes")}
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="notify-supplier"
                      checked={notifySupplier}
                      onCheckedChange={setNotifySupplier}
                    />
                    <Label htmlFor="notify-supplier" className="text-sm text-neutral-700">
                      Notify supplier about status update
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleReset}
                      disabled={createDeliveryMutation.isPending}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createDeliveryMutation.isPending}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {createDeliveryMutation.isPending ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Save Entry
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
