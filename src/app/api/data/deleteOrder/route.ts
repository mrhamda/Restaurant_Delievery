import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json(); // Extract id from the request body
    const deletedOrder = await prisma.order.delete({
      where: {
        id: id,
      },
    });
    NextResponse.redirect(new URL('/', request.url));

    return NextResponse.json({ message: `Deleted order with ID: ${deletedOrder.id}` });

  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ error: 'Failed to delete the order.' }, { status: 500 });
  } finally {
    await prisma.$disconnect(); // Optional: Disconnect if needed
  }
}
