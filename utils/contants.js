const resetPasswordEmailTemplate = (accessToken, role) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap" rel="stylesheet">
    <title>Email Template</title>
    <style>
      body,
      * {
        margin: 0;
        padding: 0;
        font-family: "Lato", sans-serif;
      }
      tr td{
        padding: 8px;
      }
      .parent-container {
        background-color: rgb(238, 227, 255);
        padding: 46px 54px 20px 54px;
        max-width: 550px;        
        margin: auto;
      }

      .parent-container .main-header img {
        width: 44px;
        height: 24px;
      }

      .child-container {
        background-color: #f5f5f5;
        padding: 24px;
      }

      .main-header {
        width: 100%;
      }

      .header-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 24px;
      }
      .header-slogan {
        margin-left: auto;
        font-size:17px;
      }

      .text-primary {
        color: rgb(104, 33, 160);
      }

      .header-logo {
        display: flex;
        align-items: center;
      }
      .header-logo-text {
        font-size: 2rem;
        line-height: 24px;
        padding-left: 8px;
      }

      .fw-500 {
        font-weight: 600;
      }

      .reset-banner-row td {
        padding: 32px;
      }
      .reset-password-banner {
        display: flex;
        width: 100% !important;
        max-width: 200px;
        margin: auto;
        height: auto !important;
      }
      .w-100 {
        width: 100%;
      }
        .text-center{
        text-align:center;
        }
      .reset-password-btn {
        background-color: rgb(104, 33, 160);
        color: #f5f5f5 !important;
        border-radius: 4px;
        padding: 12px 26px;         
        text-align: center; 
        text-decoration: none;
      }

      .footer {
        padding-top: 20px;
      }

      .footer .footer-info {
        text-align: center;
        color: rgb(95, 95, 95);
      }
    </style>
  </head>
  <body>
    <div class="parent-container">
      <div class="child-container">
        <table>
          <tbody class="main-header">
            <tr class="header-row">
              <td class="header-logo">
                <img src="https://i.ibb.co/gD76TBv/Frame-12.png" alt="Logo" />
                <span class="header-logo-text text-primary">
                  Coursefinity
                </span>
              </td>
              <td class="text-primary fw-600 header-slogan">
                Three . Two . Online
              </td>
            </tr>
            <tr class="reset-banner-row">
              <td class="w-100">
                <img
                  src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/7631/password_reset.png"
                  class="reset-password-banner"
                  alt="Reset Password Banner"
                />
              </td>
            </tr>
            <tr>
              <td class="text-center">
                Coursefinity.com has received a request to reset the password
                for your account. If you did not request to reset your password,
                please ignore this email.
              </td>
            </tr>
            <tr>
              <td style="text-align: center; padding-top: 16px;">
                <a href='http://localhost:3000/reset-password?reset_token=${accessToken}&role=${role}' target="_blank" class="reset-password-btn">Reset Password</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="footer">
        <div class="footer-info">
          <p>&copy; 2024 Coursefinity Pty Limited. All Rights Reserved.</p>
        </div>
      </div>
    </div>
  </body>
</html>`;
};

module.exports = { resetPasswordEmailTemplate };
