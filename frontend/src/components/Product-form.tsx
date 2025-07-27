import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, type Product } from '../lib/validator';

type ProductFormProps = {
  initialData?: Partial<Product>;
  onSubmit: (
    data: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>
  ) => void | Promise<void>;
  onCancel?: () => void;
};

const ProductForm = ({
  initialData = {},
  onSubmit,
  onCancel,
}: ProductFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      price: '',
      category: '',
      stock: '',
      ...initialData,
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md text-black"
      noValidate
    >
      <div className="mb-5">
        <label htmlFor="name" className="block mb-1 font-medium text-gray-700">
          Name
        </label>
        <input
          id="name"
          type="text"
          {...register('name')}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Product name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>
      <div className="mb-5">
        <label htmlFor="price" className="block mb-1 font-medium text-gray-700">
          Price
        </label>
        <input
          id="price"
          type="number"
          step="0.01"
          {...register('price')}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.price ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Product price"
        />
        {errors.price && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {errors.price.message}
          </p>
        )}
      </div>
      <div className="mb-5">
        <label
          htmlFor="category"
          className="block mb-1 font-medium text-gray-700"
        >
          Category
        </label>
        <input
          id="category"
          type="text"
          {...register('category')}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.category ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Product category"
        />
        {errors.category && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {errors.category.message}
          </p>
        )}
      </div>
      <div className="mb-5">
        <label htmlFor="stock" className="block mb-1 font-medium text-gray-700">
          Stock
        </label>
        <input
          id="stock"
          type="number"
          {...register('stock')}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.stock ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Available stock"
        />
        {errors.stock && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {errors.stock.message}
          </p>
        )}
      </div>
      <div className="flex items-center justify-start">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-5 py-2 font-semibold text-white rounded-md shadow-md transition-colors ${
            isSubmitting
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="ml-4 px-5 py-2 font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ProductForm;
