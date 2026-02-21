import laptop from "../assets/laptop.jpg";
import shoes from "../assets/shoes.jpg";
import phone from "../assets/phone.jpg";
import type { Product } from "../types/Product";



export const products: Product[] = [
  {
    id: 1,
    name: "Laptop",
    price: 1200,
    category: "Electronics",
    rating: 4.5,
    image: laptop,
    description: "High performance laptop."
  },
  {
    id: 2,
    name: "Running Shoes",
    price: 150,
    category: "Fashion",
    rating: 4.2,
    image: shoes,
    description: "Comfortable running shoes."
  },
  {
    id: 3,
    name: "Smartphone",
    price: 800,
    category: "Electronics",
    rating: 4.7,
    image: phone,
    description: "Latest generation smartphone."
  }
];