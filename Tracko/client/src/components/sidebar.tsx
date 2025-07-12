import { Link, useLocation } from "wouter";
import { Truck, BarChart3, MessageSquare, FileText, Building, PlusCircle, Sparkles } from "lucide-react";
import logoImage from "@assets/image-generator_1752264321616.png";

export default function Sidebar() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: BarChart3 },
    { path: "/whatsapp-parser", label: "WhatsApp Parser", icon: MessageSquare },
    { path: "/document-upload", label: "Document Upload", icon: FileText },
    { path: "/suppliers", label: "Suppliers", icon: Building },
    { path: "/manual-entry", label: "Manual Entry", icon: PlusCircle },
    { path: "/demo-parser", label: "Demo Parser", icon: Sparkles },
  ];

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 hidden md:block">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <img 
            src={logoImage} 
            alt="Tracko Logo" 
            className="w-10 h-10 object-contain"
          />
          <div>
            <h1 className="text-xl font-bold text-neutral-700">Tracko</h1>
            <p className="text-sm text-neutral-600">Smart Data Extraction</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-8">
        <div className="px-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            
            return (
              <Link key={item.path} href={item.path}>
                <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors cursor-pointer ${
                  isActive 
                    ? "bg-primary text-white" 
                    : "text-neutral-600 hover:bg-gray-50"
                }`}>
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
