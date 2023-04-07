import { Response } from "node-fetch";
import { deleteEntity } from "../api";
import { SpaceSpot } from "../phase-one";
import { AsyncRequestTask } from "../task/AsyncRequestTask";
import { AsyncTask } from "../task/AsyncTask";
import { EntityBuilder, EntityType } from "./EntityBuilder";

export class SpaceBuilder extends EntityBuilder {

    canBuild(reference: EntityType): boolean {
        return reference === 'SPACE'
    }

    protected buildEntity(spot: SpaceSpot, reference: EntityType): AsyncTask {
        return new AsyncRequestTask(
            () => {
                console.log(`CREATING SPACE (${spot.row}, ${spot.column})`)
                return deleteEntity(spot)
            },
            (response: Response) => {
                console.log(`SPACE (${spot.row}, ${spot.column}) CREATION FINISHED status: ${response.status}`)
                return Promise.resolve(response.status === 200)
            },
            []
        )
    }
}