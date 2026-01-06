"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetInvoiceByIdUseCase = GetInvoiceByIdUseCase;
async function GetInvoiceByIdUseCase(repository, input) {
    const invoice = await repository.findById(input.id);
    if (!invoice) {
        return {
            success: false,
            error: 'Factura no encontrada',
            code: 404,
        };
    }
    return {
        success: true,
        invoice,
    };
}
