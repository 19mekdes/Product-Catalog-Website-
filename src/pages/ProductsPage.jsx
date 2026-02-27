import ProductGrid from '../components/ProductGrid';
import { products } from '../data/products';

function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">All Products</h1>
      <ProductGrid products={products} />
    </div>
  );
}

export default ProductsPage;