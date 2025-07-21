"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
require("express-async-errors");
const errorHandler_1 = require("./middleware/errorHandler");
const divination_routes_1 = require("./routes/divination.routes");
const tarot_routes_1 = require("./routes/tarot.routes");
const spread_routes_1 = require("./routes/spread.routes");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)({
    origin: [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        process.env.FRONTEND_URL || 'http://localhost:5173'
    ],
    credentials: true
}));
app.use(express_1.default.json());
app.use('/api/divination', divination_routes_1.divinationRouter);
app.use('/api/tarot', tarot_routes_1.tarotRouter);
app.use('/api/spreads', spread_routes_1.spreadRouter);
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.use(errorHandler_1.errorHandler);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map