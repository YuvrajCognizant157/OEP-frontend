import {AdminQuestion} from './admin-question.model';

export interface AdminExam {    
    eid: number;
    name: string;
    description?: string;
    totalMarks: number;
    duration?: number;
    submittedForApproval: boolean;
    revieweId: number;   
    questions: AdminQuestion[];
}