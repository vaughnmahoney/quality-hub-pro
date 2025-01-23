import { Order } from "@/types/optimaflow";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flag, CheckCircle, MapPin, Clock, User } from "lucide-react";
import { format } from "date-fns";

interface OrderReviewProps {
  order: Order | null;
  onClose: () => void;
  onFlag: (order: Order) => void;
}

export function OrderReview({ order, onClose, onFlag }: OrderReviewProps) {
  if (!order) return null;

  const formattedDate = order.data.date ? format(new Date(order.data.date), 'PPP') : 'Date not available';
  const scheduledTime = order.scheduleInformation?.scheduledAtDt 
    ? format(new Date(order.scheduleInformation.scheduledAtDt), 'p')
    : 'Time not available';

  return (
    <Card className="w-full animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Order Review</CardTitle>
        <Button variant="outline" onClick={onClose}>Close</Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col space-y-2">
            <h3 className="text-lg font-semibold">Order Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="font-medium">{order.data.location.locationName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>{formattedDate} at {scheduledTime}</span>
              </div>
              {order.scheduleInformation?.driverName && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>Technician: {order.scheduleInformation.driverName}</span>
                </div>
              )}
              <div>
                <Badge variant="outline">Stop #{order.scheduleInformation?.stopNumber || 'N/A'}</Badge>
              </div>
            </div>
          </div>

          {order.data.notes && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Notes</h3>
              <p className="text-gray-600">{order.data.notes}</p>
            </div>
          )}

          <div className="flex justify-between items-center pt-4">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => onFlag(order)}
            >
              <Flag className="h-4 w-4" />
              Flag for Review
            </Button>
            <Button className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Approve Order
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}