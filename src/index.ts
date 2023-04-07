import { createCrossDrawing } from "./phase-one"
import dotenv from 'dotenv'
import { createMegaverse } from "./phase-two"

dotenv.config()


// phase 1: create cross drawing
// uncomment to test

/*
console.log('generating polyanet cross drawing...')

createCrossDrawing()
    .then(() => console.log('polyanet drawing finished'))
    .catch(err => {
        console.error('polyanet drawing has failed!')
        console.error(err)
    })
*/

// phase 2: create megaverse
// uncomment to test

createMegaverse()
console.log('generating megaverse...')

createMegaverse()
    .then(() => console.log('megaverse finished!'))
    .catch(err => {
        console.error('megaverse drawing has failed!')
        console.error(err)
    })