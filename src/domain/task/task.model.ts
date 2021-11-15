export interface Task {
    id: string;
    queue: string;
    status: 'WAITING'
        | 'QUEUED'
        | 'PAUSED'
        | 'FAILED'
        | 'CANCELLED'
        | 'STARTED'
        | 'ENDED';
    startedAt?: Date;
    endedAt?: Date;
    queuedAt?: Date;
    progress: number;
    failedReason?: string;
    config?: any;
}
