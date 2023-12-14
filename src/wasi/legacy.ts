export const implementation = (wasmInstance: any) => {
    const responseMap = new Map<number, Response>();
    let nextFileDescriptor = 1;

    function generateFileDescriptor(): number {
        return nextFileDescriptor++;
    }

    async function httpOpen(urlPtr: number, urlLen: number, fdPtr: number): Promise<number> {
        const memory = new Uint8Array(wasmInstance.exports.memory.buffer);
        const urlBytes = memory.slice(urlPtr, urlPtr + urlLen);
        const url = new TextDecoder().decode(urlBytes);

        try {
            const response = await fetch(url);
            const fd = generateFileDescriptor();
            responseMap.set(fd, response);

            new DataView(memory.buffer).setUint32(fdPtr, fd, true); // Assuming little-endian
            console.log(`[httpOpen] Opened FD ${fd} for URL: ${url}`);
            return 0;
        } catch (error) {
            console.error("HTTP request failed:", error);
            return 1;
        }
    }

    async function httpReadBody(fd: number, bufPtr: number, bufLen: number, numPtr: number): Promise<number> {
        console.log(`[httpReadBody] Reading body with FD: ${fd}`);
        try {
            const response = responseMap.get(fd);
            if (!response) {
                console.error(`Invalid file descriptor: ${fd}`);
                return 1;
            }

            const reader = response.body.getReader();
            const { value, done } = await reader.read();
            if (done) {
                return 0;
            }

            const memory = new Uint8Array(wasmInstance.exports.memory.buffer);
            const chunk = value.slice(0, bufLen);
            memory.set(chunk, bufPtr);
            new DataView(memory.buffer).setUint32(numPtr, chunk.length, true);

            return 0;
        } catch (error) {
            console.error("Failed to read HTTP body:", error);
            return 1;
        }
    }

    async function httpClose(fd: number): Promise<number> {
        console.log(`[httpClose] Closing FD: ${fd}`);
        try {
            const response = responseMap.get(fd);
            if (!response) {
                console.error("Invalid file descriptor:", fd);
                return 1;
            }

            if (response.body && response.body.locked) {
                const reader = response.body.getReader();
                await reader.cancel();
            }

            responseMap.delete(fd);
            return 0;
        } catch (error) {
            console.error("Failed to close HTTP connection:", error);
            return 1;
        }
    }

    return {
        "blockless_http": {
            "http_req": httpOpen,
            "http_read_body": httpReadBody,
            "http_close": httpClose,
        },
    };
};
