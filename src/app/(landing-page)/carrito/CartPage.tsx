'use client';

import { useCart } from '@/src/app/lib/contexts/CartContext';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

interface CartPageProps {
    onNavigate: (page: string) => void;
}

export default function CartPage({ onNavigate }: CartPageProps) {
    const { items, cartCount, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();

    const shippingCost = totalPrice >= 200 ? 0 : 15;
    const finalTotal = totalPrice + shippingCost;

    if (cartCount === 0) {
        return (
            <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <ShoppingBag className="w-20 h-20 mx-auto text-gray-300 mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            Tu carrito está vacío
                        </h2>
                        <p className="text-gray-600 mb-6">
                            ¡Explora nuestra colección y encuentra tus zapatillas perfectas!
                        </p>
                        <button
                            onClick={() => onNavigate('/')}
                            className="inline-block bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition"
                        >
                            Explorar productos
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Carrito de Compras
                        </h1>
                        <p className="text-gray-600">
                            {cartCount} {cartCount === 1 ? 'producto' : 'productos'}
                        </p>
                    </div>
                    <button
                        onClick={clearCart}
                        className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" />
                        Vaciar carrito
                    </button>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Lista de productos */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <div
                                key={`${item.productId}-${item.size}`}
                                className="bg-white rounded-lg shadow-sm p-6 flex gap-6"
                            >
                                {/* Imagen */}
                                <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                                    {item.productImage ? (
                                        <img
                                            src={item.productImage}
                                            alt={item.productName}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                            Sin imagen
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between mb-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                                                {item.brandName}
                                            </p>
                                            <h3 className="font-medium text-gray-900 truncate">
                                                {item.productName}
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Talla: <span className="font-medium">{item.size}</span>
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.productId, item.size)}
                                            className="text-gray-400 hover:text-red-500 transition"
                                            aria-label="Eliminar producto"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        {/* Contador de cantidad */}
                                        <div className="flex items-center border border-gray-300 rounded-lg">
                                            <button
                                                onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                                                className="p-2 hover:bg-gray-100 transition"
                                                aria-label="Disminuir cantidad"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="px-4 font-medium text-gray-900">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                                                className="p-2 hover:bg-gray-100 transition"
                                                aria-label="Aumentar cantidad"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Precio */}
                                        <div className="text-right">
                                            {item.salePrice ? (
                                                <div>
                                                    <p className="font-bold text-red-600">
                                                        S/ {(item.salePrice * item.quantity).toFixed(2)}
                                                    </p>
                                                    <p className="text-xs text-gray-400 line-through">
                                                        S/ {(item.price * item.quantity).toFixed(2)}
                                                    </p>
                                                </div>
                                            ) : (
                                                <p className="font-bold text-gray-900">
                                                    S/ {(item.price * item.quantity).toFixed(2)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Resumen del pedido */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">
                                Resumen del pedido
                            </h2>

                            <div className="space-y-3 mb-4 pb-4 border-b">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-medium">S/ {totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Envío</span>
                                    <span className={`font-medium ${shippingCost === 0 ? 'text-green-600' : ''}`}>
                                        {shippingCost === 0 ? '¡Gratis!' : `S/ ${shippingCost.toFixed(2)}`}
                                    </span>
                                </div>
                                {totalPrice < 200 && totalPrice > 0 && (
                                    <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
                                        💡 Agrega S/ {(200 - totalPrice).toFixed(2)} más para obtener envío gratis
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-between text-lg font-bold text-gray-900 mb-6">
                                <span>Total</span>
                                <span>S/ {finalTotal.toFixed(2)}</span>
                            </div>

                            <button
                                onClick={() => alert('Funcionalidad de checkout en desarrollo')}
                                className="w-full bg-black text-white py-4 rounded-lg font-medium hover:bg-gray-800 transition mb-3"
                            >
                                Proceder al pago
                            </button>

                            <button
                                onClick={() => onNavigate('/')}
                                className="w-full border-2 border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
                            >
                                Seguir comprando
                            </button>

                            {/* Beneficios */}
                            <div className="mt-6 space-y-3 text-sm">
                                <div className="flex items-start gap-3">
                                    <span className="text-xl">🚚</span>
                                    <div>
                                        <p className="font-medium">Envío gratis</p>
                                        <p className="text-gray-600 text-xs">En compras mayores a S/ 200</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-xl">↩️</span>
                                    <div>
                                        <p className="font-medium">Devolución gratis</p>
                                        <p className="text-gray-600 text-xs">Tienes 30 días para devolver</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-xl">🔒</span>
                                    <div>
                                        <p className="font-medium">Pago seguro</p>
                                        <p className="text-gray-600 text-xs">Protegemos tu información</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}