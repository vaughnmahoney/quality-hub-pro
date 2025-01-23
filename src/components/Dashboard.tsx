import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { createOptimoRouteApi } from "@/services/optimoRouteApi";
import { Order } from "@/types/optimaflow";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { OrderReview } from "./OrderReview";
import { useToast } from "@/components/ui/use-toast";

const api = createOptimoRouteApi("YOUR_API_KEY"); // We'll handle this properly later

// MOCK DATA - DELETE WHEN IMPLEMENTING REAL API
const MOCK_ORDERS: Order[] = [
  {
    orderNo: "ORDER-001",
    data: {
      orderNo: "ORDER-001",
      location: {
        locationName: "Downtown Office Building",
        locationNo: "LOC-001",
        address: "123 Business Ave",
        lat: 37.7749,
        lng: -122.4194
      },
      notes: "Monthly maintenance check required. Check all HVAC units on floors 1-3.",
      date: "2024-03-15"
    },
    scheduleInformation: {
      driverName: "John Smith",
      scheduledAtDt: "2024-03-15T09:00:00Z",
      stopNumber: 1
    }
  },
  {
    orderNo: "ORDER-002",
    data: {
      orderNo: "ORDER-002",
      location: {
        locationName: "Sunset Mall",
        locationNo: "LOC-002",
        address: "789 Shopping Center Blvd",
        lat: 37.7833,
        lng: -122.4167
      },
      notes: "Emergency repair needed for escalator on second floor.",
      date: "2024-03-15"
    },
    scheduleInformation: {
      driverName: "Sarah Johnson",
      scheduledAtDt: "2024-03-15T13:30:00Z",
      stopNumber: 2
    }
  },
  {
    orderNo: "ORDER-003",
    data: {
      orderNo: "ORDER-003",
      location: {
        locationName: "Tech Park Building B",
        locationNo: "LOC-003",
        address: "456 Innovation Drive",
        lat: 37.7833,
        lng: -122.4167
      },
      notes: "Quarterly inspection of server room cooling systems.",
      date: "2024-03-15"
    },
    scheduleInformation: {
      driverName: "Mike Wilson",
      scheduledAtDt: "2024-03-15T15:45:00Z",
      stopNumber: 3
    }
  }
];
// END MOCK DATA

export function Dashboard() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { toast } = useToast();

  // Keep the original query but use mock data for now
  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      // MOCK DATA RETURN - DELETE WHEN IMPLEMENTING REAL API
      return MOCK_ORDERS;
      
      // Original API call - uncomment when implementing real API
      // const response = await api.searchOrders(["DEMO_ORDER"]);
      // return response.orders;
    },
  });

  const handleFlagOrder = (order: Order) => {
    toast({
      title: "Order Flagged",
      description: `Order ${order.orderNo} has been flagged for review.`,
    });
    setSelectedOrder(null);
  };

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
        {selectedOrder ? (
          <OrderReview
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onFlag={handleFlagOrder}
          />
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
