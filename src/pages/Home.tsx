import { products } from "../data/products";
import ProductGrid from "../components/ProductGrid";

interface Props {
  searchTerm: string;
}

const Home = ({ searchTerm }: Props) => {

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex">

      {/* Sidebar */}
      <aside className="w-64 bg-white p-6 shadow-md min-h-screen">
        <h2 className="text-lg font-bold mb-4">Filters</h2>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Category</h3>
          <ul className="space-y-2 text-sm">
            <li className="cursor-pointer hover:text-yellow-500">All</li>
            <li className="cursor-pointer hover:text-yellow-500">Electronics</li>
            <li className="cursor-pointer hover:text-yellow-500">Fashion</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Sort By</h3>
          <select className="w-full border p-2 rounded">
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Rating</option>
          </select>
        </div>
      </aside>

      {/* Product Area */}
      <main className="flex-1 bg-gray-100 p-8">
        <h2 className="text-2xl font-bold mb-6">
          Products
        </h2>

        <ProductGrid products={filteredProducts} />
      </main>

    </div>
  );
};

export default Home;