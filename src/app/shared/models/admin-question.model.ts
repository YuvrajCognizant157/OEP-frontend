export interface AdminQuestion
{
    qid: number;
    question:string;
    options:string|{ [key: string]: string };
}