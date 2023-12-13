// wasm.ts
import Context from "https://deno.land/std@0.93.0/wasi/snapshot_preview1.ts";
import { implimentation as fetchImplimentation } from "./wasi/fetch.ts";
import { implimentation as legacyImplimentation } from "./wasi/legacy.ts";

export async function executeWasm(filePath: string): Promise<void> {
    const context = new Context({
        args: Deno.args,
        env: Deno.env.toObject(),
    });

    const bytes = await Deno.readFile(filePath);
    const module = await WebAssembly.compile(bytes);
    const instance = await WebAssembly.instantiate(module, {
        // attach main wasm module
        "wasi_snapshot_preview1": context.exports,

        // attach implimentations for WASI
        ...fetchImplimentation,
        ...legacyImplimentation
    });

    context.start(instance);
}
