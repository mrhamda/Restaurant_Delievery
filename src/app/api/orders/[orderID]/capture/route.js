// /app/api/orders/[orderID]/capture/route.js
import dotenv from "dotenv"
import { PrismaClient } from '@prisma/client';
import menuData from "@/app/menuData.json"
const prisma = new PrismaClient();
dotenv.config()
import {
    ApiError,
    Client,
    Environment,
    OrdersController,
} from "@paypal/paypal-server-sdk";

const client = new Client({
    clientCredentialsAuthCredentials: {
        oAuthClientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
        oAuthClientSecret: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_SECRET,
    },
    timeout: 0,
    environment: Environment.Sandbox,
});

const ordersController = new OrdersController(client);


const captureOrder = async (orderID) => {
    const collect = {
        id: orderID,
        prefer: "return=minimal",
    };

    try {
        const { body, ...httpResponse } = await ordersController.ordersCapture(collect);
        return {
            jsonResponse: JSON.parse(body),
            httpStatusCode: httpResponse.statusCode,
        };
    } catch (error) {
        console.error("Error during order capture:", error); 
        if (error instanceof ApiError) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error occurred during order capture.");
    }
};

export async function POST(req, { params }) {
    const { orderID } = params; 

    if (!orderID) {
        return new Response(JSON.stringify({ error: "Order ID is required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        const { jsonResponse, httpStatusCode } = await captureOrder(orderID);

        if (httpStatusCode === 201) {
            const body = await req.json();
            const { firstName, lastName, email, address, city, allamount } = body;

            const _items = body.allamount
            .map((item, index) => {
                if (item.amount > 0) {
                    return {
                        name: item.title,
                        unitAmount: { 
                            currencyCode: "SEK", 
                            value: menuData[index].price.toString(),
                        },
                        quantity: item.amount.toString(),
                    };
                }
                return null; 
            })
            .filter(item => item !== null); 

            const order = await prisma.order.create({
                data: {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    address: address,
                    city: city,
                    items: {
                        create: _items.map(item => ({
                            product: item.name,
                            quantity: parseInt(item.quantity),
                            price: parseFloat(item.unitAmount.value)
                        })),
                    },
                },
            });
        }
        
        return new Response(JSON.stringify(jsonResponse), {
            status: httpStatusCode,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Failed to capture order:", error);

        return new Response(JSON.stringify({ error: "Failed to capture order." }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });

        
    }
}
