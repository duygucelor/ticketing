import { OrderStatus } from "./orderStatus";
import { Subjects } from "./subjects";

export interface OrderCreatedEvent {
  subject: Subjects.OrderCreated;
  data: {
    id: string;
    userId: string;
    expiresAt: string;
    status: OrderStatus;
    ticket: {
      id: string;
      price:number;
    };
  };
}
