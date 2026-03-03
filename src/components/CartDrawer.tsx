/* eslint-disable react-hooks/purity */
import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingCart, CheckCircle, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CheckoutForm {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [formData, setFormData] = useState<CheckoutForm>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const [errors, setErrors] = useState<Partial<CheckoutForm>>({});

  if (!isOpen) return null;

  //  Check if all items in cart are in stock
  const areAllItemsInStock = () => {
    return cart.every(item => item.inStock === true);
  };

  //  Get out of stock items
  const getOutOfStockItems = () => {
    return cart.filter(item => !item.inStock);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof CheckoutForm]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CheckoutForm> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    
    // Simple card validation
    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
    } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }
    
    if (!formData.expiry.trim()) {
      newErrors.expiry = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expiry)) {
      newErrors.expiry = 'Use format MM/YY';
    }
    
    if (!formData.cvv.trim()) {
      newErrors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = 'CVV must be 3 or 4 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = () => {
    //  CRITICAL FIX: Check stock before proceeding to checkout
    if (!areAllItemsInStock()) {
      const outOfStockItems = getOutOfStockItems();
      alert(`❌ Cannot proceed to checkout. The following items are out of stock:\n\n${outOfStockItems.map(item => `• ${item.name}`).join('\n')}\n\nPlease remove them from your cart.`);
      return; // Don't proceed to checkout
    }
    
    setCheckoutStep('checkout');
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    //  Double-check stock before placing order
    if (!areAllItemsInStock()) {
      alert('❌ Some items in your cart are no longer in stock. Please go back and remove them.');
      return;
    }
    
    if (validateForm()) {
      setIsProcessing(true);
      
      // Simulate order processing
      setTimeout(() => {
        setIsProcessing(false);
        setCheckoutStep('success');
      }, 1500);
    }
  };

  const handleCloseSuccess = () => {
    clearCart();
    setCheckoutStep('cart');
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      zipCode: '',
      cardNumber: '',
      expiry: '',
      cvv: ''
    });
    onClose();
  };

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Format expiry date
  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  const renderCartView = () => {
    const hasOutOfStockItems = !areAllItemsInStock();
    const outOfStockItems = getOutOfStockItems();

    return (
      <>
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Your cart is empty</p>
              <button
                onClick={onClose}
                className="mt-4 text-blue-600 hover:underline"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/*  Show warning if there are out of stock items */}
              {hasOutOfStockItems && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-sm font-semibold text-red-700 mb-2">
                    ⚠️ Out of Stock Items:
                  </p>
                  {outOfStockItems.map(item => (
                    <p key={item.id} className="text-xs text-red-600 ml-2">
                      • {item.name}
                    </p>
                  ))}
                  <p className="text-xs text-red-700 mt-2">
                    Please remove these items to continue checkout.
                  </p>
                </div>
              )}

              {cart.map(item => (
                <div 
                  key={item.id} 
                  className={`flex gap-4 border-b pb-4 ${
                    !item.inStock ? 'opacity-50 bg-red-50 p-2 rounded' : ''
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
                    
                    {/* Show out of stock badge */}
                    {!item.inStock && (
                      <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded mt-1">
                        OUT OF STOCK
                      </span>
                    )}
                    
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-100 rounded"
                        disabled={!item.inStock} //  Disable if out of stock
                      >
                        <Minus className={`w-4 h-4 ${!item.inStock ? 'text-gray-300' : ''}`} />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100 rounded"
                        disabled={!item.inStock} //  Disable if out of stock
                      >
                        <Plus className={`w-4 h-4 ${!item.inStock ? 'text-gray-300' : ''}`} />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-auto text-red-600 text-sm hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t p-4">
            <div className="flex justify-between mb-4">
              <span className="font-semibold">Subtotal:</span>
              <span className="font-bold text-lg">${cartTotal.toFixed(2)}</span>
            </div>
            
            {/*  Show warning message */}
            {hasOutOfStockItems && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-red-700">
                  ⚠️ Remove out of stock items to proceed
                </p>
              </div>
            )}
            
            <div className="text-sm text-gray-500 mb-4">
              Shipping calculated at checkout
            </div>
            
            <button
              onClick={handleCheckout}
              disabled={hasOutOfStockItems} 
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                hasOutOfStockItems
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {hasOutOfStockItems ? 'Remove Out of Stock Items' : 'Proceed to Checkout'}
            </button>
          </div>
        )}
      </>
    );
  };

  const renderCheckoutView = () => (
    <form onSubmit={handlePlaceOrder} className="flex-1 overflow-y-auto p-6">
      <h3 className="text-xl font-semibold mb-4">Checkout Details</h3>
      
      {/* Order Summary */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h4 className="font-medium mb-2">Order Summary</h4>
        {cart.map(item => (
          <div key={item.id} className="flex justify-between text-sm mb-2">
            <span>{item.name} x {item.quantity}</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="border-t pt-2 mt-2 font-semibold flex justify-between">
          <span>Total</span>
          <span>${cartTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Shipping Information */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Shipping Information</h4>
        <div className="space-y-3">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              autoComplete="name"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.fullName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="John Doe"
              required
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              autoComplete="email"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="john@example.com"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              autoComplete="tel"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="(555) 555-5555"
            />
            <p className="text-xs text-gray-500 mt-1">For delivery updates (optional)</p>
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Address *
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              autoComplete="street-address"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Address"
              required
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address}</p>
            )}
          </div>

          {/* City and ZIP Code */}
          <div className="grid grid-cols-2 gap-3">
            {/* City */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                autoComplete="address-level2"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.city ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="City"
                required
              />
              {errors.city && (
                <p className="text-red-500 text-xs mt-1">{errors.city}</p>
              )}
            </div>
            
            {/* ZIP Code */}
            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                ZIP Code *
              </label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                autoComplete="postal-code"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.zipCode ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="12345"
                required
              />
              {errors.zipCode && (
                <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div className="mb-6">
        <h4 className="font-medium mb-3 flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          Payment Information
        </h4>
        <div className="space-y-3">
          {/* Card Number */}
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Card Number *
            </label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={(e) => {
                const formatted = formatCardNumber(e.target.value);
                setFormData(prev => ({ ...prev, cardNumber: formatted }));
              }}
              maxLength={19}
              autoComplete="cc-number"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.cardNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="1234 5678 9012 3456"
              required
            />
            {errors.cardNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
            )}
            {!errors.cardNumber && (
              <p className="text-xs text-gray-500 mt-1">Enter 16-digit card number</p>
            )}
          </div>

          {/* Expiry and CVV */}
          <div className="grid grid-cols-2 gap-3">
            {/* Expiry */}
            <div>
              <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">
                Expiry (MM/YY) *
              </label>
              <input
                type="text"
                id="expiry"
                name="expiry"
                value={formData.expiry}
                onChange={(e) => {
                  const formatted = formatExpiry(e.target.value);
                  setFormData(prev => ({ ...prev, expiry: formatted }));
                }}
                maxLength={5}
                autoComplete="cc-exp"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.expiry ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="MM/YY"
                required
              />
              {errors.expiry && (
                <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>
              )}
              {!errors.expiry && (
                <p className="text-xs text-gray-500 mt-1">MM/YY format</p>
              )}
            </div>
            
            {/* CVV */}
            <div>
              <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                CVV *
              </label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                value={formData.cvv}
                onChange={handleInputChange}
                maxLength={4}
                autoComplete="cc-csc"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.cvv ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="123"
                required
              />
              {errors.cvv && (
                <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>
              )}
              {!errors.cvv && (
                <p className="text-xs text-gray-500 mt-1">3 or 4 digit code</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Form Buttons */}
      <div className="flex gap-3 sticky bottom-0 bg-white pt-4 border-t">
        <button
          type="button"
          onClick={() => setCheckoutStep('cart')}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isProcessing}
          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
        >
          {isProcessing ? 'Processing...' : `Pay $${cartTotal.toFixed(2)}`}
        </button>
      </div>
    </form>
  );

  const renderSuccessView = () => (
    <div className="flex-1 p-8 text-center flex flex-col justify-center">
      <div className="mb-4">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Order Placed Successfully!</h3>
      <p className="text-gray-600 mb-6">
        Thank you for your purchase, {formData.fullName || 'Customer'}!
      </p>
      <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
        <p className="text-sm text-gray-600 mb-2">
          Order #: DEMO-{Math.floor(Math.random() * 10000)}
        </p>
        <p className="text-sm text-gray-600">
          Confirmation sent to: {formData.email || 'your email'}
        </p>
        <div className="border-t mt-3 pt-3">
          <p className="font-semibold">Total: ${cartTotal.toFixed(2)}</p>
        </div>
      </div>
      <button
        onClick={handleCloseSuccess}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Continue Shopping
      </button>
    </div>
  );

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={checkoutStep === 'cart' ? onClose : undefined}
      />
      
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b bg-white">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              {checkoutStep === 'cart' && 'Your Cart'}
              {checkoutStep === 'checkout' && 'Checkout'}
              {checkoutStep === 'success' && 'Order Confirmed'}
            </h2>
            <button
              onClick={() => {
                if (checkoutStep === 'success') {
                  handleCloseSuccess();
                } else {
                  setCheckoutStep('cart');
                  onClose();
                }
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {checkoutStep === 'cart' && renderCartView()}
          {checkoutStep === 'checkout' && renderCheckoutView()}
          {checkoutStep === 'success' && renderSuccessView()}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;