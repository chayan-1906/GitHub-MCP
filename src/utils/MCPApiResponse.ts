class MCPApiResponse {
    accessToken: string | null | undefined;
    content?: {
        type: 'text' | 'image' | 'resource';
        text: string;
    }[];

    // [key: string]: any;

    constructor() {
        this.accessToken = null;
        this.content = [];
    }
}

export default MCPApiResponse;
