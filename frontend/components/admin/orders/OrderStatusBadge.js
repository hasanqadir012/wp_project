import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle 
} from "lucide-react";

export default function OrderStatusBadge({ status }) {
  const statusConfig = {
    Pending: {
      color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      icon: Clock,
    },
    Processing: {
      color: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      icon: Package,
    },
    Shipped: {
      color: "bg-purple-100 text-purple-800 hover:bg-purple-100",
      icon: Truck,
    },
    Delivered: {
      color: "bg-green-100 text-green-800 hover:bg-green-100",
      icon: CheckCircle,
    },
    Cancelled: {
      color: "bg-red-100 text-red-800 hover:bg-red-100",
      icon: XCircle,
    },
  };

  const config = statusConfig[status] || statusConfig.Pending;
  const StatusIcon = config.icon;

  return (
    <Badge 
      variant="outline" 
      className={`font-medium flex items-center gap-1 ${config.color}`}
    >
      <StatusIcon className="h-3.5 w-3.5" />
      <span>{status}</span>
    </Badge>
  );
}