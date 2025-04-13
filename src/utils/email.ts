import nodemailer from 'nodemailer';

// Email configuration
const emailConfig = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
};

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

// Email templates
export enum EmailTemplate {
  MEMBERSHIP_RENEWAL = 'membership_renewal',
  WELCOME = 'welcome',
  PASSWORD_RESET = 'password_reset',
}

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

// Email template functions
const getMembershipRenewalEmail = (clientName: string, endDate: Date, planType: string) => {
  const formattedDate = new Date(endDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return {
    subject: 'Your Membership is About to Expire',
    text: `Dear ${clientName},\n\nYour ${planType} membership is about to expire on ${formattedDate}. Please visit our gym to renew your membership and continue enjoying our services.\n\nThank you,\nGym Management Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Membership Renewal Reminder</h2>
        <p>Dear ${clientName},</p>
        <p>Your <strong>${planType}</strong> membership is about to expire on <strong>${formattedDate}</strong>.</p>
        <p>Please visit our gym to renew your membership and continue enjoying our services.</p>
        <div style="margin-top: 20px; padding: 15px; background-color: #f7f7f7; border-radius: 5px;">
          <p style="margin: 0;">Thank you,<br>Gym Management Team</p>
        </div>
      </div>
    `,
  };
};

const getWelcomeEmail = (clientName: string, planType: string) => {
  return {
    subject: 'Welcome to Our Gym!',
    text: `Dear ${clientName},\n\nWelcome to our gym! Your ${planType} membership has been successfully activated. We're excited to have you join our fitness community.\n\nIf you have any questions, please don't hesitate to reach out to our staff.\n\nThank you,\nGym Management Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to Our Gym!</h2>
        <p>Dear ${clientName},</p>
        <p>Welcome to our gym! Your <strong>${planType}</strong> membership has been successfully activated.</p>
        <p>We're excited to have you join our fitness community.</p>
        <p>If you have any questions, please don't hesitate to reach out to our staff.</p>
        <div style="margin-top: 20px; padding: 15px; background-color: #f7f7f7; border-radius: 5px;">
          <p style="margin: 0;">Thank you,<br>Gym Management Team</p>
        </div>
      </div>
    `,
  };
};

const getPasswordResetEmail = (userName: string, resetToken: string) => {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

  return {
    subject: 'Password Reset Request',
    text: `Dear ${userName},\n\nYou requested a password reset. Please click on the following link to reset your password: ${resetUrl}\n\nIf you did not request this, please ignore this email.\n\nThank you,\nGym Management Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>Dear ${userName},</p>
        <p>You requested a password reset. Please click on the button below to reset your password:</p>
        <div style="text-align: center; margin: 25px 0;">
          <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
        </div>
        <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
        <p>${resetUrl}</p>
        <p>If you did not request this, please ignore this email.</p>
        <div style="margin-top: 20px; padding: 15px; background-color: #f7f7f7; border-radius: 5px;">
          <p style="margin: 0;">Thank you,<br>Gym Management Team</p>
        </div>
      </div>
    `,
  };
};

// Get email content by template
export const getEmailContent = (
  template: EmailTemplate,
  data: any
): { subject: string; text: string; html: string } => {
  switch (template) {
    case EmailTemplate.MEMBERSHIP_RENEWAL:
      return getMembershipRenewalEmail(data.clientName, data.endDate, data.planType);
    case EmailTemplate.WELCOME:
      return getWelcomeEmail(data.clientName, data.planType);
    case EmailTemplate.PASSWORD_RESET:
      return getPasswordResetEmail(data.userName, data.resetToken);
    default:
      throw new Error('Invalid email template');
  }
};

// Send email
export const sendEmail = async (
  to: string,
  template: EmailTemplate,
  data: any
): Promise<boolean> => {
  try {
    const { subject, text, html } = getEmailContent(template, data);

    const mailOptions: EmailOptions = {
      to,
      subject,
      text,
      html,
    };

    // Add from address
    if (process.env.EMAIL_FROM) {
      (mailOptions as any).from = process.env.EMAIL_FROM;
    }

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}; 