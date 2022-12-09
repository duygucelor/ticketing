import { Publisher, Subjects, TicketUpdatedEvent } from "@tixcuborg/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
