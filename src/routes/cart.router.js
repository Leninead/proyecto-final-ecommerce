// cart.router.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

const authenticationMiddleware = require('../middlewares/authentication'); // Assuming you have authentication middleware

/**
 * @swagger
 * /carts:
 *   post:
 *     summary: Create a new cart for a user
 *     description: Create a new cart for the specified user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *             required:
 *               - userId
 *     responses:
 *       201:
 *         description: Cart created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       500:
 *         description: Internal Server Error.
 */
router.post('/', cartController.createCart);

/**
 * @swagger
 * /carts/{userId}:
 *   get:
 *     summary: Get a user's cart
 *     description: Retrieve the cart for the specified user.
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID of the user to retrieve the cart for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response with the user's cart.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Cart not found.
 *       500:
 *         description: Internal Server Error.
 */
router.get('/:userId', cartController.getCart);

/**
 * @swagger
 * /carts/{cartId}/products/{productId}:
 *   post:
 *     summary: Add a product to the cart
 *     description: Add a specified quantity of a product to the cart.
 *     parameters:
 *       - name: cartId
 *         in: path
 *         required: true
 *         description: ID of the cart to add the product to.
 *         schema:
 *           type: string
 *       - name: productId
 *         in: path
 *         required: true
 *         description: ID of the product to add to the cart.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *             required:
 *               - quantity
 *     responses:
 *       200:
 *         description: Product added to the cart successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Cart or product not found.
 *       500:
 *         description: Internal Server Error.
 */
router.post('/:cartId/products/:productId', cartController.addProductToCart);

/**
 * @swagger
 * /carts/{cartId}/products/{productId}:
 *   put:
 *     summary: Update product quantity in the cart
 *     description: Update the quantity of a product in the cart.
 *     parameters:
 *       - name: cartId
 *         in: path
 *         required: true
 *         description: ID of the cart containing the product.
 *         schema:
 *           type: string
 *       - name: productId
 *         in: path
 *         required: true
 *         description: ID of the product to update in the cart.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *             required:
 *               - quantity
 *     responses:
 *       200:
 *         description: Product quantity updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Cart not found or product not found in cart.
 *       500:
 *         description: Internal Server Error.
 */
router.put('/:cartId/products/:productId', cartController.updateProductQuantity);

/**
 * @swagger
 * /carts/{cartId}/products/{productId}:
 *   delete:
 *     summary: Remove a specific product from the cart
 *     description: Remove a specific product from the cart.
 *     parameters:
 *       - name: cartId
 *         in: path
 *         required: true
 *         description: ID of the cart containing the product.
 *         schema:
 *           type: string
 *       - name: productId
 *         in: path
 *         required: true
 *         description: ID of the product to remove from the cart.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product removed from the cart successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Cart not found or product not found in cart.
 *       500:
 *         description: Internal Server Error.
 */
router.delete('/:cartId/products/:productId', cartController.removeProductFromCart);

/**
 * @swagger
 * /carts/{cartId}:
 *   delete:
 *     summary: Clear the entire cart
 *     description: Clear all products from the specified cart.
 *     parameters:
 *       - name: cartId
 *         in: path
 *         required: true
 *         description: ID of the cart to clear.
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Cart cleared successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Cart not found.
 *       500:
 *         description: Internal Server Error.
 */
router.delete('/:cartId', cartController.clearCart);

/**
 * @swagger
 * /carts/{cartId}/purchase:
 *   post:
 *     summary: Purchase the items in the cart
 *     description: Purchase the items in the cart, updating product stocks, user balance, and clearing the cart.
 *     parameters:
 *       - name: cartId
 *         in: path
 *         required: true
 *         description: ID of the cart to purchase items from.
 *         schema:
 *           type: string
 *     security:
 *       - jwtAuth: []
 *     responses:
 *       200:
 *         description: Purchase successful.
 *       403:
 *         description: Insufficient funds or user not authenticated.
 *       404:
 *         description: Cart not found.
 *       500:
 *         description: Internal Server Error.
 */
router.post('/:cartId/purchase', authenticationMiddleware, cartController.purchaseCart);

module.exports = router;