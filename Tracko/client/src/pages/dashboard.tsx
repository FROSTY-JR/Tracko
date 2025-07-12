import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MessageSquare, Truck, Building, Clock, TrendingUp, Download } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import StatsCard from "@/components/stats-card";
import DataTable from "@/components/data-table";
import { ProcessingStats, Delivery } from "@shared/schema";
import * as XLSX from 'xlsx';

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery<ProcessingStats>({
    queryKey: ["/api/stats"],
  });

  const { data: deliveries, isLoading: deliveriesLoading } = useQuery<Delivery[]>({
    queryKey: ["/api/deliveries"],
  });

  // Chart data
  const performanceData = [
    { name: "On-Time", value: 87.3, color: "#10B981" },
    { name: "Delayed", value: 8.7, color: "#F59E0B" },
    { name: "Cancelled", value: 4.0, color: "#EF4444" },
  ];

  const trendData = [
    { month: "Jan", onTime: 82, delayed: 12, cancelled: 6 },
    { month: "Feb", onTime: 85, delayed: 10, cancelled: 5 },
    { month: "Mar", onTime: 87, delayed: 9, cancelled: 4 },
    { month: "Apr", onTime: 89, delayed: 8, cancelled: 3 },
    { month: "May", onTime: 87, delayed: 9, cancelled: 4 },
    { month: "Jun", onTime: 91, delayed: 6, cancelled: 3 },
  ];

  const exportToExcel = () => {
    // Create sample metadata based on the dashboard data
    const metadata = [
      { Field: "App Name", Value: "Tracko" },
      { Field: "Export Date", Value: new Date().toLocaleDateString() },
      { Field: "Export Time", Value: new Date().toLocaleTimeString() },
      { Field: "Total Messages Processed", Value: stats?.messagesProcessed || 0 },
      { Field: "Total Documents Processed", Value: stats?.documentsProcessed || 0 },
      { Field: "On-Time Delivery Rate", Value: `${stats?.onTimeDeliveryRate || 0}%` },
      { Field: "Total Active Suppliers", Value: stats?.activeSuppliers || 0 },
    ];

    const performanceMetrics = [
      { Metric: "On-Time Deliveries", Percentage: "87.3%" },
      { Metric: "Delayed Deliveries", Percentage: "8.7%" },
      { Metric: "Cancelled Deliveries", Percentage: "4.0%" },
    ];

    const monthlyTrends = trendData.map(item => ({
      Month: item.month,
      "On-Time %": item.onTime,
      "Delayed %": item.delayed,
      "Cancelled %": item.cancelled,
    }));

    const supplierData = [
      { Supplier: "ABC Trading Co.", Rating: "4.5/5", "On-Time Rate": "92%", Status: "Active" },
      { Supplier: "XYZ Industries", Rating: "4.2/5", "On-Time Rate": "88%", Status: "Active" },
      { Supplier: "Global Suppliers Ltd", Rating: "4.8/5", "On-Time Rate": "95%", Status: "Active" },
    ];

    const recentDeliveries = deliveries?.slice(0, 5).map(delivery => ({
      ID: delivery.id,
      Supplier: delivery.supplierName,
      Material: delivery.materialType,
      Quantity: delivery.quantity,
      Status: delivery.status,
      Date: delivery.createdAt ? new Date(delivery.createdAt).toLocaleDateString() : 'N/A',
    })) || [];

    // Create workbook
    const workbook = XLSX.utils.book_new();
    
    // Add worksheets
    const metadataSheet = XLSX.utils.json_to_sheet(metadata);
    const performanceSheet = XLSX.utils.json_to_sheet(performanceMetrics);
    const trendsSheet = XLSX.utils.json_to_sheet(monthlyTrends);
    const suppliersSheet = XLSX.utils.json_to_sheet(supplierData);
    const deliveriesSheet = XLSX.utils.json_to_sheet(recentDeliveries);
    
    XLSX.utils.book_append_sheet(workbook, metadataSheet, "Metadata");
    XLSX.utils.book_append_sheet(workbook, performanceSheet, "Performance");
    XLSX.utils.book_append_sheet(workbook, trendsSheet, "Monthly Trends");
    XLSX.utils.book_append_sheet(workbook, suppliersSheet, "Suppliers");
    XLSX.utils.book_append_sheet(workbook, deliveriesSheet, "Recent Deliveries");
    
    // Export file
    const fileName = `Tracko_Dashboard_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  if (statsLoading || deliveriesLoading) {
    return (
      <div className="flex-1 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border">
                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-16 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-x-hidden overflow-y-auto">
      {/* Top Bar */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-neutral-700">Dashboard</h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search deliveries..."
                className="w-64 pl-10"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-600" />
            </div>
            <Button
              onClick={exportToExcel}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export to Excel</span>
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-neutral-600">Auto-sync active</span>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Messages Processed"
            value={stats?.messagesProcessed || 0}
            icon={<MessageSquare className="w-6 h-6 text-primary" />}
            change="+12.5%"
            changeType="positive"
            subtitle="from last month"
          />
          <StatsCard
            title="On-Time Deliveries"
            value={`${stats?.onTimeDeliveryRate || 0}%`}
            icon={<Truck className="w-6 h-6 text-green-500" />}
            change="+3.2%"
            changeType="positive"
            subtitle="from last week"
          />
          <StatsCard
            title="Active Suppliers"
            value={stats?.activeSuppliers || 0}
            icon={<Building className="w-6 h-6 text-amber-500" />}
            change="+2"
            changeType="positive"
            subtitle="new this month"
          />
          <StatsCard
            title="Time Saved"
            value={`${stats?.timeSavedHours || 0}h`}
            icon={<Clock className="w-6 h-6 text-red-500" />}
            subtitle="per day average"
          />
        </div>

        {/* Charts and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Delivery Trend Chart */}
          <Card className="border border-gray-200 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-neutral-700 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                Delivery Trends (6 Months)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="onTime" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      name="On-Time (%)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="delayed" 
                      stroke="#F59E0B" 
                      strokeWidth={2}
                      name="Delayed (%)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="cancelled" 
                      stroke="#EF4444" 
                      strokeWidth={2}
                      name="Cancelled (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance and Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Performance Chart */}
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-neutral-700">
                Delivery Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={performanceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {performanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-neutral-700">
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-700">
                      Delivery confirmed from ABC Trading
                    </p>
                    <p className="text-xs text-neutral-600">
                      500 units of raw materials - 2 minutes ago
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">📄</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-700">
                      Invoice processed from XYZ Suppliers
                    </p>
                    <p className="text-xs text-neutral-600">
                      ₹75,000 - 15 minutes ago
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">⏰</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-700">
                      Delivery delay from PQR Industries
                    </p>
                    <p className="text-xs text-neutral-600">
                      Expected tomorrow - 1 hour ago
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <DataTable deliveries={deliveries || []} />
      </main>
    </div>
  );
}
