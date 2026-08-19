export interface zoomMeeting {
      _id: string;
      link: string;
      startTime: string;
      createdAt: string;
      updatedAt: string;
      __v: number;
}

export interface MeetingResponse {
      data: zoomMeeting[];
}
export type MeetingStatus = 'scheduled' | 'live' | 'completed';