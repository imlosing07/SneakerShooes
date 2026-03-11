'use client';

import { useState } from 'react';
import { useCart } from '@/src/app/lib/contexts/CartContext';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import CheckoutForm from './CheckoutForm';
import { CheckoutData, STORE_LOCATIONS, TIME_SLOTS } from '@/src/types/checkout.types';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
  const { items, cartCount, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [isCheckoutValid, setIsCheckoutValid] = useState(false);

  const finalTotal = totalPrice; // Sin costo de envío

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
            <Link
              href="/"
              className="inline-block bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition"
            >
              Explorar productos
            </Link>
          </div>
        </div>
      </div>
    );
  }


  const handleCheckoutDataChange = (data: CheckoutData, isValid: boolean) => {
    setCheckoutData(data);
    setIsCheckoutValid(isValid);
  };

  const enviarWhatsApp = () => {
    if (!checkoutData || !isCheckoutValid) {
      alert('Por favor completa toda la información de entrega');
      return;
    }

    // Emojis via CodePoints para evitar corrupción de encoding
    const cartIcon = String.fromCodePoint(0x1F6D2);     // 🛒
    const boxIcon = String.fromCodePoint(0x1F4E6);      // 📦
    const moneyIcon = String.fromCodePoint(0x1F4B0);    // 💰
    const truckIcon = String.fromCodePoint(0x1F69A);    // 🚚
    const partyIcon = String.fromCodePoint(0x1F389);    // 🎉
    const storeIcon = String.fromCodePoint(0x1F3EA);    // 🏪
    const pinIcon = String.fromCodePoint(0x1F4CD);      // 📍
    const sparkleIcon = String.fromCodePoint(0x2728);   // ✨
    const checkIcon = String.fromCodePoint(0x2705);     // ✅

    // Formatear lista de productos
    let productosTexto = '';
    items.forEach((item) => {
      const precio = item.salePrice || item.price;
      const subtotal = precio * item.quantity;
      productosTexto += `${sparkleIcon} *${item.brandName} ${item.productName}*\n  Talla: ${item.size} | Cantidad: ${item.quantity}\n  S/ ${subtotal.toFixed(2)}\n\n`;
    });

    // Formatear información de entrega
    let entregaTexto = '';
    if (checkoutData.deliveryMethod === 'pickup') {
      const storeInfo = STORE_LOCATIONS[checkoutData.storeLocation!];
      entregaTexto = `*Metodo:* Recoger en tienda ${storeIcon}\n*Tienda:* ${storeInfo.name}\n*Direccion:* ${storeInfo.address}\n*Horario:* Lun-Sab 10am-8pm | Dom 11am-6pm\n*Ver ubicacion:* ${storeInfo.mapUrl}`;
    } else {
      const timeSlot = TIME_SLOTS[checkoutData.timeSlot!];
      entregaTexto = `*Metodo:* Delivery ${truckIcon}\n*Nombre:* ${checkoutData.customerName}\n*Direccion:* ${checkoutData.address}`;
      if (checkoutData.reference) {
        entregaTexto += `\n*Referencia:* ${checkoutData.reference}`;
      }
      entregaTexto += `\n*Horario preferido:* ${timeSlot.label} (${timeSlot.time})\n\n${pinIcon} *Nota:* El costo de envio se coordinara segun la ubicacion`;
    }

    // Mensaje completo
    const mensaje = `${cartIcon} *NUEVO PEDIDO - SneakerShooes*\n\n${boxIcon} *PRODUCTOS:*\n${productosTexto}\n${moneyIcon} *TOTAL: S/ ${finalTotal.toFixed(2)}*\n\n${truckIcon} *ENTREGA:*\n${entregaTexto}\n\n${checkIcon} Gracias por tu compra! ${partyIcon}`;

    // IMPORTANTE: Usar api.whatsapp.com/send en lugar de wa.me para evitar redirección que corrompe encoding
    const encodedText = encodeURIComponent(mensaje);
    const url = `https://api.whatsapp.com/send?phone=51902898742&text=${encodedText}`;
    window.open(url, '_blank');
  }


  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Carrito de Compras
            </h1>
            <p className="text-gray-600">
              {cartCount} {cartCount === 1 ? 'producto' : 'productos'}
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-2 self-start sm:self-auto"
          >
            <Trash2 className="w-4 h-4" />
            Vaciar carrito
          </button>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.size}`}
                className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex gap-3 sm:gap-6"
              >
                {/* Imagen */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                  {item.productImage ? (
                    <Image
                      src={item.productImage}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                      width={1000}
                      height={1000}
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
                      <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                        {item.productName}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Talla: <span className="font-medium">{item.size}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.productId, item.size)}
                      className="text-gray-400 hover:text-red-500 transition ml-2"
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
                        className="p-2 sm:p-2.5 hover:bg-gray-100 transition"
                        aria-label="Disminuir cantidad"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-3 sm:px-4 font-medium text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                        className="p-2 sm:p-2.5 hover:bg-gray-100 transition"
                        aria-label="Aumentar cantidad"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Precio */}
                    <div className="text-right">
                      {item.salePrice ? (
                        <div>
                          <p className="font-bold text-red-600 text-sm sm:text-base">
                            S/ {(item.salePrice * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-400 line-through">
                            S/ {(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ) : (
                        <p className="font-bold text-gray-900 text-sm sm:text-base">
                          S/ {(item.price * item.quantity).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Formulario de Checkout */}
            <CheckoutForm onCheckoutDataChange={handleCheckoutDataChange} />
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:sticky lg:top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Resumen del pedido
              </h2>

              <div className="space-y-3 mb-4 pb-4 border-b">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">S/ {totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold text-gray-900 mb-6">
                <span>Total</span>
                <span>S/ {finalTotal.toFixed(2)}</span>
              </div>

              <button
                onClick={enviarWhatsApp}
                disabled={!isCheckoutValid}
                className={`w-full py-3 sm:py-4 rounded-lg font-medium mb-3 transition text-sm sm:text-base ${isCheckoutValid
                    ? 'bg-black text-white hover:bg-gray-800'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
              >
                {isCheckoutValid ? '✓ Enviar pedido por WhatsApp' : 'Completa la información de entrega'}
              </button>

              <Link
                href="/"
                className="w-full border-2 border-gray-300 py-2 sm:py-3 rounded-lg font-medium hover:bg-gray-50 transition text-center block text-sm sm:text-base"
              >
                Seguir comprando
              </Link>

              {/* Beneficios */}
              <div className="mt-6 space-y-3 text-sm">
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