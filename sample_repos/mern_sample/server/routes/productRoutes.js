const express = require('express');
const router = express.Router();

// Mock in-memory products store
let products = [
    { id: '1', name: 'Mechanical Keyboard', price: 99.99, inStock: true },
    { id: '2', name: 'Wireless Mouse', price: 49.99, inStock: true }
];

// @route GET /api/products
router.get('/', (req, res) => {
    return res.json(products);
});

// @route POST /api/products
router.post('/', (req, res) => {
    const { name, price } = req.body;
    if (!name || price === undefined) {
        return res.status(400).json({ error: 'Name and price are required' });
    }
    const newProduct = {
        id: String(products.length + 1),
        name,
        price: Number(price),
        inStock: true
    };
    products.push(newProduct);
    return res.status(201).json(newProduct);
});

module.exports = router;
