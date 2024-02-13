import fs from 'fs/promises';
import crypto from 'crypto';

class CartManager {
    constructor(filePath) {
        this.filePath = filePath;
        this.init();
    }

    async init() {
        try {
            await fs.access(this.filePath);
        } catch (error) {
            await fs.writeFile(this.filePath, JSON.stringify([]));
        }
    }

    async createCart() {
        const carts = await this.getCarts();
        const cart = {
            id: crypto.randomBytes(8).toString('hex'),
            products: []
        };
        carts.push(cart);
        await fs.writeFile(this.filePath, JSON.stringify(carts));
        return cart;
    }

    async getCarts() {
        const data = await fs.readFile(this.filePath, 'utf8');
        return JSON.parse(data);
    }

    async getCartById(cartId) {
        const carts = await this.getCarts();
        return carts.find(cart => cart.id === cartId) || null;
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex(cart => cart.id === cartId);
        if (cartIndex === -1) {
            throw new Error('Carrito no encontrado');
        }

        const productIndex = carts[cartIndex].products.findIndex(p => p.product === productId);
        if (productIndex !== -1) {
            carts[cartIndex].products[productIndex].quantity += quantity;
        } else {
            carts[cartIndex].products.push({ product: productId, quantity });
        }

        await fs.writeFile(this.filePath, JSON.stringify(carts));
    }

    async removeProductFromCart(cartId, productId) {
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex(cart => cart.id === cartId);
        if (cartIndex === -1) {
            throw new Error('Carrito no encontrado');
        }

        carts[cartIndex].products = carts[cartIndex].products.filter(p => p.product !== productId);
        await fs.writeFile(this.filePath, JSON.stringify(carts));
    }
}

export default CartManager;