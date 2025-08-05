import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendBookingEmail(
  to: string,
  bookingId: string,
  seatIds: string[],
  showtimeId: string,
  price: number,
) {
  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Your Movie Ticket</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 30px auto;
        background: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }
      .header {
        background-color: #ff4d4f;
        color: white;
        padding: 20px;
        text-align: center;
        font-size: 24px;
      }
      .content {
        padding: 20px;
        color: #333;
      }
      .content h2 {
        margin-top: 0;
        color: #ff4d4f;
      }
      .ticket-info {
        margin: 20px 0;
        padding: 15px;
        background-color: #fafafa;
        border: 1px solid #eee;
        border-radius: 6px;
      }
      .ticket-info p {
        margin: 6px 0;
      }
      .footer {
        background-color: #f9f9f9;
        text-align: center;
        padding: 15px;
        font-size: 12px;
        color: #888;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        🎬 Cinema Booking Confirmation
      </div>
      <div class="content">
        <h2>Your Movie Ticket</h2>
        <p>Thank you for booking with us! Here are your ticket details:</p>
        <div class="ticket-info">
          <p><b>Booking ID:</b> ${bookingId}</p>
          <p><b>Seats:</b> ${seatIds.join(', ')}</p>
          <p><b>Showtime:</b> ${showtimeId}</p>
          <p><b>Total Price:</b> ${price} VND</p>
        </div>
        <p>Please arrive at least 15 minutes before the showtime. Enjoy the movie! 🍿</p>
      </div>
      <div class="footer">
        © ${new Date().getFullYear()} Cinema Booking. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;

  await transporter.sendMail({
    from: `"Cinema Booking" <${process.env.SMTP_USER}>`,
    to,
    subject: '🎟 Your Movie Ticket Confirmation',
    html: htmlContent,
  });
}
