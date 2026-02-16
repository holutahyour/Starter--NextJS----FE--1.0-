export interface ISchoolEvent {
  id?: number;
  code?: string;
  eventName: string;
  eventVenue: string;
  eventStartDate: Date;
  eventEndDate: Date;
  eventUrl?: string;
  eventSponsor: string;
  eventDetail: string;
  eventSpeaker: string;
  eventImage?: string;
}

export interface ISchoolEventResponse {
  content: ISchoolEvent[];
}
