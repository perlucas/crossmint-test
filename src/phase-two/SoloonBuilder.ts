import { Response } from "node-fetch";
import { createSoloon } from "../api";
import { SpaceSpot } from "../phase-one";
import { AsyncRequestTask } from "../task/AsyncRequestTask";
import { AsyncTask } from "../task/AsyncTask";
import { EntityBuilder, EntityType } from "./EntityBuilder";

const colorsMap = {
    'WHITE_SOLOON': 'white',
    'BLUE_SOLOON': 'blue',
    'PURPLE_SOLOON': 'purple',
    'RED_SOLOON': 'red'
}

export class SoloonBuilder extends EntityBuilder {

    canBuild(reference: EntityType): boolean {
        return Object.keys(colorsMap).includes(reference)
    }

    protected buildEntity(spot: SpaceSpot, reference: EntityType): AsyncTask {
        return new AsyncRequestTask(
            () => {
                console.log(`CREATING SOLOON (${spot.row}, ${spot.column})`)
                return createSoloon(spot, colorsMap[reference])
            },
            (response: Response) => {
                console.log(`SOLOON (${spot.row}, ${spot.column}) CREATION FINISHED status: ${response.status}`)
                return Promise.resolve(response.status === 200)
            },
            []
        )
    }
}