import React, { createContext, useContext, useEffect, useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: number;
  inStock: boolean;
}

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isProductInStock: (productId: number) => boolean; // Added this function
}

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext<CartContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  
  const [products, setProducts] = useState<Product[]>([]);

  // Load products data
  useEffect(() => {
    import('../data/products').then(module => {
      setProducts(module.products);
    });
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Check if product is in stock
  const isProductInStock = (productId: number): boolean => {
    const product = products.find(p => p.id === productId);
    return product ? product.inStock : false;
  };

  useEffect(() => {
    if (products.length > 0) {
      // Check for out of stock items in cart
      const updatedCart = cart.filter(item => {
        const product = products.find(p => p.id === item.id);
        return product ? product.inStock : false;
      });

      
      if (updatedCart.length < cart.length) {
        setCart(updatedCart);
        
        alert('Some items were removed from your cart as they are no longer in stock.');
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]); 

  const addToCart = (product: Product) => {
    
    if (!product.inStock) {
      alert(' Sorry, this item is currently out of stock and cannot be added to your cart.');
      return; 
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    
    if (quantity > 0) {
      const productInCart = cart.find(item => item.id === productId);
      if (productInCart && !productInCart.inStock) {
        alert('⚠️ Cannot update quantity for out of stock items. Please remove it from cart.');
        return;
      }
    }

    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
    isProductInStock // Expose this function to components
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};