import { useEffect, useState } from 'react';
import instance from '../lib/axios';
import ProductForm from './Product-form';
import Modal from './Modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Be sure to import the CSS!

type Product = {
  _id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  createdAt: string;
  updatedAt?: string;
  isDeleted?: boolean;
};

export default function ListView() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await instance.get<Product[]>('/products');
      setProducts(res.data);
    } catch (err) {
      setError('Failed to load products');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFormSubmit = async (
    data: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      if (editingProduct) {
        // Edit
        await instance.patch(`/products/${editingProduct._id}`, data);
        toast.success('Product updated successfully!');
      } else {
        // Add
        await instance.post('/products', data);
        toast.success('Product added successfully!');
      }
      setEditingProduct(null);
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      toast.error('Failed to save product');
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await instance.patch(`/products/${id}`, { isDeleted: true });
      setProducts(products.filter((prod) => prod._id !== id));
      toast.warning('Product deleted successfully!');
    } catch (err) {
      setError('Failed to delete product');
      toast.error('Failed to delete product');
      console.log(err);
    }
  };

  const handleEdit = (prod: Product) => {
    setEditingProduct(prod);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setShowModal(false);
  };

  return (
    <div className="container mx-auto my-8 p-4 bg-gray-700 shadow rounded">
      <ToastContainer position="top-right" theme="colored" />
      <h2 className="text-xl font-bold mb-4 text-white">Product List</h2>
      <Modal open={showModal} onClose={handleModalClose}>
        <ProductForm
          initialData={editingProduct || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
      </Modal>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && (
        <>
          <button
            onClick={() => {
              setShowModal(true);
              setEditingProduct(null);
            }}
            className="mb-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Add New Product
          </button>
          {products.length === 0 ? (
            <div>No products available.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead>
                  <tr className="bg-gray-700 text-white">
                    <th className="py-2 px-4 border-b">Name</th>
                    <th className="py-2 px-4 border-b">Price</th>
                    <th className="py-2 px-4 border-b">Category</th>
                    <th className="py-2 px-4 border-b">Stock</th>
                    <th className="py-2 px-4 border-b">Options</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((prod) => (
                    <tr
                      key={prod._id}
                      className="even:bg-gray-700 text-center text-white"
                    >
                      <td className="py-2 px-4 border-b">{prod.name}</td>
                      <td className="py-2 px-4 border-b">{prod.price}</td>
                      <td className="py-2 px-4 border-b">{prod.category}</td>
                      <td className="py-2 px-4 border-b">{prod.stock}</td>
                      <td className="py-2 px-4 border-b flex gap-3 justify-center ">
                        <button
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                          onClick={() => handleEdit(prod)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                          onClick={() => handleDelete(prod._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
