import type * as z from 'zod'
import { nanoid } from 'nanoid'
import * as fflate from "fflate";
import * as base64 from "js-base64";

interface Game<T extends z.ZodTypeAny> {
    id: string
    schema: z.ZodDefault<T>
    getData(id: string, fromData?: string | null): z.infer<T>
    useData(dirty: (data: z.infer<T>) => boolean): z.infer<T>
    rematch(id: string): string
}

export function createGame<T extends z.ZodTypeAny>(game: string, schema: z.ZodDefault<T>, rematchTransform: (data: z.infer<T>) => z.infer<T>): Game<T> {
    return {
        id: game,
        schema,
        getData(id, fromData) {
            return getGameData(schema, id, fromData)
        },
        rematch(id) {
            const newMatch = rematchTransform(this.getData(id))
            const newID = nanoid()

            localStorage.setItem(newID, JSON.stringify(newMatch))
            return newID
        },
        useData(dirty) {
            return useGameData(schema, game, dirty)
        },
    }
}

export interface Recent {
    game: string
    id: string
    date: Date
}
export function getRecents(): Recent[] | null {
    let recents: Recent[] = []
    if (typeof localStorage === "undefined")
        return null

    try {
        recents = JSON.parse(localStorage.getItem("recents")!)
        if (!recents) recents = []
    } catch (err) {
        console.warn(err)
    }
    return recents.map(r => ({ ...r, date: new Date(r.date) }))
}
export function deleteRecent(id: string): Recent[] {
    let recents: Recent[] = []
    try {
        recents = JSON.parse(localStorage.getItem("recents")!)
        if (!recents) recents = []
    } catch (err) {
        console.warn(err)
    }
    const idx = recents.findIndex(v => v.id == id)
    if (idx >= 0) {
        recents.splice(idx, 1)
    }
    localStorage.setItem("recents", JSON.stringify(recents))
    localStorage.removeItem(id)
    return recents.map(r => ({ ...r, date: new Date(r.date) }))
}

function addToRecents(game: string, id: string) {
    let recents = getRecents()!

    const recentIndex = recents.findIndex(v => v.id == id)

    const date = new Date()

    if (recentIndex > 0) { // yes, not including index 0 is deliberate
        recents.splice(recentIndex, 1)
        recents.splice(0, 0, { game, id, date })
    }
    if (recentIndex < 0) {
        recents.splice(0, 0, { game, id, date })

    }

    localStorage.setItem("recents", JSON.stringify(recents))

}

export function getGameData<T extends z.ZodTypeAny>(schema: z.ZodDefault<T>, id: string, fromData: string | null = null): z.infer<T> {
    let parsed = schema._def.defaultValue()

    if (fromData) {
        const decoded = base64.toUint8Array(fromData)
        const decompressed = fflate.gunzipSync(decoded)
        const data = new TextDecoder().decode(decompressed)
        parsed = schema.parse(JSON.parse(data))
    } else {
        try {
            const serialized = localStorage.getItem(id)
            if (serialized) {
                const data = JSON.parse(serialized)
                parsed = schema.parse(data)
            }
        } catch (err) {
            console.error(err)
        }
    }

    return parsed
}

export function useGameData<T extends z.ZodTypeAny>(schema: z.ZodDefault<T>, game: string, dirty: (data: z.infer<T>) => boolean): { id: string, data: z.infer<T> } {
    let id = nanoid();
    const url = new URL(location.href)
    if (url.searchParams.has("id")) {
        id = url.searchParams.get("id")!
    } else {
        url.searchParams.set("id", id)
    }

    const dataParam = url.searchParams.get("data")
    url.searchParams.delete("data")

    history.replaceState(null, "", url)

    addToRecents(game, id)

    const mut = $state({ id, data: getGameData(schema, id, dataParam) })

    let autoSaveTaskID = -1;

    $effect(() => {
        const data = JSON.stringify(mut.data)
        if (dirty(mut.data)) {
            localStorage.setItem(id, data)
            console.log("saved!")
        }
    })
    return mut
}

export async function shareGameData(id: string) {
    const url = new URL(location.href);
    const data = localStorage.getItem(id)!
    const compressed = fflate.gzipSync(new TextEncoder().encode(data))
    const encoded = base64.fromUint8Array(compressed, true)
    url.searchParams.delete("id")
    url.searchParams.set("data", encoded)
    await navigator.share({
        title: "Compartir partida",
        url: url.toString(),
    })
}
