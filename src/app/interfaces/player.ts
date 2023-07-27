export interface Player {
    [key: string]: number | string | boolean,
    id: string,
    name: string,
    team: number,
    score: number,
    goals: number,
    assists: number,
    saves: number,
    shots: number,
    boost: number,
    target: boolean,
    demos: number,
    touches: number,
    boostConsumption: number,
    speed: number,
    ticks: number
}