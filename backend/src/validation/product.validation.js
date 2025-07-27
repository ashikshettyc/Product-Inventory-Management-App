"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productUpdateSchema = exports.productSchema = void 0;
const zod_1 = require("zod");
exports.productSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, 'Name must be at least 3 characters'),
    price: zod_1.z.coerce.number().gt(0, 'Price must be greater than 0'),
    category: zod_1.z.string().min(1, 'Category is required'),
    stock: zod_1.z.coerce.number().min(0, 'Stock must be zero or more'),
    isDeleted: zod_1.z.boolean().default(false),
});
exports.productUpdateSchema = exports.productSchema.partial();
