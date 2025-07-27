"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Product_1 = require("../models/Product");
const product_validation_1 = require("../validation/product.validation");
const router = (0, express_1.Router)();
router.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield Product_1.Product.find({ isDeleted: false }).sort({ createdAt: -1 });
        res.json(products);
    }
    catch (err) {
        next(err);
    }
}));
router.get('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield Product_1.Product.findById(req.params.id);
        if (!product)
            return res.status(404).json({ errors: ['Product not found'] });
        res.json(product);
    }
    catch (err) {
        next(err);
    }
}));
router.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsed = product_validation_1.productSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                message: 'Validation Error',
                errors: parsed.error.issues,
            });
        }
        const product = new Product_1.Product(parsed.data);
        const saved = yield product.save();
        res.status(201).json({ message: 'Product created', saved });
    }
    catch (err) {
        next(err);
    }
}));
router.patch('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsed = product_validation_1.productUpdateSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                message: 'Validation Error',
                errors: parsed.error.issues,
            });
        }
        const updated = yield Product_1.Product.findByIdAndUpdate(req.params.id, parsed.data, {
            runValidators: true,
            new: true,
        });
        if (!updated)
            return res.status(404).json({ errors: ['Product not found'] });
        res.json(updated);
    }
    catch (err) {
        next(err);
    }
}));
exports.default = router;
