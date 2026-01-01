export const welcomeTemplate = {
  subject: 'Welcome to ZeekNet Job Portal',
  html: (name: string, dashboardLink: string) => `
      <table style="width: 100%; max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; border-collapse: collapse;">
        <tr>
          <td style="background-color: white; padding: 30px; text-align: center;">
            <h2 style="color: #2c3e50; margin: 0 0 20px 0; font-size: 24px;">Welcome to ZeekNet!</h2>
            
            <p style="color: #555; font-size: 16px; line-height: 1.5; text-align: left; margin: 0 0 20px 0;">Hello ${name},</p>
            <p style="color: #555; font-size: 16px; line-height: 1.5; text-align: left; margin: 0 0 20px 0;">Welcome to ZeekNet Job Portal! We're excited to have you join our community.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${dashboardLink}" style="background-color: #2c3e50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Get Started</a>
            </div>
  
            <p style="color: #555; font-size: 16px; line-height: 1.5; text-align: left; margin: 20px 0 10px 0;">What's next?</p>
            <p style="color: #555; font-size: 16px; line-height: 1.5; text-align: left; margin: 0 0 10px 0;">• Complete your profile</p>
            <p style="color: #555; font-size: 16px; line-height: 1.5; text-align: left; margin: 0 0 20px 0;">• Start exploring job opportunities</p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #666; font-size: 14px; text-align: center;">This is an automated email, please do not reply.</p>
          </td>
        </tr>
      </table>
    `,
};
