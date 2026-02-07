"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config/config"));
const productsController_1 = require("./controllers/productsController");
app_1.default.listen(config_1.default.port, async () => {
    console.log(`Server running on port ${config_1.default.port}`);
    console.log('Sprawdzanie promocji przy starcie serwera...');
    try {
        await (0, productsController_1.handleDailyPromotions)();
    }
    catch (err) {
        console.error('Nie udało się zainicjować promocji przy starcie:', err);
    }
});
