import { z } from "zod"

const Player = z.object({
    name: z.string(),
    color: z.number(),
})

const GameState = z.object({
    players: z.array(Player),
    rounds: z.array(z.array(z.number())),
    current: z.number()
})

export type Player = z.infer<typeof Player>
export type GameState = z.infer<typeof GameState>

export const initialState = (players: Player[]): GameState => ({
    players,
    rounds: [Array(players.length).fill(0)],
    current: 0
})

export function nextRound(state: GameState) {
    state.current++
    if (state.rounds.length == state.current) {
        state.rounds.push(Array(state.players.length).fill(0))
    }
}

export function prevRound(state: GameState) {
    if (state.rounds.length == state.current + 1 &&
        state.rounds[state.current].every(v => v == 0)) {
        state.rounds.length--
    }
    state.current = Math.max(0, state.current - 1)
}

export function addScore(state: GameState, player: number, score: number) {
    state.rounds[state.current][player] += score
}

export function getScore(state: GameState, player: number) {
    return state.rounds[state.current][player]
}
