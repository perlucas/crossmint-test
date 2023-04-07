import { SpaceSpot } from "../phase-one";
import { AsyncTask } from "../task/AsyncTask";

export type EntityType = "SPACE"|"POLYANET"|"WHITE_SOLOON"|"BLUE_SOLOON"|"PURPLE_SOLOON"|'RED_SOLOON'|'DOWN_COMETH'|'UP_COMETH'|'LEFT_COMETH'|'RIGHT_COMETH'

export abstract class EntityBuilder {

    constructor(private next: EntityBuilder = null) {}

    abstract canBuild(reference: EntityType): boolean

    build(spot: SpaceSpot, reference: EntityType): AsyncTask {
        if (this.canBuild(reference)) {
            return this.buildEntity(spot, reference)
        }

        if (this.next !== null) {
            return this.next.build(spot, reference)
        }

        throw new Error(`reference ${reference} is unknown`)
    }

    protected abstract buildEntity(spot: SpaceSpot, reference: EntityType): AsyncTask
}