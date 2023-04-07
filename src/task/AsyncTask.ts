export abstract class AsyncTask {

    abstract attemptExecution(): Promise<void>

    abstract isRunning(): boolean

    abstract isCompleted(): boolean

    abstract dependencies(): AsyncTask[]
}