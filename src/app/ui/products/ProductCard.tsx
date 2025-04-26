//ui/products/ProductCard.tsx
import Image from 'next/image';

const ProductCard = ({ product }) => {
    return (
      <div className="product-card">
        <div className="product-image-container">
          <Image
            src={product.image}
            alt={product.name}
            width={240}
            height={240}
            className="product-image"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-gray-600">{product.description}</p>
          <span className="text-xl font-bold">{product.price}</span>
        </div>
      </div>
    );
  };
  