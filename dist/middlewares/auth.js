"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = auth;
const VALID_TOKEN = 'my-secret-token-123';
function auth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
            code: 401,
            message: 'Token no proporcionado',
        });
        return;
    }
    const token = authHeader.split(' ')[1];
    if (token !== VALID_TOKEN) {
        res.status(401).json({
            code: 401,
            message: 'Token inválido',
        });
        return;
    }
    next();
}
