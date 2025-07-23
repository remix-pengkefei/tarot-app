"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
require("express-async-errors");
const errorHandler_1 = require("./middleware/errorHandler");
const divination_routes_1 = require("./routes/divination.routes");
const tarot_routes_1 = require("./routes/tarot.routes");
const spread_routes_1 = require("./routes/spread.routes");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((req, res, next) => {
    const originalSend = res.send;
    res.send = function (data) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        return originalSend.call(this, data);
    };
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        res.sendStatus(200);
        return;
    }
    next();
});
app.use(express_1.default.json());
app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});
app.use('/api/divination', divination_routes_1.divinationRouter);
app.use('/api/tarot', tarot_routes_1.tarotRouter);
app.use('/api/spreads', spread_routes_1.spreadRouter);
app.get('/api/health', (_req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.get('/api/cors-test', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.json({
        message: 'CORS test successful',
        headers: req.headers,
        origin: req.headers.origin,
        timestamp: new Date().toISOString()
    });
});
app.get('/', (_req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.json({ message: 'Tarot API is running', timestamp: new Date().toISOString() });
});
app.use(errorHandler_1.errorHandler);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`CORS headers will be added to all responses`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
});
//# sourceMappingURL=index.js.map