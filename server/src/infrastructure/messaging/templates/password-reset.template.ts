export const passwordResetTemplate = {
  subject: 'Password Reset - ZeekNet Job Portal',
  html: (resetLink: string) => `
      <table style="width: 100%; max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; border-collapse: collapse;">
        <tr>
          <td style="background-color: white; padding: 30px; text-align: center;">
            <h2 style="color: #2c3e50; margin: 0 0 20px 0; font-size: 24px;">Reset Your Password</h2>
            
            <p style="color: #555; font-size: 16px; line-height: 1.5; text-align: left; margin: 0 0 20px 0;">Hello,</p>
            <p style="color: #555; font-size: 16px; line-height: 1.5; text-align: left; margin: 0 0 20px 0;">You requested a password reset. Click the button below to reset your password:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
            </div>
  
            <p style="color: #555; font-size: 16px; line-height: 1.5; text-align: left; margin: 20px 0 10px 0;"><strong>Please Note:</strong></p>
            <p style="color: #555; font-size: 16px; line-height: 1.5; text-align: left; margin: 0 0 10px 0;">• This link will expire in 1 hour</p>
            <p style="color: #555; font-size: 16px; line-height: 1.5; text-align: left; margin: 0 0 20px 0;">• If you didn't request this reset, please ignore this email</p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #666; font-size: 14px; text-align: center;">This is an automated email, please do not reply.</p>
          </td>
        </tr>
      </table>
    `,
};
