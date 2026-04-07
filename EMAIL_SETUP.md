# 📧 Email Setup Guide

Your contact form is now configured to send emails directly to you!

## ⚙️ Setup Instructions

### 1. **Install Dependencies**
```bash
npm install
```

### 2. **Configure Your Email**

Open `.env` and fill in your Gmail credentials:

#### Option A: Using Gmail (Recommended)
1. Go to [Google Account Settings](https://myaccount.google.com/apppasswords)
2. Generate an **App Password** (you'll need 2-factor authentication enabled)
3. Copy the 16-character password and paste it in `.env`:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
RECIPIENT_EMAIL=yashaakole6@gmail.com
```

#### Option B: Using Another Email Service
Update `server.js` line 21-26 with your email provider's SMTP settings.

### 3. **Start the Server**

**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

The server runs on `http://localhost:3000`

---

## 📨 How It Works

When a client submits your contact form:

✅ **Form Data Captured:**
- Name
- Email
- Phone/WhatsApp
- Project Type
- Message

📧 **Two Emails Sent:**
1. **To You** – Full contact details in a formatted email
2. **To Client** – Confirmation email with your contact info

---

## 🔒 Security Notes

- **Never commit `.env` to GitHub** – credentials are kept private
- The `.gitignore` file already excludes `.env`
- Each client receives a personalized confirmation email

---

## 📱 Form Fields

| Field | Required | Validation |
|-------|----------|-----------|
| Name | ✅ Yes | Text input |
| Email | ✅ Yes | Valid email format |
| Phone | ✅ Yes | Phone number format |
| Project Type | ❌ No | Text input |
| Message | ✅ Yes | Textarea |

---

## 🚀 Deployment

To deploy to production:

1. **Ensure `.env` is added to `.gitignore`** ✓ (already done)
2. **Use environment variables** on your hosting platform:
   - Heroku, Vercel, Railway, Render, etc.
   - Set `EMAIL_USER`, `EMAIL_PASSWORD`, `RECIPIENT_EMAIL` in your platform's settings

3. **Update frontend** `fetch('/api/contact')` if deployed on a different domain

---

## ❌ Troubleshooting

**"Email service: NOT CONFIGURED ✗"**
→ Check that `EMAIL_USER` and `EMAIL_PASSWORD` are set in `.env`

**"Connection refused"**
→ Make sure the server is running (`npm run dev` or `npm start`)

**"Invalid email received"**
→ Verify your Gmail App Password is correct (not your regular password)

---

**Questions?** Check your server logs for detailed error messages.
