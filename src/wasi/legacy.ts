export const implimentation = (wasmInstance: any) => {
    return {
        "blockless_http": {
        "httpOpen": async function (urlPtr: number, urlLen: number, statusCodePtr: number): Promise<number> {
            // Access WebAssembly memory
            const memory = new Uint8Array(wasmInstance.exports.memory.buffer);
        
            // Read URL from WebAssembly memory
            const urlBytes = memory.slice(urlPtr, urlPtr + urlLen);
            const url = new TextDecoder().decode(urlBytes);
        
            try {
                const response = await fetch(url);
                const statusCode = response.status;
        
                // Write status code back to WebAssembly memory
                new DataView(memory.buffer).setUint32(statusCodePtr, statusCode, true); // Assuming little-endian
        
                return 0; // Return 0 for success
            } catch (error) {
                console.error("HTTP request failed:", error);
                return 1; // Return non-zero for error
            }
        }
        
    },
}
}