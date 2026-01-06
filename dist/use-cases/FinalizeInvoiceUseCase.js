"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinalizeInvoiceUseCase = FinalizeInvoiceUseCase;
async function FinalizeInvoiceUseCase(repository, input) {
    const invoice = await repository.findById(input.id);
    if (!invoice) {
        return {
            success: false,
            error: 'Factura no encontrada',
            code: 404,
        };
    }
    if (invoice.status === 'final') {
        return {
            success: false,
            error: 'La factura ya está finalizada',
            code: 400,
        };
    }
    invoice.status = 'final';
    invoice.invoiceNumber = await repository.getNextInvoiceNumber();
    invoice.finalizedAt = new Date().toISOString();
    await repository.update(invoice);
    return {
        success: true,
        invoice: {
            id: invoice.id,
            invoiceNumber: invoice.invoiceNumber,
            status: invoice.status,
            finalizedAt: invoice.finalizedAt,
        },
    };
}
