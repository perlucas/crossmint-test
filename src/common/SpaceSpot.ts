export class SpaceSpot {
    constructor(
        public row: number, 
        public column: number
    ) {}

    cloneWithOffset(rowOffset: number, colOffset: number): SpaceSpot {
        return new SpaceSpot(
            this.row + rowOffset,
            this.column + colOffset
        )
    }
}