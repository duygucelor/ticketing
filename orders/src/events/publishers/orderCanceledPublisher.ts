import { Publisher, Subjects, OrderCanceledEvent } from "@tixcuborg/common";

export class OrderCanceledPublisher extends Publisher<OrderCanceledEvent> {
  readonly subject = Subjects.OrderCanceled;
}
