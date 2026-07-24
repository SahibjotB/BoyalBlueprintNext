import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import pool from '@/lib/db';

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be logged in to book an appointment.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { date, time, notes, phone: customPhone } = body;

    if (!date || !time) {
      return NextResponse.json(
        { error: 'Please select both a date and a time for your webinar appointment.' },
        { status: 400 }
      );
    }

    const userName = session.user.name || 'Valued Client';
    const userEmail = session.user.email || 'No email provided';
    const userPhone = (session.user as any).phone || customPhone || 'Not provided';

    // 1. Save to Database
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS webinar_bookings (
          id SERIAL PRIMARY KEY,
          user_email VARCHAR(255) NOT NULL,
          user_name VARCHAR(255),
          phone VARCHAR(255),
          booking_date VARCHAR(255) NOT NULL,
          booking_time VARCHAR(255) NOT NULL,
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await pool.query(
        `INSERT INTO webinar_bookings (user_email, user_name, phone, booking_date, booking_time, notes) VALUES ($1, $2, $3, $4, $5, $6)`,
        [userEmail, userName, userPhone, date, time, notes || null]
      );
    } catch (dbErr) {
      console.error('Failed to save webinar booking to DB:', dbErr);
    }

    const targetEmail = 'sahibjot.28@gmail.com';

    const emailSubject = `Free Webinar Booking Request from ${userName}`;
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f5f7; margin: 0; padding: 20px; color: #1e293b; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
            .header { border-bottom: 2px solid #f97316; padding-bottom: 16px; margin-bottom: 24px; }
            .header h2 { color: #0f172a; margin: 0 0 6px 0; font-size: 24px; }
            .badge { display: inline-block; background-color: #ffedd5; color: #c2410c; font-weight: 700; font-size: 12px; padding: 4px 12px; border-radius: 9999px; text-transform: uppercase; tracking: 1px; }
            .info-grid { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
            .info-grid td { padding: 12px 16px; border-bottom: 1px solid #f1f5f9; }
            .label { font-weight: 600; color: #64748b; width: 35%; }
            .value { font-weight: 500; color: #0f172a; }
            .highlight { color: #f97316; font-weight: 700; }
            .notes-box { background-color: #f8fafc; border-left: 4px solid #f97316; padding: 16px; border-radius: 8px; font-style: italic; margin-top: 16px; }
            .footer { margin-top: 32px; pt: 16px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #94a3b8; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <span class="badge">New Webinar Appointment</span>
              <h2>Free Webinar Booking Request</h2>
              <p style="margin: 4px 0 0 0; color: #64748b; font-size: 14px;">A client has booked a 1-on-1 webinar consultation.</p>
            </div>
            
            <table class="info-grid">
              <tr>
                <td class="label">Client Name</td>
                <td class="value">${userName}</td>
              </tr>
              <tr>
                <td class="label">Email Address</td>
                <td class="value"><a href="mailto:${userEmail}" style="color: #f97316; text-decoration: none;">${userEmail}</a></td>
              </tr>
              <tr>
                <td class="label">Phone Number</td>
                <td class="value">${userPhone}</td>
              </tr>
              <tr>
                <td class="label">Appointment Date</td>
                <td class="value highlight">${date}</td>
              </tr>
              <tr>
                <td class="label">Appointment Time</td>
                <td class="value highlight">${time}</td>
              </tr>
            </table>

            ${notes ? `
            <div>
              <div style="font-weight: 600; color: #64748b; margin-bottom: 6px;">Client Notes / Goals:</div>
              <div class="notes-box">${notes}</div>
            </div>
            ` : ''}

            <div class="footer">
              <p>Sent automatically from <strong>Boyal Blueprint</strong> website system.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    console.log('--- WEBINAR BOOKING RECEIVED ---');
    console.log(`To: ${targetEmail}`);
    console.log(`Subject: ${emailSubject}`);
    console.log(`User: ${userName} (${userEmail}, ${userPhone})`);
    console.log(`Date & Time: ${date} at ${time}`);

    let emailSent = false;
    let emailError: string | null = null;

    // Check if Resend API Key is available
    if (process.env.RESEND_API_KEY) {
      try {
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: process.env.EMAIL_FROM || 'Boyal Blueprint <onboarding@resend.dev>',
            to: [targetEmail],
            subject: emailSubject,
            html: emailHtml,
          }),
        });

        if (resendRes.ok) {
          emailSent = true;
          console.log('Successfully dispatched email via Resend API');
        } else {
          const errData = await resendRes.json();
          emailError = JSON.stringify(errData);
          console.error('Resend API Error:', errData);
        }
      } catch (err: any) {
        emailError = err?.message || 'Failed to dispatch via Resend';
        console.error('Failed to send email via Resend API:', err);
      }
    } else {
      console.log('Note: RESEND_API_KEY not found in environment. Booking logged to server console.');
    }

    return NextResponse.json({
      success: true,
      message: 'Your webinar appointment has been requested successfully!',
      details: {
        userName,
        userEmail,
        userPhone,
        date,
        time,
        emailSent,
        ...(emailError ? { emailError } : {}),
      },
    });
  } catch (error: any) {
    console.error('Error in /api/book-webinar:', error);
    return NextResponse.json(
      { error: error?.message || 'An internal error occurred while booking your appointment.' },
      { status: 500 }
    );
  }
}
