"use client";

import { useState } from 'react';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setStatus('error');
      setErrorMessage('Por favor, introduce un email válido');
      return;
    }

    setStatus('submitting');
    
    // Simulación de envío (reemplazar con la lógica real de API)
    try {
      // Aquí iría la llamada a la API real
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatus('success');
      setEmail('');
      
      // Resetear el estado después de 5 segundos
      setTimeout(() => {
        setStatus('idle');
      }, 5000);
    } catch (error) {
      setStatus('error');
      setErrorMessage('Ha ocurrido un error. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Mail className={`w-5 h-5 ${status === 'error' ? 'text-red-400' : 'text-gray-400'}`} />
          </div>
          <input
            type="email"
            id="newsletter-email"
            className={`bg-gray-700 text-xs text-white w-full pl-10 pr-12 py-2 rounded-lg focus:outline-none focus:ring-2 ${
              status === 'error' 
                ? 'focus:ring-red-500 border-red-500' 
                : 'focus:ring-pink-500 border-gray-600'
            }`}
            placeholder="Tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'submitting' || status === 'success'}
            required
          />
          <button
            type="submit"
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              status === 'submitting' 
                ? 'bg-gray-500 text-gray-300 cursor-not-allowed' 
                : status === 'success'
                ? 'bg-green-500 text-white cursor-default'
                : 'bg-pink-500 hover:bg-pink-600 text-white'
            }`}
            disabled={status === 'submitting' || status === 'success'}
          >
            {status === 'submitting' ? 'Enviando...' : status === 'success' ? 'Enviado' : 'Suscribir'}
          </button>
        </div>
        
        {status === 'error' && (
          <div className="flex items-center text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 mr-1" />
            <span>{errorMessage}</span>
          </div>
        )}
        
        {status === 'success' && (
          <div className="flex items-center text-green-400 text-sm">
            <CheckCircle className="w-4 h-4 mr-1" />
            <span>¡Gracias por suscribirte!</span>
          </div>
        )}
        
        <p className="text-xs text-gray-400">
          Al suscribirte, aceptas recibir correos electrónicos de marketing de nuestra tienda. Puedes darte de baja en cualquier momento.
        </p>
      </form>
    </div>
  );
};

export default NewsletterForm;