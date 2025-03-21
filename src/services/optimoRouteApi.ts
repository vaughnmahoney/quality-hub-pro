import { Order, OrderCompletion } from "@/types/optimaflow";

const BASE_URL = "https://api.optimoroute.com/v1";

export class OptimoRouteApi {
  private apiKey: string;
  private controller: AbortController;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.controller = new AbortController();
  }

  private async request<T>(endpoint: string, body: any): Promise<T> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}?key=${this.apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: this.controller.signal,
      });

      if (!response.ok) {
        if (response.status === 429) {
          // Implement exponential backoff
          throw new Error("Rate limit exceeded");
        }
        throw new Error(`API request failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API request error:", error);
      throw error;
    }
  }

  async searchOrders(orderNumbers: string[]): Promise<{ success: boolean; orders: Order[] }> {
    return this.request("/search_orders", {
      orders: orderNumbers.map(orderNo => ({ orderNo })),
      includeOrderData: true,
      includeScheduleInformation: true,
    });
  }

  async getOrderCompletion(orderNumbers: string[]): Promise<{ success: boolean; orders: OrderCompletion[] }> {
    return this.request("/order_completion", {
      orders: orderNumbers.map(orderNo => ({ orderNo })),
    });
  }

  abort() {
    this.controller.abort();
    this.controller = new AbortController();
  }
}

export const createOptimoRouteApi = (apiKey: string) => new OptimoRouteApi(apiKey);