import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const users = await prisma.user.findMany();
        return new Response(JSON.stringify(users), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch users' }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, email } = body;

        if (!email) {
            return new Response(JSON.stringify({ error: 'Email is required' }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
            },
        });
        return new Response(JSON.stringify(newUser), {
            status: 201,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to create user' }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
