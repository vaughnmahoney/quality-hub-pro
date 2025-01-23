export interface Order {
  orderNo: string;
  data: {
    orderNo: string;
    location: {
      locationName: string;
      locationNo: string;
      address: string;
      lat: number;
      lng: number;
    };
    notes: string;
    date: string;
  };
  scheduleInformation: {
    driverName: string;
    scheduledAtDt: string;
    stopNumber: number;
  };
}

export interface OrderCompletion {
  orderNo: string;
  success: boolean;
  data: {
    form: {
      note: string;
      images: Array<{
        url: string;
        timestamp: string;
      }>;
      signature: {
        url: string;
        timestamp: string;
      };
    };
    startTime: string;
    endTime: string;
    tracking_url: string;
  };
}

export interface QCFlag {
  id: number;
  orderNo: string;
  category: string;
  reason: string;
  notes: string;
  urgent: boolean;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
}

export type FlagCategory = 
  | 'incomplete_work'
  | 'missing_photos'
  | 'quality_issues'
  | 'time_discrepancy'
  | 'other';