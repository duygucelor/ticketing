import { ExpirationCompleteEvent, Publisher, Subjects } from "@tixcuborg/common";

  
  export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
  }