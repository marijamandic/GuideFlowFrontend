import { Checkpoint } from "./checkpoint.model";

export interface CheckpointStatus {
    id: number;
    checkpointId: number;
    checkpoint: Checkpoint;
    completionTime: Date;
}