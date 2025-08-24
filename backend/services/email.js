const nodemailer = require('nodemailer');
const winston = require('winston');

class EmailService {
  constructor() {
    this.transporter = null;
    this.isInitialized = false;
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      defaultMeta: { service: 'email' }
    });
  }

  async initialize() {
    try {
      if (this.isInitialized && this.transporter) {
        return this.transporter;
      }

      // Initialize email transporter
      this.transporter = nodemailer.createTransporter({
        // For production, use a real email service
        host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
        port: process.env.EMAIL_PORT || 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER || 'test@ethereal.email',
          pass: process.env.EMAIL_PASS || 'test-password'
        }
      });

      // Verify connection
      if (process.env.NODE_ENV === 'production') {
        await this.transporter.verify();
      }

      this.isInitialized = true;
      this.logger.info('Email service initialized successfully');
      
      return this.transporter;
    } catch (error) {
      this.logger.error('Failed to initialize email service:', error);
      this.isInitialized = false;
      // Don't throw error - email is optional for basic functionality
      return null;
    }
  }

  async sendEmail(to, subject, text, html = null) {
    try {
      if (!this.transporter) {
        await this.initialize();
      }

      if (!this.transporter) {
        this.logger.warn('Email service not available, skipping email send');
        return false;
      }

      const mailOptions = {
        from: `"Demotivation Station" <${process.env.EMAIL_FROM || 'noreply@demotivationstation.com'}>`,
        to,
        subject,
        text,
        html: html || text
      };

      const result = await this.transporter.sendMail(mailOptions);
      this.logger.info('Email sent successfully:', { to, subject, messageId: result.messageId });
      
      return true;
    } catch (error) {
      this.logger.error('Email send error:', error);
      return false;
    }
  }

  async sendWelcomeEmail(user) {
    const subject = 'Welcome to Demotivation Station!';
    const text = `
Hello ${user.firstName},

Welcome to Demotivation Station! We're thrilled you've joined our community of reality-check enthusiasts.

Here's what you can do with your new account:
• Generate witty demotivational messages
• Create voice demotivations with multiple voice options
• Chat with our AI for both helpful advice and harsh truths
• Track your usage and save favorites

Get started: https://demotivationstation.com/generator

Questions? Visit our FAQ: https://demotivationstation.com/faq

Best regards,
The Demotivation Station Team

P.S. Remember, we're here to crush your dreams... constructively! 😏
    `;

    const html = `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <h1 style="color: #1f2937; text-align: center;">Welcome to Demotivation Station!</h1>
        
        <p>Hello ${user.firstName},</p>
        
        <p>Welcome to Demotivation Station! We're thrilled you've joined our community of reality-check enthusiasts.</p>
        
        <h2 style="color: #374151;">Here's what you can do with your new account:</h2>
        <ul>
          <li>Generate witty demotivational messages</li>
          <li>Create voice demotivations with multiple voice options</li>
          <li>Chat with our AI for both helpful advice and harsh truths</li>
          <li>Track your usage and save favorites</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://demotivationstation.com/generator" 
             style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Get Started
          </a>
        </div>
        
        <p>Questions? <a href="https://demotivationstation.com/faq">Visit our FAQ</a></p>
        
        <p>Best regards,<br>The Demotivation Station Team</p>
        
        <p style="font-size: 14px; color: #6b7280;"><em>P.S. Remember, we're here to crush your dreams... constructively! 😏</em></p>
      </div>
    `;

    return await this.sendEmail(user.email, subject, text, html);
  }

  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL || 'https://demotivationstation.com'}/reset-password?token=${resetToken}`;
    
    const subject = 'Reset Your Password - Demotivation Station';
    const text = `
Hello ${user.firstName},

You requested a password reset for your Demotivation Station account.

Click the link below to reset your password:
${resetUrl}

This link will expire in 1 hour for security reasons.

If you didn't request this reset, please ignore this email. Your account remains secure.

Best regards,
The Demotivation Station Team
    `;

    const html = `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <h1 style="color: #1f2937; text-align: center;">Password Reset Request</h1>
        
        <p>Hello ${user.firstName},</p>
        
        <p>You requested a password reset for your Demotivation Station account.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Reset Password
          </a>
        </div>
        
        <p style="font-size: 14px; color: #6b7280;">This link will expire in 1 hour for security reasons.</p>
        
        <p>If you didn't request this reset, please ignore this email. Your account remains secure.</p>
        
        <p>Best regards,<br>The Demotivation Station Team</p>
      </div>
    `;

    return await this.sendEmail(user.email, subject, text, html);
  }

  async sendSubscriptionConfirmation(user, plan) {
    const subject = `Subscription Confirmed - ${plan.name} Plan`;
    const text = `
Hello ${user.firstName},

Your subscription to the ${plan.name} plan has been confirmed!

Plan Details:
• Plan: ${plan.name}
• Price: $${plan.price}/month
• Features: ${plan.features.join(', ')}

You now have access to all ${plan.name} features. Start using them at:
https://demotivationstation.com/dashboard

Manage your subscription: https://demotivationstation.com/billing

Thank you for upgrading!

Best regards,
The Demotivation Station Team
    `;

    const html = `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <h1 style="color: #1f2937; text-align: center;">Subscription Confirmed! 🎉</h1>
        
        <p>Hello ${user.firstName},</p>
        
        <p>Your subscription to the <strong>${plan.name} plan</strong> has been confirmed!</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Plan Details:</h3>
          <ul>
            <li><strong>Plan:</strong> ${plan.name}</li>
            <li><strong>Price:</strong> $${plan.price}/month</li>
            <li><strong>Features:</strong> ${plan.features.join(', ')}</li>
          </ul>
        </div>
        
        <p>You now have access to all ${plan.name} features.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://demotivationstation.com/dashboard" 
             style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-right: 10px;">
            Start Using Features
          </a>
          <a href="https://demotivationstation.com/billing" 
             style="background-color: #6b7280; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Manage Subscription
          </a>
        </div>
        
        <p>Thank you for upgrading!</p>
        
        <p>Best regards,<br>The Demotivation Station Team</p>
      </div>
    `;

    return await this.sendEmail(user.email, subject, text, html);
  }

  async sendUsageLimitWarning(user, usageData) {
    const subject = 'Usage Limit Warning - Demotivation Station';
    const text = `
Hello ${user.firstName},

You're approaching your monthly usage limits for your ${user.subscription.plan} plan:

Current Usage:
• Demotivations: ${usageData.demotivations.used}/${usageData.demotivations.limit}
• Voice Generations: ${usageData.voices.used}/${usageData.voices.limit}
• Chat Messages: ${usageData.chats.used}/${usageData.chats.limit}

Consider upgrading to continue enjoying unlimited access:
https://demotivationstation.com/pricing

Your usage will reset on ${usageData.resetDate}.

Best regards,
The Demotivation Station Team
    `;

    const html = `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <h1 style="color: #dc2626; text-align: center;">Usage Limit Warning ⚠️</h1>
        
        <p>Hello ${user.firstName},</p>
        
        <p>You're approaching your monthly usage limits for your <strong>${user.subscription.plan} plan</strong>:</p>
        
        <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; margin: 20px 0;">
          <h3 style="color: #dc2626; margin-top: 0;">Current Usage:</h3>
          <ul>
            <li><strong>Demotivations:</strong> ${usageData.demotivations.used}/${usageData.demotivations.limit}</li>
            <li><strong>Voice Generations:</strong> ${usageData.voices.used}/${usageData.voices.limit}</li>
            <li><strong>Chat Messages:</strong> ${usageData.chats.used}/${usageData.chats.limit}</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://demotivationstation.com/pricing" 
             style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Upgrade Now
          </a>
        </div>
        
        <p style="font-size: 14px; color: #6b7280;">Your usage will reset on ${usageData.resetDate}.</p>
        
        <p>Best regards,<br>The Demotivation Station Team</p>
      </div>
    `;

    return await this.sendEmail(user.email, subject, text, html);
  }

  getHealth() {
    return {
      status: this.isInitialized ? 'initialized' : 'not_initialized',
      transporter: this.transporter ? 'configured' : 'not_configured',
      timestamp: new Date().toISOString()
    };
  }
}

// Export singleton instance
module.exports = new EmailService();
