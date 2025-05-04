import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import { Clock, Package, Truck, CheckCircle, XCircle } from "lucide-react";
  
  export default function OrderStatusSelector({ currentStatus, onStatusChange }) {
    const statusOptions = [
      { value: "Pending", label: "Pending", icon: Clock },
      { value: "Processing", label: "Processing", icon: Package },
      { value: "Shipped", label: "Shipped", icon: Truck },
      { value: "Delivered", label: "Delivered", icon: CheckCircle },
      { value: "Cancelled", label: "Cancelled", icon: XCircle },
    ];
  
    return (
      <Select
        value={currentStatus}
        onValueChange={onStatusChange}
        className="inline-block w-40 ml-2"
      >
        <SelectTrigger className="h-8 text-xs">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((status) => {
            const Icon = status.icon;
            return (
              <SelectItem 
                key={status.value} 
                value={status.value}
                className="flex items-center gap-2"
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span>{status.label}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    );
  }