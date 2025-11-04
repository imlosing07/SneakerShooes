'use client';

import React, { useState } from 'react';
import Image from 'next/image';

// Interfaces para tipado
interface ImageDetails {
  originalUrl: string;
  standardUrl: string;
  publicId?: string;
}

interface FormOptions {
  folder: string;
}

export default function TestImagesPage() {
  // Estados para almacenar resultados y configuración
  const [urlResults, setUrlResults] = useState<ImageDetails | null>(null);
  const [urlIsLoading, setUrlIsLoading] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);

  const [fileResults, setFileResults] = useState<ImageDetails | null>(null);
  const [fileIsLoading, setFileIsLoading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  // Estado para guardar valores de los formularios
  const [urlOptions, setUrlOptions] = useState<FormOptions>({
    folder: 'products-test'
  });

  const [fileOptions, setFileOptions] = useState<FormOptions>({
    folder: 'products-test'
  });

  // Manejadores para cambios en los formularios
  const handleUrlOptionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    
    setUrlOptions(prev => ({
      ...prev,
      [id.replace('url', '').toLowerCase()]: value
    }));
  };

  const handleFileOptionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    
    setFileOptions(prev => ({
      ...prev,
      [id.replace('file', '').toLowerCase()]: value
    }));
  };

  // Procesar URL de imagen
  const handleProcessUrl = async () => {
    const urlInput = document.getElementById('imageUrl') as HTMLInputElement;
    const url = urlInput.value.trim();

    if (!url) {
      setUrlError('Por favor ingresa una URL de imagen');
      return;
    }

    // Validar formato de URL
    try {
      new URL(url);
    } catch (error) {
      setUrlError('URL inválida. Asegúrate de incluir http:// o https://');
      return;
    }

    setUrlIsLoading(true);
    setUrlError(null);
    setUrlResults(null);

    try {
      const response = await fetch('/api/images/process-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url,
          folder: urlOptions.folder || 'products'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Error en la solicitud');
      }

      setUrlResults(data.data);
    } catch (error: any) {
      setUrlError(error.message);
    } finally {
      setUrlIsLoading(false);
    }
  };

  // Subir archivo de imagen
  const handleUploadFile = async () => {
    const fileInput = document.getElementById('imageFile') as HTMLInputElement;

    if (!fileInput.files || fileInput.files.length === 0) {
      setFileError('Por favor selecciona una imagen');
      return;
    }

    // Validar tipo de archivo
    const file = fileInput.files[0];
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    
    if (!validTypes.includes(file.type)) {
      setFileError('Tipo de archivo no soportado. Usa JPEG, PNG, WebP, GIF o SVG');
      return;
    }

    // Validar tamaño (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setFileError('La imagen es demasiado grande. El tamaño máximo es 10MB');
      return;
    }

    setFileIsLoading(true);
    setFileError(null);
    setFileResults(null);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', fileOptions.folder || 'products');

      const response = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Error en la solicitud');
      }

      setFileResults(data.data);
    } catch (error: any) {
      setFileError(error.message);
    } finally {
      setFileIsLoading(false);
    }
  };

  // Renderizado de resultados de forma reutilizable
  const renderResults = (
    results: ImageDetails | null, 
    isLoading: boolean, 
    error: string | null
  ) => {
    if (!results && !error && !isLoading) return null;
    
    return (
      <div className="mt-6 p-4 border rounded bg-white">
        <h3 className="font-semibold mb-2">Resultados:</h3>

        {isLoading && <p className="text-gray-600">Procesando imagen...</p>}

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded">
            {error}
          </div>
        )}

        {results && (
          <>
            <div className="bg-gray-100 p-3 rounded overflow-auto text-sm mb-4">
              <details>
                <summary className="cursor-pointer font-medium">Ver detalles JSON</summary>
                <pre className="mt-2">
                  {JSON.stringify(results, null, 2)}
                </pre>
              </details>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Mostrar imagen original */}
              <div className="flex flex-col items-center">
                <h4 className="font-medium mb-2">Imagen Original (2000px)</h4>
                <div className="relative border rounded overflow-hidden h-[300px] w-full">
                  <Image
                    src={results.originalUrl}
                    alt="Original"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain"
                  />
                </div>
                <span className="text-sm mt-1 font-medium">originalUrl</span>
                
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(results.originalUrl);
                    alert(`URL original copiada al portapapeles!`);
                  }}
                  className="text-xs mt-1 text-blue-600 hover:underline"
                >
                  Copiar URL
                </button>
              </div>

              {/* Mostrar imagen transformada con template de Cloudinary */}
              <div className="flex flex-col items-center">
                <h4 className="font-medium mb-2">Imagen con Template (840px)</h4>
                <div className="relative border rounded overflow-hidden h-[300px] w-full">
                  <Image
                    src={results.standardUrl}
                    alt="Template"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain"
                  />
                </div>
                <span className="text-sm mt-1 font-medium">URL con transformación</span>
                
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(results.standardUrl);
                    alert(`URL con template copiada al portapapeles!`);
                  }}
                  className="text-xs mt-1 text-blue-600 hover:underline"
                >
                  Copiar URL
                </button>
              </div>

              {/* Mostrar ID público si está disponible */}
              {results.publicId && (
                <div className="col-span-1 md:col-span-2">
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="font-medium">Public ID: <span className="font-mono text-sm">{results.publicId}</span></p>
                    <p className="text-xs text-gray-500 mt-1">
                      Este ID te permite gestionar la imagen en Cloudinary (eliminación, etc.)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 pb-2 border-b">Prueba de manejo de imágenes con Cloudinary</h1>

      {/* Procesamiento de URL */}
      <div className="bg-gray-50 p-6 rounded-lg border mb-8">
        <h2 className="text-xl font-semibold mb-4">1. Procesar URL de imagen</h2>

        <div className="mb-4">
          <input
            type="text"
            id="imageUrl"
            placeholder="Ingresa URL de imagen (ej: https://ejemplo.com/imagen.jpg)"
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="urlFolder" className="block mb-1">Carpeta:</label>
          <input
            type="text"
            id="urlFolder"
            value={urlOptions.folder}
            onChange={handleUrlOptionChange}
            placeholder="products"
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          onClick={handleProcessUrl}
          disabled={urlIsLoading}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
        >
          {urlIsLoading ? 'Procesando...' : 'Procesar URL'}
        </button>

        {/* Resultados URL */}
        {renderResults(urlResults, urlIsLoading, urlError)}
      </div>

      {/* Carga de archivo */}
      <div className="bg-gray-50 p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">2. Subir archivo de imagen</h2>

        <div className="mb-4">
          <input
            type="file"
            id="imageFile"
            accept="image/*"
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="fileFolder" className="block mb-1">Carpeta:</label>
          <input
            type="text"
            id="fileFolder"
            value={fileOptions.folder}
            onChange={handleFileOptionChange}
            placeholder="products"
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          onClick={handleUploadFile}
          disabled={fileIsLoading}
          className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
        >
          {fileIsLoading ? 'Subiendo...' : 'Subir imagen'}
        </button>

        {/* Resultados archivo */}
        {renderResults(fileResults, fileIsLoading, fileError)}
      </div>

      {/* Información adicional sobre los templates de Cloudinary */}
      <div className="mt-8 p-6 rounded-lg border bg-blue-50">
        <h2 className="text-xl font-semibold mb-4">Información sobre Templates de Cloudinary</h2>
        
        <p className="mb-4">
          Este sistema utiliza un template de Cloudinary configurado para generar automáticamente 
          versiones optimizadas de las imágenes. Para acceder a la versión generada por el template, 
          puedes utilizar la siguiente estructura de URL:
        </p>
        
        <div className="bg-blue-100 p-3 rounded font-mono text-sm mb-4">
          https://res.cloudinary.com/tu-cloud-name/image/upload/<strong>t_product_standard/</strong>v1234567890/ruta/a/tu-imagen.jpg
        </div>
        
        <p className="mb-2 font-medium">Pruebas adicionales que puedes realizar:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Subir imágenes de diferentes tamaños para comprobar el redimensionamiento</li>
          <li>Verificar la calidad de la optimización en imágenes con mucho detalle</li>
          <li>Probar la carga de imágenes con transparencia (PNG, WebP)</li>
          <li>Comprobar la mejora de calidad en imágenes pequeñas que se escalan</li>
        </ul>
      </div>
    </div>
  );
}