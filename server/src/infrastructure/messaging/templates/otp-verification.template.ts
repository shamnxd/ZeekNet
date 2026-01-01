export const otpVerificationTemplate = {
  subject: 'Verify Your Email - ZeekNet Job Portal',
  html: (code: string) => `
      <table style="width: 100%; max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; border-collapse: collapse;">
        <tr>
          <td style="background-color: white; padding: 30px; text-align: center;">
            <h2 style="color: #2c3e50; margin: 0 0 20px 0; font-size: 24px;">Verify Your Email</h2>
            
            <p style="color: #555; font-size: 16px; line-height: 1.5; text-align: left; margin: 0 0 20px 0;">Hello,</p>
            <p style="color: #555; font-size: 16px; line-height: 1.5; text-align: left; margin: 0 0 20px 0;">Thanks for registering! Please use the verification code below to verify your email address:</p>
            
            <div style="background-color: #f8fafc; border-radius: 4px; padding: 20px; margin: 30px 0; text-align: center;">
              <span style="font-family: monospace; font-size: 32px; font-weight: bold; color: #2c3e50; letter-spacing: 4px;">${code}</span>
            </div>
  
            <p style="color: #555; font-size: 16px; line-height: 1.5; text-align: left; margin: 20px 0 10px 0;"><strong>Please Note:</strong></p>
            <p style="color: #555; font-size: 16px; line-height: 1.5; text-align: left; margin: 0 0 10px 0;">• This code will expire in 5 minutes</p>
            <p style="color: #555; font-size: 16px; line-height: 1.5; text-align: left; margin: 0 0 20px 0;">• If you didn't request this code, please ignore this email</p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #666; font-size: 14px; text-align: center;">This is an automated email, please do not reply.</p>
          </td>
        </tr>
      </table>
    `,
};
