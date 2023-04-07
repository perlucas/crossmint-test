import { getMap, getMegaverseMap } from "../api"
import { SpaceSpot } from "../phase-one"
import { AsyncTask } from "../task/AsyncTask"
import { ComethBuilder } from "./ComethBuilder"
import { PolyanetBuilder } from "./PolyanetBuilder"
import { SoloonBuilder } from "./SoloonBuilder"
import { SpaceBuilder } from "./SpaceBuilder"

/**
 * this was added as the API returned 200 without actually creating the entity :(
 * this approach of comparing both maps wasn't initially thought of
 * 
 * @param {any} value
 * @returns {string}
 */
const referenceForCurrentMap = value => {
    if (value === null) {
        return 'SPACE'
    }

    if (value.type === 2) {

        return {
            'up': 'UP_COMETH',
            'down': 'DOWN_COMETH',
            'left': 'LEFT_COMETH',
            'right': 'RIGHT_COMETH',
        }[value.direction]

    }

    if (value.type === 0) {
        return "POLYANET"
    }

    if (value.type === 1) {
        return {
            'white': "WHITE_SOLOON",
            'blue': "BLUE_SOLOON",
            'purple': "PURPLE_SOLOON",
            'red': "RED_SOLOON"
        }[value.color]
    }

    return 'UNKNOWN'
}


export const createMegaverse = async () => {
 
    const buildersChain = new SpaceBuilder(
        new PolyanetBuilder(
            new SoloonBuilder(
                new ComethBuilder()
            )
        )
    )

    // read the target map reference
    const response = await getMegaverseMap()
    const mapJson: any = await response.json()
    const { goal: rows } = mapJson

    // read the current map
    const currentMapResponse = await getMap()
    const currentMapJson: any = await currentMapResponse.json()
    const { map: { content: currentRows } } = currentMapJson

    const drawingTasks: AsyncTask[] = []

    // assign drawing tasks to be performed
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        const row = rows[rowIndex]

        for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
            const entityReference = row[columnIndex]

            if (entityReference !== referenceForCurrentMap(currentRows[rowIndex][columnIndex])) {
                drawingTasks.push(
                    buildersChain.build(
                        new SpaceSpot(rowIndex, columnIndex),
                        entityReference
                    )
                )
            }    
        }   
    }

    // command the drawing using re-atttempts logic
    while (drawingTasks.filter(t => !t.isCompleted()).length > 0) {
        await Promise.all(drawingTasks.map(t => t.attemptExecution()))
    }

}