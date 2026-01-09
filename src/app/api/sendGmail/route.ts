import nodemailer from "nodemailer";
import dotenv from "dotenv"

dotenv.config()

export async function POST(req: any) {
    try {
        const { to, subject, text } = await req.json();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS, 
            },
        });


        const mailOptions = {
            from: process.env.GMAIL_USER,
            to,
            subject,
            html: text,
        };
        

        await transporter.sendMail(mailOptions);

        return new Response(JSON.stringify({ message: 'Email sent successfully!' }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {

        console.error(error);
        return new Response(JSON.stringify({ message: 'Error sending email' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
