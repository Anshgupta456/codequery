import React from 'react';

export interface Product {
    id: string;
    name: string;
    price: number;
    inStock: boolean;
}

interface ProductCardProps {
    product: Product;
    onAddToCart: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
    return (
        <div className="product-card">
            <h3>{product.name}</h3>
            <p className="price">${product.price.toFixed(2)}</p>
            <p className="status">{product.inStock ? 'In Stock' : 'Out of Stock'}</p>
            <button
                disabled={!product.inStock}
                onClick={() => onAddToCart(product.id)}
            >
                Add to Cart
            </button>
        </div>
    );
};
