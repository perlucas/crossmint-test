import { Response } from "node-fetch";
import { createCometh } from "../api";
import { SpaceSpot } from "../phase-one";
import { AsyncRequestTask } from "../task/AsyncRequestTask";
import { AsyncTask } from "../task/AsyncTask";
import { EntityBuilder, EntityType } from "./EntityBuilder";

const directionsMap = {
    'DOWN_COMETH': 'down',
    'UP_COMETH': 'up',
    'LEFT_COMETH': 'left',
    'RIGHT_COMETH': 'right'
}

export class ComethBuilder extends EntityBuilder {

    canBuild(reference: EntityType): boolean {
        return Object.keys(directionsMap).includes(reference)
    }

    protected buildEntity(spot: SpaceSpot, reference: EntityType): AsyncTask {
        return new AsyncRequestTask(
            () => {
                console.log(`CREATING COMETH (${spot.row}, ${spot.column})`)
                return createCometh(spot, directionsMap[reference])
            },
            (response: Response) => {
                console.log(`COMETH (${spot.row}, ${spot.column}) CREATION FINISHED status: ${response.status}`)
                return Promise.resolve(response.status === 200)
            },
            []
        )
    }
}