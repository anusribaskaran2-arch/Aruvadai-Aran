import express from "express";
import nodemailer from "nodemailer";
import Contact from "../models/Contact.js";

const router = express.Router();

const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || "anusribaskaran2@gmail.com";

function createTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error(
      "SMTP credentials missing. Please set SMTP_USER and SMTP_PASS in your environment."
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

// ✅ GET all contact submissions (for admin/viewing)
// IMPORTANT: This route must come before the /:id route
router.get("/", async (req, res) => {
  try {
    console.log("📧 GET /api/contact - Fetching all contacts");
    const contacts = await Contact.find()
      .sort({ createdAt: -1 }) // Newest first
      .select("-__v"); // Exclude version field
    
    console.log(`✅ Found ${contacts.length} contact submissions`);
    res.json(contacts);
  } catch (error) {
    console.error("❌ Error fetching contacts:", error);
    res.status(500).json({ 
      message: "Error fetching contact submissions", 
      error: error.message 
    });
  }
});

// ✅ GET single contact by ID
router.get("/:id", async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Contact submission not found" });
    }
    res.json(contact);
  } catch (error) {
    console.error("Error fetching contact:", error);
    res.status(500).json({ 
      message: "Error fetching contact submission", 
      error: error.message 
    });
  }
});

// ✅ POST new contact submission
router.post("/", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ message: "Name, email, and message are required." });
  }

  try {
    // Save to MongoDB first
    const contactSubmission = new Contact({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject?.trim() || "",
      message: message.trim(),
      status: "new",
    });

    const savedContact = await contactSubmission.save();
    console.log("✅ Contact submission saved to MongoDB:", savedContact._id);

    // Try to send email (optional - won't fail if email not configured)
    try {
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;

      if (smtpUser && smtpPass) {
        const transporter = createTransporter();
        const mailSubject = subject?.trim()
          ? `Aruvadai Aran Support: ${subject.trim()}`
          : "Aruvadai Aran Support Request";

        await transporter.sendMail({
          from: `"Aruvadai Aran" <${smtpUser}>`,
          to: SUPPORT_EMAIL,
          replyTo: email,
          subject: mailSubject,
          html: `
            <p><strong>From:</strong> ${name} (${email})</p>
            <p><strong>Subject:</strong> ${subject || "—"}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, "<br />")}</p>
            <hr>
            <p><small>Contact ID: ${savedContact._id}</small></p>
          `,
        });
        console.log("✅ Email notification sent");
      } else {
        console.log("ℹ️  Email not configured - submission saved to database only");
      }
    } catch (emailError) {
      // Don't fail the request if email fails - data is already saved
      console.error("⚠️  Email sending failed (but submission saved):", emailError.message);
    }

    res.json({ 
      message: "Your request has been received. We'll get back to you soon!",
      id: savedContact._id 
    });
  } catch (error) {
    console.error("Contact submission error:", error);
    res.status(500).json({
      message: "Unable to save your message. Please try again later.",
      error: error.message,
    });
  }
});

// ✅ UPDATE contact status (mark as read, replied, etc.)
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["new", "read", "replied", "archived"];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}` 
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ message: "Contact submission not found" });
    }

    res.json({ 
      message: "Status updated successfully", 
      contact 
    });
  } catch (error) {
    console.error("Error updating contact status:", error);
    res.status(500).json({ 
      message: "Error updating status", 
      error: error.message 
    });
  }
});

export default router;


