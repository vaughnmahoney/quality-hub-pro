import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { createOptimoRouteApi } from "@/services/optimoRouteApi";
import { Order } from "@/types/optimaflow";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function Dashboard() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { toast } = useToast();

  const { data: orders, isLoading, error } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      try {
        const api = createOptimoRouteApi(import.meta.env.VITE_OPTIMOROUTE_API_KEY || "");
        const response = await api.searchOrders(["DEMO_ORDER"]);
        return response.orders;
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        toast({
          variant: "destructive",
          title: "Error fetching orders",
          description: "Please check your API key and try again.",
        });
        throw err;
      }
    },
  });

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <AlertCircle className="w-12 h-12 text-danger" />
        <h2 className="text-xl font-semibold">Failed to load orders</h2>
        <p className="text-gray-600">Please check your API key and try again</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 animate-fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Quality Control Dashboard</h1>
        <p className="text-gray-600 mt-2">Review and manage orders</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold mb-2">Pending Review</h3>
          <p className="text-3xl font-bold text-primary">{orders?.length || 0}</p>
        </Card>
        
        <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold mb-2">Flagged Orders</h3>
          <p className="text-3xl font-bold text-warning">0</p>
        </Card>
        
        <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold mb-2">Completed Today</h3>
          <p className="text-3xl font-bold text-primary">0</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          <div className="space-y-4">
            {orders?.map((order) => (
              <div
                key={order.orderNo}
                className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{order.data.location.locationName}</h3>
                    <p className="text-sm text-gray-600">{order.data.date}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Review
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Flagged Orders</h2>
          <div className="flex items-center justify-center h-48 text-gray-500">
            No flagged orders
          </div>
        </Card>
      </div>
    </div>
  );
}