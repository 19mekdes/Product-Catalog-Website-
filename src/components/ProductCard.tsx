import type { Product } from "../types/Product";

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  return (
    <div className="bg-white p-4 rounded shadow hover:shadow-lg transition duration-300">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-40 object-contain mb-3"
      />

      <h3 className="text-sm font-medium">{product.name}</h3>

      <p className="text-lg font-bold mt-1">${product.price}</p>

      <p className="text-gray-500 text-sm">{product.category}</p>

      <p className="text-yellow-500 text-sm">⭐ {product.rating}</p>
    </div>
  );
};

export default ProductCard;