import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";
import { Delivery } from "@shared/schema";

interface DataTableProps {
  deliveries: Delivery[];
  onViewDelivery?: (delivery: Delivery) => void;
}

export default function DataTable({ deliveries, onViewDelivery }: DataTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "delayed":
        return "bg-amber-100 text-amber-800";
      case "in-transit":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (date: string | Date | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: string | null, currency: string = "INR") => {
    if (!amount) return "-";
    const symbol = currency === "INR" ? "₹" : "$";
    return `${symbol}${parseFloat(amount).toLocaleString()}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-700">Recent Deliveries</h3>
          <div className="flex items-center space-x-3">
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent">
              <option>All Suppliers</option>
              <option>ABC Trading</option>
              <option>XYZ Suppliers</option>
              <option>PQR Industries</option>
            </select>
            <Button className="text-sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="text-xs font-medium text-neutral-600 uppercase tracking-wider">
                Supplier
              </TableHead>
              <TableHead className="text-xs font-medium text-neutral-600 uppercase tracking-wider">
                Material
              </TableHead>
              <TableHead className="text-xs font-medium text-neutral-600 uppercase tracking-wider">
                Quantity
              </TableHead>
              <TableHead className="text-xs font-medium text-neutral-600 uppercase tracking-wider">
                Expected
              </TableHead>
              <TableHead className="text-xs font-medium text-neutral-600 uppercase tracking-wider">
                Actual
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
            {deliveries.map((delivery) => (
              <TableRow key={delivery.id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {delivery.supplierName.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-neutral-700">
                        {delivery.supplierName}
                      </div>
                      <div className="text-sm text-neutral-600">
                        {delivery.source === "whatsapp" && "WhatsApp"}
                        {delivery.source === "email" && "Email"}
                        {delivery.source === "manual" && "Manual"}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-neutral-700">
                  {delivery.materialType}
                </TableCell>
                <TableCell className="text-sm text-neutral-700">
                  {delivery.quantity} {delivery.unit}
                </TableCell>
                <TableCell className="text-sm text-neutral-700">
                  {formatDate(delivery.expectedDate)}
                </TableCell>
                <TableCell className="text-sm text-neutral-700">
                  {formatDate(delivery.actualDate)}
                </TableCell>
                <TableCell>
                  <Badge className={`${getStatusColor(delivery.status)} border-0`}>
                    {delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDelivery?.(delivery)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
