export const subscriptionMigrationTemplate = {
  subject: (planName: string) => `Important: Your Subscription Plan Has Been Updated - ${planName}`,
  
  html: (planName: string, oldPrice: number, newPrice: number, billingCycle: 'monthly' | 'yearly', companyName?: string) => {
    const billingPeriod = billingCycle === 'monthly' ? 'month' : 'year';
    const oldPriceFormatted = `$${oldPrice.toFixed(2)}`;
    const newPriceFormatted = `$${newPrice.toFixed(2)}`;
    const priceChange = newPrice > oldPrice ? 'increased' : 'decreased';
    
    return `
      <table style="width: 100%; max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; border-collapse: collapse;">
        <tr>
          <td style="background-color: #f8fafc; padding: 30px; text-align: center;">
            <h2 style="color: #2c3e50; margin: 0 0 20px 0; font-size: 24px;">Subscription Plan Update</h2>
          </td>
        </tr>
        <tr>
          <td style="background-color: white; padding: 30px;">
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;">${companyName ? `Dear ${companyName},` : 'Dear Valued Customer,'}</p>
            
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;">
              We are writing to inform you that your subscription plan has been updated. This is a required migration to ensure continued service.
            </p>
            
            <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 20px; margin: 30px 0;">
              <h3 style="color: #2c3e50; margin: 0 0 15px 0; font-size: 18px;">Plan Details</h3>
              <p style="color: #555; font-size: 16px; line-height: 1.5; margin: 0 0 10px 0;"><strong>Plan Name:</strong> ${planName}</p>
              <p style="color: #555; font-size: 16px; line-height: 1.5; margin: 0 0 10px 0;"><strong>Billing Cycle:</strong> ${billingCycle === 'monthly' ? 'Monthly' : 'Yearly'}</p>
              <p style="color: #555; font-size: 16px; line-height: 1.5; margin: 0 0 10px 0;"><strong>Previous Price:</strong> ${oldPriceFormatted} per ${billingPeriod}</p>
              <p style="color: #555; font-size: 16px; line-height: 1.5; margin: 0;"><strong>New Price:</strong> ${newPriceFormatted} per ${billingPeriod}</p>
            </div>
            
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin: 20px 0;">
              <strong>Important Information:</strong>
            </p>
            <ul style="color: #555; font-size: 16px; line-height: 1.8; margin: 0 0 20px 0; padding-left: 20px;">
              <li>Your subscription has been automatically migrated to the new pricing</li>
              <li>Your billing cycle remains the same (${billingCycle === 'monthly' ? 'monthly' : 'yearly'})</li>
              <li>Your next invoice will reflect the new price of ${newPriceFormatted}</li>
              ${newPrice < oldPrice ? '<li>You will see a credit or prorated amount on your next invoice</li>' : ''}
            </ul>
            
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin: 20px 0;">
              If you have any questions or concerns about this change, please don't hesitate to contact our support team. We're here to help.
            </p>
            
            <div style="background-color: #f0f9ff; border-radius: 4px; padding: 15px; margin: 30px 0;">
              <p style="color: #0369a1; font-size: 14px; line-height: 1.5; margin: 0;">
                <strong>Note:</strong> This migration was performed in accordance with our terms of service. You will receive a detailed invoice from Stripe showing the prorated charges or credits.
              </p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #666; font-size: 14px; text-align: center; margin: 0;">
              Thank you for being a valued customer.<br>
              Best regards,<br>
              <strong>The ZeekNet Team</strong>
            </p>
          </td>
        </tr>
      </table>
    `;
  },
};
