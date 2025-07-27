import { Router, Request, Response, NextFunction } from 'express';
import { Product } from '../models/Product';
import { productSchema, productUpdateSchema } from '../validation/product.validation';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find({isDeleted: false}).sort({ createdAt: -1 });
 
    res.json(products);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ errors: ['Product not found'] });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = productSchema.safeParse(req.body);
      if (!parsed.success) {
    return res.status(400).json({
      message: 'Validation Error',
      errors: parsed.error.issues,
    });
  }
    const product = new Product(parsed.data);
    const saved = await product.save();
    res.status(201).json({ message: 'Product created', saved });
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
        const parsed = productUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: 'Validation Error',
        errors: parsed.error.issues,
      });
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, parsed.data, {
      runValidators: true,
      new: true,
    });
    if (!updated) return res.status(404).json({ errors: ['Product not found'] });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});


export default router;
