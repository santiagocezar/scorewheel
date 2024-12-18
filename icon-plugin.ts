import { getIcons, iconToSVG, expandIconSet } from '@iconify/utils'
import { loadCollectionFromFS } from "@iconify/utils/lib/loader/fs";

async function generateSymbols(pack: string, names: string[], overridePrefix?: string) {
    const iconPack = (await loadCollectionFromFS(pack))!
    expandIconSet(iconPack)

    const { icons = {}, not_found = [], prefix, aliases = {}} = getIcons(iconPack, names, true) ?? {}

    overridePrefix ??= prefix

    if (not_found.length)
        console.warn(`some icons were not found: ${not_found}`)

    let symbols = ""

    for (const name of names) {
        const icon = aliases[name]?.parent ?? name
        const { body, attributes } = iconToSVG(icons[icon]!)

        symbols += (
            `<symbol id="${overridePrefix}-${name}" viewBox="${attributes.viewBox}">` +
                body +
            '</symbol>'
        )
    }
    return symbols
}

export default function icons() {
    const virtualModuleId = 'icons:'
    const resolvedVirtualModuleId = '\0' + virtualModuleId

    return {
        name: 'icons', // required, will show up in warnings and errors
        resolveId(id: string) {
            if (id.startsWith(virtualModuleId)) {
                return id.replace(virtualModuleId, resolvedVirtualModuleId)
            }
        },
        async load(id: string) {
            if (id.startsWith(resolvedVirtualModuleId)) {
                const { pathname, searchParams } = new URL(id)
                console.log({ pathname, searchParams })
                const symbols = await generateSymbols(
                    pathname,
                    (searchParams.get('use') ?? "").split(","),
                    searchParams.get('prefix') ?? undefined // lol
                )
                const mod = `export default ${JSON.stringify(symbols)}`
                return mod
            }
        },
    }
}
