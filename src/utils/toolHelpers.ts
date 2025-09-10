import { tools } from './constants';

// Helper function to get all tools with their metadata
const getAllTools = () => {
    return Object.keys(tools).map(key => {
        const tool = tools[key as keyof typeof tools];
        return typeof tool === 'string' ? null : tool;
    }).filter(Boolean);
};

const getToolsByCategory = () => {
    const toolsArray = getAllTools();
    const grouped: Record<string, any[]> = {};

    toolsArray.forEach(tool => {
        if (tool && tool.category) {
            if (!grouped[tool.category]) {
                grouped[tool.category] = [];
            }
            grouped[tool.category].push(tool);
        }
    });

    return grouped;
}

export { getToolsByCategory };
