// wasm.ts
import Context from "https://deno.land/std@0.93.0/wasi/snapshot_preview1.ts";
import { implementation as fetchImplementation } from "./wasi/fetch.ts";
import { implementation as legacyImplementation } from "./wasi/legacy.ts";

export async function executeWasm(filePath: string): Promise<void> {
    const context = new Context({
        args: Deno.args,
        env: Deno.env.toObject(),
    });

    let instance;
    const bytes = await Deno.readFile(filePath);
    const module = await WebAssembly.compile(bytes);
    instance = await WebAssembly.instantiate(module, {
        // attach main wasm module
        "wasi_snapshot_preview1": context.exports,

        // attach implimentations for WASI
        ...fetchImplementation,
        ...legacyImplementation(instance)
    });

    context.start(instance);
}
