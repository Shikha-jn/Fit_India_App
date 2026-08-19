export interface RecordedMeeting {
      _id: string;
      title: string;
      description: string;
      link: string;
      recordedAt: string;
      createdAt: string;
      updatedAt: string;
      __v?: number;
}

export interface RecordedMeetingResponse {
      data: RecordedMeeting[];
}