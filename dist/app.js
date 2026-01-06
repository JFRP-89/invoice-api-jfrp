"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetStore = resetStore;
const express_1 = __importDefault(require("express"));
const PostgresInvoiceRepository_1 = require("./repositories/PostgresInvoiceRepository");
const database_1 = require("./config/database");
const CreateInvoiceUseCase_1 = require("./use-cases/CreateInvoiceUseCase");
const GetInvoicesUseCase_1 = require("./use-cases/GetInvoicesUseCase");
const GetInvoiceByIdUseCase_1 = require("./use-cases/GetInvoiceByIdUseCase");
const FinalizeInvoiceUseCase_1 = require("./use-cases/FinalizeInvoiceUseCase");
const DeleteInvoiceUseCase_1 = require("./use-cases/DeleteInvoiceUseCase");
const requestLogger_1 = require("./middlewares/requestLogger");
const auth_1 = require("./middlewares/auth");
const app = (0, express_1.default)();
const invoiceRepository = new PostgresInvoiceRepository_1.PostgresInvoiceRepository(database_1.pool);
app.use(requestLogger_1.requestLogger);
app.use(express_1.default.json());
async function resetStore() {
    await invoiceRepository.reset();
}
app.get('/invoices', async (req, res) => {
    const status = req.query.status;
    const invoices = await (0, GetInvoicesUseCase_1.GetInvoicesUseCase)(invoiceRepository, { status });
    res.status(200).json(invoices);
});
app.post('/invoices', async (req, res) => {
    const result = await (0, CreateInvoiceUseCase_1.CreateInvoiceUseCase)(invoiceRepository, req.body);
    if (!result.success) {
        res.status(400).json({
            code: 400,
            message: result.error,
        });
        return;
    }
    res.status(201).json(result.invoice);
});
app.get('/invoices/:id', async (req, res) => {
    const result = await (0, GetInvoiceByIdUseCase_1.GetInvoiceByIdUseCase)(invoiceRepository, { id: req.params.id });
    if (!result.success) {
        res.status(result.code).json({
            code: result.code,
            message: result.error,
        });
        return;
    }
    res.status(200).json(result.invoice);
});
app.patch('/invoices/:id/finalize', async (req, res) => {
    const result = await (0, FinalizeInvoiceUseCase_1.FinalizeInvoiceUseCase)(invoiceRepository, { id: req.params.id });
    if (!result.success) {
        res.status(result.code).json({
            code: result.code,
            message: result.error,
        });
        return;
    }
    res.status(200).json(result.invoice);
});
app.delete('/invoices/:id', async (req, res) => {
    const result = await (0, DeleteInvoiceUseCase_1.DeleteInvoiceUseCase)(invoiceRepository, { id: req.params.id });
    if (!result.success) {
        res.status(result.code).json({
            code: result.code,
            message: result.error,
        });
        return;
    }
    res.status(204).send();
});
app.get('/protected', auth_1.auth, (req, res) => {
    res.status(200).json({ message: 'Acceso autorizado' });
});
exports.default = app;
