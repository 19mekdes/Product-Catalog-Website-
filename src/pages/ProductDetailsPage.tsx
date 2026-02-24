import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import { Star, ShoppingCart, ArrowLeft } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const cartContext = React.useContext(CartContext);
  const addToCart = cartContext?.addToCart ?? (() => {});
  
  const product = products.find(p => p.id === Number(id));

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h2>
        <Link to="/" className="text-blue-600 hover:underline">
          Return to home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to products
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative pb-[100%] md:pb-0 md:h-125">
            <img
              src={product.image}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover md:static md:h-full"
            />
          </div>

          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {product.category}
              </span>
              <div className="flex items-center">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 text-lg text-gray-600">{product.rating}</span>
              </div>
            </div>

            <p className="text-3xl font-bold text-gray-900 mb-6">${product.price}</p>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Availability</h3>
              <p className={product.inStock ? 'text-green-600' : 'text-red-600'}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </p>
            </div>

            <button
              onClick={() => addToCart(product)}
              disabled={!product.inStock}
              className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;