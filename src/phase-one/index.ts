import { Response } from "node-fetch"
import { createPolyanet, deleteEntity, getMap } from "../api"
import { AsyncRequestTask } from "../task/AsyncRequestTask"
import { AsyncTask } from "../task/AsyncTask"
import { AsyncTaskGroup } from "../task/AsyncTaskGroup"
import { SpaceSpot } from "../common/SpaceSpot"

export { SpaceSpot }

const createCleanUpTasks = async (): Promise<AsyncTask[]> => {
    const response = await getMap()
    const jsonMap: any = await response.json()
    
    const { map: { content } } = jsonMap

    const cleanUpTasks = []
    for (let rowIndex = 0; rowIndex < content.length; rowIndex++) {

        const row = content[rowIndex]
        for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {

            const polyanet = row[columnIndex]
            if (polyanet !== null) {
                cleanUpTasks.push(
                    deletePolyanetTask(new SpaceSpot(rowIndex, columnIndex))
                )
            }
        }
    }
  
    return cleanUpTasks 
}

const deletePolyanetTask = (spot: SpaceSpot): AsyncRequestTask => {
    return new AsyncRequestTask(
        () => {
            console.log('running delete polyanet!', spot.row, spot.column)
            return deleteEntity(spot)
        },
        (response: Response) => {
            console.log(`POLYANET (${spot.row}, ${spot.column}) DELETION FINISHED WITH STATUS: `, response.status)
            return Promise.resolve(response.status === 200)
        },
        []
        )
    }
    
    const createPolyanetTask = (spot: SpaceSpot): AsyncRequestTask => {
        return new AsyncRequestTask(
            () => {
            console.log('running create polyanet!', spot.row, spot.column)
            return createPolyanet(spot)
        },
        (response: Response) => {
            console.log(`POLYANET (${spot.row}, ${spot.column}) CREATION FINISHED WITH STATUS: `, response.status)
            return Promise.resolve(response.status === 200)
        },
        []
    )
}

export const createCrossDrawing = async () => {
    
    // prepare clean up/map resetting tasks
    const cleanUpTasks = await createCleanUpTasks()
    

    // prepare drawing tasks
    const initialSpot = new SpaceSpot(2, 2)

    const crossLength = 7

    const crossDrawingTasks = []

    let currentOffset = 0
    while (currentOffset < crossLength) {
        const leftSpot = initialSpot.cloneWithOffset(currentOffset, currentOffset)
        crossDrawingTasks.push(
            createPolyanetTask(leftSpot)
        )
        
        const rightSpot = initialSpot.cloneWithOffset(currentOffset, crossLength - currentOffset - 1)
        crossDrawingTasks.push(
            createPolyanetTask(rightSpot)
        )
        
        currentOffset++
    }

    // build the whole workflow ==> 1) cleanup previous polyanets, 2) draw polyanet cross
    const mainTask = new AsyncTaskGroup(cleanUpTasks, crossDrawingTasks)
    const todos: AsyncTask[] = [mainTask]
    while (todos.filter(t => !t.isCompleted()).length > 0) {
        await Promise.all(todos.map(t => t.attemptExecution()))

        for (const task of todos) {

            // add dependencies to be resolved if any
            if (task.isCompleted()) {
                const deps = task.dependencies()
                deps.forEach(t => {
                    if (!todos.includes(t)) {
                        todos.push(t)
                    }
                })
            }
        }

    }
}