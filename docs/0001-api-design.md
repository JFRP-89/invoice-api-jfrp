# API REST - Gestión de Facturas

## Requisitos

### Modelo de Factura
- **CIF del cliente**: identificador fiscal del cliente
- **Denominación social**: nombre o razón social del cliente
- **Dirección fiscal**: dirección fiscal del cliente
- **Base imponible**: importe sin IVA
- **IVA**: importe del impuesto
- **Número de factura**: formato prefijo + número correlativo (ej. BT001, BT002)
- **Estado**: `borrador` | `definitivo`
- **Fecha de finalización**: fecha en la que la factura pasa a definitivo

### Reglas de Negocio
1. Las facturas se crean siempre en estado `borrador` sin número asignado
2. Al pasar a estado `definitivo`, se asigna automáticamente el siguiente número correlativo
3. Solo se pueden eliminar facturas en estado `borrador`
4. Las facturas en estado `definitivo` son inmutables

---

## Endpoints

### Crear factura (borrador)
```
POST /invoices
```
**Body:**
```json
{
  "clientCif": "B12345678",
  "clientName": "Empresa Ejemplo S.L.",
  "clientAddress": "Calle Mayor 10, 28001 Madrid",
  "baseAmount": 100.00,
  "vatAmount": 21.00
}
```
**Response:** `201 Created`
```json
{
  "id": "uuid",
  "clientCif": "B12345678",
  "clientName": "Empresa Ejemplo S.L.",
  "clientAddress": "Calle Mayor 10, 28001 Madrid",
  "baseAmount": 100.00,
  "vatAmount": 21.00,
  "totalAmount": 121.00,
  "invoiceNumber": null,
  "status": "draft",
  "createdAt": "2026-01-02T12:00:00Z",
  "finalizedAt": null
}
```

---

### Listar facturas
```
GET /invoices
```
**Query params opcionales:** `?status=draft|final`

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "clientCif": "B12345678",
    "clientName": "Empresa Ejemplo S.L.",
    "clientAddress": "Calle Mayor 10, 28001 Madrid",
    "baseAmount": 100.00,
    "vatAmount": 21.00,
    "totalAmount": 121.00,
    "invoiceNumber": "BT001",
    "status": "final",
    "createdAt": "2026-01-02T12:00:00Z",
    "finalizedAt": "2026-01-03T10:30:00Z"
  }
]
```

---

### Obtener factura por ID
```
GET /invoices/:id
```
**Response:** `200 OK` | `404 Not Found`

---

### Finalizar factura (borrador → definitivo)
```
PATCH /invoices/:id/finalize
```
Asigna el siguiente número correlativo y cambia el estado a `final`.

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "invoiceNumber": "BT003",
  "status": "final",
  "finalizedAt": "2026-01-03T10:30:00Z"
}
```
**Errores:** `400 Bad Request` si ya está finalizada

---

### Eliminar factura
```
DELETE /invoices/:id
```
**Response:** `204 No Content`

**Errores:** `400 Bad Request` si el estado es `final`

---

## Códigos de Estado HTTP
| Código | Uso |
|--------|-----|
| 200 | Operación exitosa |
| 201 | Factura creada |
| 204 | Factura eliminada |
| 400 | Operación no permitida (ej. eliminar factura final) |
| 404 | Factura no encontrada |
| 409 | Conflicto (ej. CIF duplicado, número de factura ya asignado) |
