export const SHOPKEEPER_APPROVAL_EMAIL_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Shopkeeper Approval Request</title>
  <style>
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #4CAF50;
      color: white !important;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
      margin: 10px 0;
    }
    .details-table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
    }
    .details-table td {
      padding: 10px;
      border-bottom: 1px solid #eee;
    }
    .details-table tr:last-child td {
      border-bottom: none;
    }
  </style>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #2E7D32); padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
    <h1 style="color: white; margin: 0;">Shopkeeper Approval Request</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello Admin,</p>
    <p>A new shopkeeper has registered and requires approval:</p>

    <table class="details-table">
      <tr>
        <td><strong>Shop Name:</strong></td>
        <td>{shopName}</td>
      </tr>
      <tr>
        <td><strong>License Number:</strong></td>
        <td>{licenseNumber}</td>
      </tr>
    </table>

    <div style="text-align: center;">
      <a href="{approvalUrl}" class="button">APPROVE / REJECT</a>
    </div>

    <p style="font-size: 0.9em; color: #666; text-align: center;">
      Or manually review in admin panel: <br>
      <span style="word-break: break-all;">{approvalUrl}</span>
    </p>

    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">

    <p>Best regards,<br>TradTech Admin Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message. Do not reply directly.</p>
  </div>
</body>
</html>
`;

export const SHOPKEEPER_APPROVAL_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shop Registration Approved</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 20px;">
    <h2 style="color: #4CAF50;">Your Shop Is Ready!</h2>
  </div>
  
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
    <p>Dear Shop Owner,</p>
    
    <p>Congratulations! Your shop <strong>"{shopName}"</strong> has been approved.</p>
    
    <p style="margin: 25px 0;">
      <a href="{loginUrl}" 
         style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        Log In Now
      </a>
    </p>
    
    <p>You can now:</p>
    <ul style="padding-left: 20px;">
      <li>Add your products</li>
      <li>Manage orders</li>
      <li>View your dashboard</li>
    </ul>
    
    <p>Need help getting started? Reply to this email.</p>
  </div>
  
  <div style="text-align: center; margin-top: 30px; color: #888; font-size: 0.9em;">
    <p>TradTech Marketplace</p>
  </div>
</body>
</html>
`;

export const SHOPKEEPER_REJECTION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shop Registration Decision</title>
  <style>
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #4CAF50;
      color: white !important;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
      margin-top: 15px;
    }
    .reason-box {
      background-color: #FFF8F8;
      border-left: 4px solid #E53935;
      padding: 15px;
      margin: 20px 0;
    }
  </style>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #E53935, #C62828); padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
    <h1 style="color: white; margin: 0;">Registration Update</h1>
  </div>
  
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Dear Shop Owner,</p>
    
    <p>We regret to inform you that your shop registration for <strong>"{shopName}"</strong> could not be approved at this time.</p>
    
    <div class="reason-box">
      <p><strong>Reason for rejection:</strong></p>
      <p>{rejectionReason}</p>
    </div>
    
    <p>You may:</p>
    <ul style="padding-left: 20px;">
      <li>Contact support at <a href="mailto:{supportEmail}">{supportEmail}</a> for clarification</li>
      <li>Correct the issues and reapply after {reapplyAfterDays} days</li>
    </ul>
    
    <div style="text-align: center; margin-top: 25px;">
      <a href="{supportUrl}" class="button">CONTACT SUPPORT</a>
    </div>
    
    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
    
    <p>Best regards,<br>TradTech Marketplace Team</p>
  </div>
  
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message. Replies are monitored.</p>
  </div>
</body>
</html>
`;