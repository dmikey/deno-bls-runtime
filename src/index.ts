// index.ts
import { parse } from "https://deno.land/std/flags/mod.ts";
import { executeScript } from "./deno.ts";
import { executeWasm } from "./wasm.ts"; // Import the function to execute WebAssembly files

// Version of your CLI application
const CLI_VERSION = "0.4.0-deno";

async function main() {
    const args = parse(Deno.args, {
        boolean: ["v", "version"],
        alias: { v: "version" }
    });

    // Check for version flag
    if (args.version) {
        console.log(`CLI Version: ${CLI_VERSION}`);
        return;
    }

    // Check if a file path is provided
    if (args._.length === 0) {
        console.error("No file path provided.");
        return;
    }

    const filePath:any = args._[0];
    try {
        if (filePath.endsWith(".ts")) {
            await executeScript(filePath); // Call to `.ts` files
        } else if (filePath.endsWith(".wasm")) {
            await executeWasm(filePath); // Call the function to execute WebAssembly files
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
