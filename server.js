const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5500;

app.use(cors());
app.use(express.json());

const vegetablesFile = path.join(__dirname, 'vegetable.json');
const ordersFile = path.join(__dirname, 'orders.json');

// Helper functions
function readJson(filePath) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '[]');
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// GET vegetables
app.get('/api/vegetables', (req, res) => {
    try {
        const vegetables = readJson(vegetablesFile);
        res.json(vegetables);
    } catch (err) {
        res.status(500).json({ message: 'Failed to load vegetables.'});
    }
});

// POST order
app.post('/api/orders', (req, res) => {
    try {
        const { customer, cart } = req.body;

        if (!customer || !cart || !Array.isArray(cart) || cart.length === 0) {
            return res.status(400).json({ message: 'Invalid order data.'});
        }

        const requiredFields = ['name', 'email', 'phone', 'address'];

        for (const field of requiredFields) {
            if (!customer[field] || customer[field].trim() ==='') {
                return res.status(400).json({ message: `Missing field: ${field}`});
            }
        }

        const orders = readJson(ordersFile);

        const newOrder = {
            id: orders.length + 1,
            createdAt: new Date().toISOString(),
            customer,
            cart,
            status: 'received'
        };

        orders.push(newOrder);
        writeJson(ordersFile, orders);

        res.status(201).json({
            message: 'Order placed successfully!',
            orderId: newOrder.id
        });

    } catch (err) {
        res.status(500).json({ message: 'Failed to place order.'});
    }
});

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});