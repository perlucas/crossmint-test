import { Response } from "node-fetch";
import { sleep } from "../utils";
import { AsyncTask } from "./AsyncTask";

export class AsyncRequestTask extends AsyncTask {

    private running: boolean
    private completed: boolean

    constructor(
        private makeRequest: () => Promise<Response>,
        private requestSucceeded: (r: Response) => Promise<boolean>,
        private deps: AsyncTask[],
        private waitingRateMS: number = 1000
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

        await sleep(this.waitingRateMS)

        try {
            const response = await this.makeRequest()
    
            const requestSucceeded = await this.requestSucceeded(response)
    
            this.completed = requestSucceeded
        } catch (err) {
            this.completed = false
        } finally {
            this.running = false
        }

    }
}