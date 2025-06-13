import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";

interface JsonRpcMessage {
    jsonrpc: '2.0';
    method: string;
    params: Record<string, any>;
    id?: string | number;
}

function sendError(transport: StdioServerTransport, error: Error, context: string) {
    const message: JsonRpcMessage = {
        jsonrpc: '2.0',
        method: 'error',
        params: {
            timestamp: new Date().toISOString(),
            context,
            error: {
                name: error.name,
                message: error.message,
                ...(process.env.NODE_ENV === 'development' && {stack: error.stack})
            }
        }
    };

    transport.send(message);
}

export {sendError};
