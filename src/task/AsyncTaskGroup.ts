import { AsyncTask } from "./AsyncTask";

export class AsyncTaskGroup extends AsyncTask {

    private running: boolean
    private completed: boolean

    constructor(
        private tasks: AsyncTask[],
        private deps: AsyncTask[]
    ) {
        super()
        this.running = false
        this.completed = false
    }

    isRunning(): boolean {
        return this.running
    }

    isCompleted(): boolean {
        return this.completed
    }

    dependencies(): AsyncTask[] {
        return this.deps
    }

    async attemptExecution(): Promise<void> {
        if (this.completed) {
            return
        }

        this.running = true

        await Promise.all(this.tasks.map(t => t.attemptExecution()))

        this.running = false
        
        const unfulfilledTasks = this.tasks.filter(t => t.isCompleted())

        this.completed = unfulfilledTasks.length > 0
    }
}