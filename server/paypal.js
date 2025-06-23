import express from "express";
import "dotenv/config";
import paypal from "@paypal/checkout-server-sdk"; // Import the entire module
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

const {
    PAYPAL_CLIENT_ID,
    PAYPAL_CLIENT_SECRET,
    PORT = 8080,
} = process.env;

// Setup PayPal client
const environment = new paypal.core.SandboxEnvironment(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET);
const client = new paypal.core.PayPalHttpClient(environment);

// Create an order
const createOrder = async (cart) => {
    const request = new paypal.orders.OrdersCreateRequest(); // Create request for creating an order
    request.requestBody({
        intent: "CAPTURE",
        purchaseUnits: [
            {
                amount: {
                    currencyCode: "USD",
                    value: "100", // Use dynamic value based on cart
                },
            },
        ],
    });

    try {
        const order = await client.execute(request);
        return {
            jsonResponse: order.result,
            httpStatusCode: 201,
        };
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
};

// createOrder route
app.post("/api/orders", async (req, res) => {
    try {
        const { cart } = req.body;
        const { jsonResponse, httpStatusCode } = await createOrder(cart);
        res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
        console.error("Failed to create order:", error);
        res.status(500).json({ error: "Failed to create order." });
    }
});

// Capture payment for the created order
const captureOrder = async (orderID) => {
    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({}); // Add capture options if needed

    try {
        const capture = await client.execute(request);
        return {
            jsonResponse: capture.result,
            httpStatusCode: 200,
        };
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
};

// captureOrder route
app.post("/api/orders/:orderID/capture", async (req, res) => {
    try {
        const { orderID } = req.params;
        const { jsonResponse, httpStatusCode } = await captureOrder(orderID);
        res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
        console.error("Failed to capture order:", error);
        res.status(500).json({ error: "Failed to capture order." });
    }
});

app.listen(PORT, () => {
    console.log(`Node server listening at http://localhost:${PORT}/`);
});
