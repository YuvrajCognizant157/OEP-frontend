export interface ExamApprovalStatus
{
    eid:number;
    status: 'approve' | 'reject';
    userId?: number;
}