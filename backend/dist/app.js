"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const productsRoutes_1 = __importDefault(require("./routes/productsRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const ordersRoutes_1 = __importDefault(require("./routes/ordersRoutes"));
const errorHandler_1 = require("./middlewares/errorHandler");
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/api/auth', authRoutes_1.default);
app.use('/api/products', productsRoutes_1.default);
app.use('/api/orders', ordersRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use(errorHandler_1.errorHandler);
exports.default = app;
