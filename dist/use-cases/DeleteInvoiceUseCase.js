"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteInvoiceUseCase = DeleteInvoiceUseCase;
async function DeleteInvoiceUseCase(repository, input) {
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
            error: 'No se puede eliminar una factura en estado final',
            code: 400,
        };
    }
    await repository.delete(input.id);
    return {
        success: true,
    };
}
