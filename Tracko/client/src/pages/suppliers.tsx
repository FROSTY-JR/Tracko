import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Building, Star, TrendingUp, Mail, Phone, MapPin } from "lucide-react";
import { Supplier } from "@shared/schema";

export default function Suppliers() {
  const { data: suppliers, isLoading } = useQuery<Supplier[]>({
    queryKey: ["/api/suppliers"],
  });

  const getRatingColor = (rating: string) => {
    const numRating = parseFloat(rating);
    if (numRating >= 4.5) return "text-green-600";
    if (numRating >= 4.0) return "text-yellow-600";
    if (numRating >= 3.5) return "text-orange-600";
    return "text-red-600";
  };

  const getPerformanceColor = (rate: string) => {
    const numRate = parseFloat(rate);
    if (numRate >= 90) return "bg-green-500";
    if (numRate >= 80) return "bg-yellow-500";
    if (numRate >= 70) return "bg-orange-500";
    return "bg-red-500";
  };

  const formatDate = (date: string | Date | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex-1 overflow-x-hidden overflow-y-auto">
      {/* Top Bar */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-neutral-700">Suppliers</h2>
          <Button className="bg-primary hover:bg-primary/90">
            <Building className="w-4 h-4 mr-2" />
            Add Supplier
          </Button>
        </div>
      </header>

      <main className="p-6">
        {/* Supplier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <Card key={i} className="border border-gray-200">
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-2 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-2 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            suppliers?.map((supplier) => (
              <Card key={supplier.id} className="border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {supplier.name.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-700">
                        {supplier.name}
                      </h3>
                      <div className="flex items-center space-x-1">
                        <Star className={`w-4 h-4 ${getRatingColor(supplier.rating || "0")}`} />
                        <span className={`text-sm font-medium ${getRatingColor(supplier.rating || "0")}`}>
                          {supplier.rating || "0.0"}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-neutral-600">On-Time Delivery</span>
                        <span className="text-sm font-medium text-neutral-700">
                          {supplier.onTimeDeliveryRate}%
                        </span>
                      </div>
                      <Progress
                        value={parseFloat(supplier.onTimeDeliveryRate || "0")}
                        className="h-2"
                        style={{
                          backgroundColor: getPerformanceColor(supplier.onTimeDeliveryRate || "0"),
                        }}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-neutral-600">
                      <Mail className="w-4 h-4" />
                      <span>{supplier.email || "No email"}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-neutral-600">
                      <Phone className="w-4 h-4" />
                      <span>{supplier.phone || "No phone"}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-neutral-600">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{supplier.address || "No address"}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <Badge className={supplier.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                      {supplier.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Supplier Performance Table */}
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-neutral-700">
              Supplier Performance Details
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
                        Supplier
                      </TableHead>
                      <TableHead className="text-xs font-medium text-neutral-600 uppercase tracking-wider">
                        Contact
                      </TableHead>
                      <TableHead className="text-xs font-medium text-neutral-600 uppercase tracking-wider">
                        Rating
                      </TableHead>
                      <TableHead className="text-xs font-medium text-neutral-600 uppercase tracking-wider">
                        On-Time %
                      </TableHead>
                      <TableHead className="text-xs font-medium text-neutral-600 uppercase tracking-wider">
                        Communication
                      </TableHead>
                      <TableHead className="text-xs font-medium text-neutral-600 uppercase tracking-wider">
                        Doc Accuracy
                      </TableHead>
                      <TableHead className="text-xs font-medium text-neutral-600 uppercase tracking-wider">
                        Cost Rating
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
                    {suppliers?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-neutral-500">
                          No suppliers found. Add your first supplier to get started.
                        </TableCell>
                      </TableRow>
                    ) : (
                      suppliers?.map((supplier) => (
                        <TableRow key={supplier.id} className="hover:bg-gray-50">
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">
                                  {supplier.name.substring(0, 2).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-neutral-700">
                                  {supplier.name}
                                </div>
                                <div className="text-xs text-neutral-500">
                                  {supplier.contactPerson || "No contact"}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-neutral-700">
                              <div>{supplier.email || "-"}</div>
                              <div className="text-xs text-neutral-500">
                                {supplier.phone || "-"}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Star className={`w-4 h-4 ${getRatingColor(supplier.rating || "0")}`} />
                              <span className={`text-sm font-medium ${getRatingColor(supplier.rating || "0")}`}>
                                {supplier.rating || "0.0"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${getPerformanceColor(supplier.onTimeDeliveryRate || "0")}`}
                                  style={{
                                    width: `${supplier.onTimeDeliveryRate}%`,
                                  }}
                                />
                              </div>
                              <span className="text-sm font-medium">
                                {supplier.onTimeDeliveryRate}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-neutral-700">
                              {supplier.communicationQuality}%
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-neutral-700">
                              {supplier.documentAccuracy}%
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-neutral-700">
                              {supplier.costCompetitiveness}%
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge className={
                              supplier.isActive 
                                ? "bg-green-100 text-green-800 border-0" 
                                : "bg-gray-100 text-gray-800 border-0"
                            }>
                              {supplier.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
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
