"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const zod_1 = require("zod");
function errorHandler(err, req, res, next) {
    var _a;
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            message: 'Validation Error',
            errors: err.issues.map((issue) => ({
                path: Array.isArray(issue.path) ? issue.path.join('.') : issue.path,
                message: issue.message,
            })),
        });
    }
    if (err.name === 'ValidationError') {
        const messages = Object.values((_a = err.errors) !== null && _a !== void 0 ? _a : {}).map((e) => e.message);
        return res.status(400).json({
            message: 'Validation Error',
            errors: messages,
        });
    }
    if (err.name === 'CastError') {
        return res.status(400).json({
            message: 'Invalid ID Format',
            errors: [err.message || 'Invalid resource identifier'],
        });
    }
    if (err.statusCode || err.errors) {
        return res.status(err.statusCode || 400).json({
            message: err.message || 'Validation Error',
            errors: err.errors || [],
        });
    }
    res.status(500).json({
        message: 'Internal Server Error',
        errors: [err.message || 'An unexpected error occurred'],
    });
}
