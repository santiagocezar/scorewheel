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

interface PackOptions {
    prefix?: string
    use: string[]
}

export default function icons(opts: Record<string, PackOptions>) {
    const virtualModuleId = 'icons:symbols'
    const resolvedVirtualModuleId = '\0' + virtualModuleId

    return {
        name: 'icons', // required, will show up in warnings and errors
        resolveId(id: string) {
            if (id == virtualModuleId) {
                return resolvedVirtualModuleId
            }
        },
        async load(id: string) {
            if (id == resolvedVirtualModuleId) {
                const symbols = await Promise.all(
                    Object.entries(opts).map(([name, opts]) => (
                        generateSymbols(
                            name,
                            opts.use,
                            opts.prefix
                        )
                    ))
                ).then(symbols => symbols.reduce((a, b) => a + b))

                const mod = `export default ${JSON.stringify(symbols)}`
                return mod
            }
        },
    }
}
