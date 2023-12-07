// index.ts
import { parse } from "https://deno.land/std/flags/mod.ts";
import { executeScript } from "./deno.ts";
import { executeWasm } from "./wasm.ts"; // Import the function to execute WebAssembly files

async function main() {
    const args = parse(Deno.args);

    if (args._.length === 0) {
        console.error("No file path provided.");
        return;
    }

    const filePath = args._[0];
    try {
        if ((filePath as any).endsWith(".ts")) {
            await executeScript(filePath as any); // Call to `.ts` files
        } else if ((filePath as any).endsWith(".wasm")) {
            await executeWasm(filePath as any); // Call the function to execute WebAssembly files
        } else {
            console.error("Unsupported file type.");
        }
    } catch (error) {
        console.error("An error occurred:", error.message);
    }
}

if (import.meta.main) {
    main();
}
