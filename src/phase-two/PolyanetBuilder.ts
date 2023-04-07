import { Response } from "node-fetch";
import { createPolyanet } from "../api";
import { SpaceSpot } from "../phase-one";
import { AsyncRequestTask } from "../task/AsyncRequestTask";
import { AsyncTask } from "../task/AsyncTask";
import { EntityBuilder, EntityType } from "./EntityBuilder";

export class PolyanetBuilder extends EntityBuilder {

    canBuild(reference: EntityType): boolean {
        return reference === 'POLYANET'
    }

    protected buildEntity(spot: SpaceSpot, reference: EntityType): AsyncTask {
        return new AsyncRequestTask(
            () => {
                console.log(`CREATING POLYANET (${spot.row}, ${spot.column})`)
                return createPolyanet(spot)
            },
            (response: Response) => {
                console.log(`POLYANET (${spot.row}, ${spot.column}) CREATION FINISHED status: ${response.status}`)
                return Promise.resolve(response.status === 200)
            },
            []
        )
    }
}