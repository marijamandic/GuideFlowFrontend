import { CheckpointStatus } from "./checkpoint-status.model";

export interface TourExecution {
    id: number;
    tourId: number;
    userId: number;
    tourRange: number;
    startTime: Date;
    endTime: Date;
    lastActivity: Date;
    executionStatus: ExecutionStatus;
    checkpointsStatus : CheckpointStatus[];
}
export enum ExecutionStatus {
    Active = 0,         
    Completed = 1, 
    Abandoned = 2        
}