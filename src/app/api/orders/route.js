// /app/api/orders/route.ts
import "dotenv/config";
import {
    ApiError,
    Client,
    Environment,
    LogLevel,
    OrdersController,
} from "@paypal/paypal-server-sdk";

import menuData from '@/app/menuData.json'

const client = new Client({
    clientCredentialsAuthCredentials: {
        oAuthClientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
        oAuthClientSecret: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_SECRET,
    },
    timeout: 0,
    environment: Environment.Sandbox,
    logging: {
        logLevel: LogLevel.Info,
        logRequest: { logBody: true },
        logResponse: { logHeaders: true },
    },
});

const ordersController = new OrdersController(client);


const createOrder = async (cart) => {
    
    const _items = cart
        .map((item, index) => {
            if (item.amount > 0) {
                return {
                    name: item.title,
                    unitAmount: { // Corrected naming
                        currencyCode: "SEK", // Corrected naming
                        value: menuData[index].price.toString(),
                    },
                    quantity: item.amount.toString(),
                };
            }
            return null;
        })
        .filter(item => item !== null); 

    console.log("Items to be sent to PayPal:", _items); 

    // Calculate the total amount
    const total = cart.reduce((accumulatedTotal, item, index) => {
        return accumulatedTotal + (item.amount * menuData[index].price);
    }, 0);

    console.log("Calculated total:", total); // Log the total for debugging

    const collect = {
        body: {
            intent: "CAPTURE",
            purchaseUnits: [
                {
                    amount: {
                        currencyCode: "SEK", 
                        value: total.toString(),
                        breakdown: {
                            itemTotal: {
                                currencyCode: "SEK", 
                                value: total.toString(),
                            },
                        },
                    },
                    items: _items, // Pass filtered and corrected items
                },
            ],
        },
        prefer: "return=minimal",
    };

    try {
        const response = await ordersController.ordersCreate(collect);
        const { body, ...httpResponse } = response; // Destructure correctly
        return {
            jsonResponse: JSON.parse(body),
            httpStatusCode: httpResponse.statusCode,
        };
    } catch (error) {
        if (error instanceof ApiError) {
            throw new Error(error.message);
        } else {
            throw new Error("An unknown error occurred.");
        }
    }
};

export async function POST(req) {
    try {
        const { cart } = await req.json(); // Parse JSON body
        const { jsonResponse, httpStatusCode } = await createOrder(cart);
        return new Response(JSON.stringify(jsonResponse), {
            status: httpStatusCode,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Failed to create order:", error);
        return new Response(JSON.stringify({ error: "Failed to create order." }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
