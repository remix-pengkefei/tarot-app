"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiService = void 0;
const claude_service_1 = require("./claude.service");
const openai_service_1 = require("./openai.service");
const getAIService = () => {
    const aiService = process.env.AI_SERVICE || 'openai';
    switch (aiService.toLowerCase()) {
        case 'claude':
            console.log('Using Claude AI service');
            return claude_service_1.claudeService;
        case 'openai':
        default:
            console.log('Using OpenAI service');
            return openai_service_1.openaiService;
    }
};
exports.aiService = getAIService();
//# sourceMappingURL=ai.service.js.map