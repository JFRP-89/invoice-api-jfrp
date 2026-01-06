"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateInvoiceUseCase = CreateInvoiceUseCase;
const crypto_1 = __importDefault(require("crypto"));
async function CreateInvoiceUseCase(repository, input) {
    const requiredFields = ['clientCif', 'clientName', 'clientAddress', 'baseAmount', 'vatAmount'];
    for (const field of requiredFields) {
        if (input[field] === undefined || input[field] === null) {
            return {
                success: false,
                error: `El campo '${field}' es obligatorio`,
            };
        }
    }
    const invoice = {
        id: crypto_1.default.randomUUID(),
        clientCif: input.clientCif,
        clientName: input.clientName,
        clientAddress: input.clientAddress,
        baseAmount: input.baseAmount,
        vatAmount: input.vatAmount,
        totalAmount: input.baseAmount + input.vatAmount,
        invoiceNumber: null,
        status: 'draft',
        createdAt: new Date().toISOString(),
        finalizedAt: null,
    };
    await repository.save(invoice);
    return {
        success: true,
        invoice,
    };
}
