import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";

async function printInConsole(transport: StdioServerTransport, message: string) {
    await transport.send({
        jsonrpc: "2.0",
        method: "log",
        params: {message},
    });
}

export {printInConsole}
