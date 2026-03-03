/* eslint-disable react-hooks/purity */
import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingCart, CheckCircle} from 'lucide-react';
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

  // Check if all items in cart are in stock
  const areAllItemsInStock = () => {
    return cart.every(item => item.inStock === true);
  };

  // Get out of stock items
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
    // Check stock before proceeding to checkout
    if (!areAllItemsInStock()) {
      const outOfStockItems = getOutOfStockItems();
      alert(`❌ Cannot proceed to checkout. The following items are out of stock:\n\n${outOfStockItems.map(item => `• ${item.name}`).join('\n')}\n\nPlease remove them from your cart.`);
      return; // Don't proceed to checkout
    }
    
    setCheckoutStep('checkout');
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Double-check stock before placing order
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
        <div className="flex-1 overflow-y-auto p-4 bg-linear-to-b from-gray-50 to-white">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-linear-to-br from-blue-50 to-indigo-100 p-6 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <ShoppingCart className="w-10 h-10 text-blue-500" />
              </div>
              <p className="text-gray-600 font-medium">Your cart is empty</p>
              <p className="text-sm text-gray-400 mt-1">Add some products to get started</p>
              <button
                onClick={onClose}
                className="mt-6 px-6 py-2 bg-linear-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Show warning if there are out of stock items */}
              {hasOutOfStockItems && (
                <div className="bg-linear-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-lg p-4 mb-4 shadow-sm">
                  <p className="text-sm font-semibold text-red-700 mb-2 flex items-center">
                    <span className="bg-red-100 rounded-full w-5 h-5 flex items-center justify-center mr-2">⚠️</span>
                    Out of Stock Items:
                  </p>
                  {outOfStockItems.map(item => (
                    <p key={item.id} className="text-xs text-red-600 ml-7">
                      • {item.name}
                    </p>
                  ))}
                  <p className="text-xs text-red-700 mt-2 ml-7">
                    Please remove these items to continue checkout.
                  </p>
                </div>
              )}

              {cart.map(item => (
                <div 
                  key={item.id} 
                  className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-3 ${
                    !item.inStock ? 'opacity-75 bg-linear-to-r from-red-50 to-orange-50' : ''
                  }`}
                >
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-linear-to-br from-gray-100 to-gray-200 shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">${item.price.toFixed(2)}</p>
                      
                      {/* Show out of stock badge */}
                      {!item.inStock && (
                        <span className="inline-block bg-linear-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full mt-1 shadow-sm">
                          OUT OF STOCK
                        </span>
                      )}
                      
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                          disabled={!item.inStock}
                        >
                          <Minus className={`w-4 h-4 ${!item.inStock ? 'text-gray-400' : 'text-gray-600'}`} />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                          disabled={!item.inStock}
                        >
                          <Plus className={`w-4 h-4 ${!item.inStock ? 'text-gray-400' : 'text-gray-600'}`} />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-auto text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-gray-200 p-4 bg-linear-to-b from-white to-gray-50">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-600">Subtotal:</span>
              <span className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ${cartTotal.toFixed(2)}
              </span>
            </div>
            
            {/* Show warning message */}
            {hasOutOfStockItems && (
              <div className="bg-linear-to-r from-red-50 to-orange-50 rounded-lg p-3 mb-4 border border-red-200">
                <p className="text-xs text-red-600 flex items-center">
                  <span className="mr-1">⚠️</span>
                  Remove out of stock items to proceed
                </p>
              </div>
            )}
            
            <div className="text-xs text-gray-400 mb-4 flex items-center">
              <span className="bg-gray-200 rounded-full w-4 h-4 flex items-center justify-center mr-1 text-gray-600">ⓘ</span>
              Shipping calculated at checkout
            </div>
            
            <button
              onClick={handleCheckout}
              disabled={hasOutOfStockItems} 
              className={`w-full py-3 px-4 rounded-xl font-medium transition-all shadow-md hover:shadow-lg ${
                hasOutOfStockItems
                  ? 'bg-linear-to-r from-gray-300 to-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white'
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
    <form onSubmit={handlePlaceOrder} className="flex-1 overflow-y-auto p-6 bg-linear-to-b from-gray-50 to-white">
      <h3 className="text-xl font-bold mb-6 bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        Checkout Details
      </h3>
      
      {/* Order Summary */}
      <div className="bg-linear-to-br from-white to-gray-50 p-5 rounded-xl shadow-sm mb-6 border border-gray-100">
        <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
          <span className="bg-blue-100 rounded-full w-5 h-5 flex items-center justify-center text-blue-600 text-xs mr-2">📦</span>
          Order Summary
        </h4>
        <div className="space-y-2">
          {cart.map(item => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-gray-600">{item.name} <span className="text-gray-400">x{item.quantity}</span></span>
              <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200 mt-3 pt-3 font-bold flex justify-between">
          <span>Total</span>
          <span className="text-lg bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            ${cartTotal.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Shipping Information */}
      <div className="space-y-4 mb-6">
        <h4 className="font-semibold text-gray-700 flex items-center">
          <span className="bg-green-100 rounded-full w-5 h-5 flex items-center justify-center text-green-600 text-xs mr-2">🚚</span>
          Shipping Information
        </h4>
        <div className="space-y-3">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-600 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              autoComplete="name"
              className={`w-full px-4 py-2.5 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow ${
                errors.fullName ? 'border-red-500 ring-red-200' : 'border-gray-200'
              }`}
              placeholder="Name"
              required
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              autoComplete="email"
              className={`w-full px-4 py-2.5 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-200'
              }`}
              placeholder="Email Address"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-600 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              autoComplete="tel"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="2519678542"
            />
            <p className="text-xs text-gray-400 mt-1 ml-1">For delivery updates (optional)</p>
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-600 mb-1">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              autoComplete="street-address"
              className={`w-full px-4 py-2.5 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.address ? 'border-red-500' : 'border-gray-200'
              }`}
              placeholder="123 Main St"
              required
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.address}</p>
            )}
          </div>

          {/* City and ZIP Code */}
          <div className="grid grid-cols-2 gap-3">
            {/* City */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-600 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                autoComplete="address-level2"
                className={`w-full px-4 py-2.5 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.city ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="Addis Abeba"
                required
              />
              {errors.city && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.city}</p>
              )}
            </div>
            
            {/* ZIP Code */}
            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-gray-600 mb-1">
                ZIP Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                autoComplete="postal-code"
                className={`w-full px-4 py-2.5 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.zipCode ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="10001"
                required
              />
              {errors.zipCode && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.zipCode}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div className="space-y-4 mb-6">
        <h4 className="font-semibold text-gray-700 flex items-center">
          <span className="bg-purple-100 rounded-full w-5 h-5 flex items-center justify-center text-purple-600 text-xs mr-2">💳</span>
          Payment Information
        </h4>
        <div className="space-y-3">
          {/* Card Number */}
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-600 mb-1">
              Card Number <span className="text-red-500">*</span>
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
              className={`w-full px-4 py-2.5 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.cardNumber ? 'border-red-500' : 'border-gray-200'
              }`}
              placeholder="1234 5678 9012 3456"
              required
            />
            {errors.cardNumber && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.cardNumber}</p>
            )}
            {!errors.cardNumber && (
              <p className="text-xs text-gray-400 mt-1 ml-1">Enter 16-digit card number</p>
            )}
          </div>

          {/* Expiry and CVV */}
          <div className="grid grid-cols-2 gap-3">
            {/* Expiry */}
            <div>
              <label htmlFor="expiry" className="block text-sm font-medium text-gray-600 mb-1">
                Expiry (MM/YY) <span className="text-red-500">*</span>
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
                className={`w-full px-4 py-2.5 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.expiry ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="MM/YY"
                required
              />
              {errors.expiry && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.expiry}</p>
              )}
              {!errors.expiry && (
                <p className="text-xs text-gray-400 mt-1 ml-1">MM/YY format</p>
              )}
            </div>
            
            {/* CVV */}
            <div>
              <label htmlFor="cvv" className="block text-sm font-medium text-gray-600 mb-1">
                CVV <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                value={formData.cvv}
                onChange={handleInputChange}
                maxLength={4}
                autoComplete="cc-csc"
                className={`w-full px-4 py-2.5 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.cvv ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="123"
                required
              />
              {errors.cvv && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.cvv}</p>
              )}
              {!errors.cvv && (
                <p className="text-xs text-gray-400 mt-1 ml-1">3 or 4 digit code</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Form Buttons */}
      <div className="flex gap-3 sticky bottom-0 bg-linear-to-t from-white via-white to-transparent pt-4 pb-2">
        <button
          type="button"
          onClick={() => setCheckoutStep('cart')}
          className="flex-1 px-4 py-3 bg-white border-2 border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-medium"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isProcessing}
          className="flex-1 bg-linear-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed font-medium shadow-md hover:shadow-lg"
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Processing...
            </span>
          ) : (
            `Pay $${cartTotal.toFixed(2)}`
          )}
        </button>
      </div>
    </form>
  );

  const renderSuccessView = () => (
    <div className="flex-1 p-8 text-center flex flex-col justify-center bg-linear-to-b from-green-50 to-white">
      <div className="mb-6">
        <div className="bg-linear-to-br from-green-100 to-emerald-100 p-4 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
      </div>
      <h3 className="text-2xl font-bold bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
        Order Placed Successfully!
      </h3>
      <p className="text-gray-500 mb-8">
        Thank you for your purchase, {formData.fullName || 'Customer'}!
      </p>
      <div className="bg-linear-to-br from-white to-gray-50 p-6 rounded-xl mb-8 text-left shadow-sm border border-gray-100">
        <p className="text-sm text-gray-500 mb-3 flex items-center">
          <span className="bg-blue-100 rounded-full w-5 h-5 flex items-center justify-center text-blue-600 text-xs mr-2">📋</span>
          Order Details
        </p>
        <p className="text-sm text-gray-600 mb-2">
          Order #: <span className="font-mono font-medium">DEMO-{Math.floor(Math.random() * 10000)}</span>
        </p>
        <p className="text-sm text-gray-600">
          Confirmation sent to: <span className="text-blue-600">{formData.email || 'your email'}</span>
        </p>
        <div className="border-t border-gray-200 mt-4 pt-4">
          <p className="font-bold text-lg bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Total: ${cartTotal.toFixed(2)}
          </p>
        </div>
      </div>
      <button
        onClick={handleCloseSuccess}
        className="bg-linear-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all font-medium shadow-md hover:shadow-lg"
      >
        Continue Shopping
      </button>
    </div>
  );

  return (
    <>
      <div
        className="fixed inset-0 bg-linear-to-b from-black/70 to-black/50 backdrop-blur-sm z-40"
        onClick={checkoutStep === 'cart' ? onClose : undefined}
      />
      
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 rounded-l-2xl overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-linear-to-r from-white to-gray-50">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <div className="bg-linear-to-br from-blue-500 to-indigo-600 p-1.5 rounded-lg shadow-md">
                <ShoppingCart className="w-4 h-4 text-white" />
              </div>
              <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {checkoutStep === 'cart' && 'Your Cart'}
                {checkoutStep === 'checkout' && 'Checkout'}
                {checkoutStep === 'success' && 'Order Confirmed'}
              </span>
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
              <X className="w-5 h-5 text-gray-500" />
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