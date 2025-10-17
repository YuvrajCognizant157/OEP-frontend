export interface Topic {
    topicId: number;
    topicName: string;
    createdBy?: string;
    approvedBy: string;
    status?: string;
}