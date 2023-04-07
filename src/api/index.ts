import { SpaceSpot } from "../phase-one"
import fetch, {Response} from 'node-fetch'

const ResponseInit = {
    status: 500,
    statusText: 'circuit breaker open',
    headers: { 'Content-Type': 'application/json' }
};

const erroredResponse = new Response(JSON.stringify({}), ResponseInit)

const MAX_REQUESTS = 5

let requestsCount = 0

const makeRequest = async (path: string, method: string, payload: any = null): Promise<Response> => {
    if (requestsCount >= MAX_REQUESTS) {
        return erroredResponse
    }

    const requestConfig: any = {
        headers: { 'Content-Type': 'application/json' },
        method
    }

    if (payload !== null) {
        requestConfig.body = JSON.stringify({
            ...payload,
            candidateId: process.env.CANDIDATE_ID
        })
    }

    requestsCount++

    const response = await fetch(`${process.env.API_URL}${path}`, requestConfig)
  
    requestsCount--

    return response
}

export const deleteEntity = (spot: SpaceSpot): Promise<Response> => {
    return makeRequest('/polyanets', 'DELETE', {
        row: spot.row,
        column: spot.column,
    })
}


export const createPolyanet = (spot: SpaceSpot): Promise<Response> => {
    return makeRequest('/polyanets', 'POST', {
        row: spot.row,
        column: spot.column,
    })
}


export const createSoloon = (spot: SpaceSpot, color: string): Promise<Response> => {
    return makeRequest('/soloons', 'POST', {
        row: spot.row,
        column: spot.column,
        color
    })
}


export const createCometh = (spot: SpaceSpot, direction: string): Promise<Response> => {
    return makeRequest('/comeths', 'POST', {
        row: spot.row,
        column: spot.column,
        direction
    })
}


export const getMap = (): Promise<Response> => {
    return makeRequest(`/map/${process.env.CANDIDATE_ID}`, 'GET')
}


export const getMegaverseMap = (): Promise<Response> => {
    return makeRequest(`/map/${process.env.CANDIDATE_ID}/goal`, 'GET')
}
