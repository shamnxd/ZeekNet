export const priceChangeNotificationTemplate = {
  subject: (planName: string) => `Important: Price Change Notice for ${planName} - Action Required`,

  html: (
    planName: string,
    oldPrice: number,
    newPrice: number,
    billingCycle: 'monthly' | 'yearly',
    periodEnd: Date | undefined,
    companyName?: string,
  ) => {
    const billingPeriod = billingCycle === 'monthly' ? 'month' : 'year';
    const oldPriceFormatted = `$${oldPrice.toFixed(2)}`;
    const newPriceFormatted = `$${newPrice.toFixed(2)}`;
    const priceChange = newPrice > oldPrice ? 'increased' : 'decreased';
    const periodEndFormatted = periodEnd
      ? periodEnd.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      : 'the end of your current billing period';

    return `
      <table style="width: 100%; max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; border-collapse: collapse;">
        <tr>
          <td style="background-color: #fef2f2; padding: 30px; text-align: center; border-left: 4px solid #ef4444;">
            <h2 style="color: #991b1b; margin: 0 0 10px 0; font-size: 24px;">⚠️ Important Price Change Notice</h2>
            <p style="color: #7f1d1d; margin: 0; font-size: 14px;">Action Required - Please Read</p>
          </td>
        </tr>
        <tr>
          <td style="background-color: white; padding: 30px;">
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;">${companyName ? `Dear ${companyName},` : 'Dear Valued Customer,'}</p>
            
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;">
              We are writing to inform you about an important change to your subscription plan pricing.
            </p>
            
            <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin: 30px 0;">
              <h3 style="color: #991b1b; margin: 0 0 15px 0; font-size: 18px;">Price Change Details</h3>
              <p style="color: #555; font-size: 16px; line-height: 1.5; margin: 0 0 10px 0;"><strong>Plan Name:</strong> ${planName}</p>
              <p style="color: #555; font-size: 16px; line-height: 1.5; margin: 0 0 10px 0;"><strong>Billing Cycle:</strong> ${billingCycle === 'monthly' ? 'Monthly' : 'Yearly'}</p>
              <p style="color: #555; font-size: 16px; line-height: 1.5; margin: 0 0 10px 0;"><strong>Current Price:</strong> ${oldPriceFormatted} per ${billingPeriod}</p>
              <p style="color: #555; font-size: 16px; line-height: 1.5; margin: 0;"><strong>New Price:</strong> <span style="color: ${newPrice > oldPrice ? '#dc2626' : '#16a34a'}; font-weight: bold;">${newPriceFormatted} per ${billingPeriod}</span></p>
            </div>
            
            <div style="background-color: #fff7ed; border-left: 4px solid #f59e0b; padding: 20px; margin: 30px 0;">
              <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px;">📋 What This Means For You</h3>
              <ul style="color: #555; font-size: 16px; line-height: 1.8; margin: 0; padding-left: 20px;">
                <li><strong>Your current subscription will end on ${periodEndFormatted}</strong></li>
                <li>Your subscription will <strong>NOT automatically renew</strong></li>
                <li>You will continue to have full access until ${periodEndFormatted}</li>
                <li>No charges will be made after your current period ends</li>
              </ul>
            </div>
            
            <div style="background-color: #f0f9ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 30px 0;">
              <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">✅ How to Continue Your Service</h3>
              <p style="color: #555; font-size: 16px; line-height: 1.5; margin: 0 0 15px 0;">
                If you wish to continue using our service after ${periodEndFormatted}, you can:
              </p>
              <ol style="color: #555; font-size: 16px; line-height: 1.8; margin: 0 0 15px 0; padding-left: 20px;">
                <li>Log in to your account before your subscription ends</li>
                <li>Navigate to the billing or subscription section</li>
                <li>Select the <strong>${planName}</strong> plan at the new price of <strong>${newPriceFormatted}/${billingPeriod}</strong></li>
                <li>Complete the subscription process</li>
              </ol>
              <p style="color: #555; font-size: 16px; line-height: 1.5; margin: 0;">
                <strong>Note:</strong> You can upgrade or choose a different plan at any time before your current subscription ends.
              </p>
            </div>
            
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin: 20px 0;">
              We understand that price changes can be inconvenient, and we appreciate your understanding. This change allows us to continue providing you with the best possible service and features.
            </p>
            
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin: 20px 0;">
              If you have any questions or concerns, please don't hesitate to contact our support team. We're here to help make this transition as smooth as possible.
            </p>
            
            <div style="background-color: #f8fafc; border-radius: 4px; padding: 15px; margin: 30px 0; text-align: center;">
              <p style="color: #475569; font-size: 14px; line-height: 1.5; margin: 0;">
                <strong>Need Help?</strong> Contact our support team at support@zeeknet.com
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
