# Azure AD B2C Custom UI Configuration and Testing

This document outlines the steps to configure a User Flow in Azure Active Directory B2C to use a custom HTML/CSS template and how to manually verify the integration.

## Prerequisites

- Access to the **Azure AD B2C** tenant.
- An existing User Flow (specifically `B2C_1_login_beacons`).
- A publicly accessible URL (URI) for your `login.html` file (e.g., hosted on S3 with CORS enabled).

---

## Configuration Steps

Follow these steps to link your custom HTML to the sign-up/sign-in experience.

1.  **Navigate to B2C Service:**
    - Log in to the Azure Portal.
    - Search for and select **Azure AD B2C**.

2.  **Select User Flow:**
    - In the left-hand menu, select **User flows**.
    - Click on the **B2C_1_login_beacons** user flow.

3.  **Enable Custom Page Content:**
    - In the left sidebar of the User Flow, select **Page layouts**.
    - Locate the section labeled **Unified sign-up or sign-in page**.
    - For the setting **Use custom page content**, select **Yes**.

4.  **Link the URI:**
    - In the **Custom page URI** field, enter the full URL for your `login.html` file.
    - _Note: Ensure the URI is accessible via HTTPS._

5.  **Apply Changes:**
    - Select **Save** at the top of the page.

---

## Testing the Interface

Perform a manual test to ensure the CSS and HTML are rendering correctly.

1.  **Open the Run Context:**
    - Navigate back to **User flows** (or stay on the current blade).
    - Select the **B2C_1_login_beacons** user flow.
    - Click **Run user flow** at the top of the page.

2.  **Execute the Test:**
    - A pane will appear on the right side of the screen.
    - Select the **Run user flow** button.

3.  **Verify Results:**
    - A new browser tab or window will open.
    - **Success Criteria:** You should see the sign-in page with elements centered (or styled) based on the CSS file linked in your HTML template.

---

## Troubleshooting

If the page loads the default Azure B2C look rather than your custom look:

- **Check CORS:** Ensure Cross-Origin Resource Sharing is enabled on the storage account hosting your HTML. Azure B2C requires permission to pull the content.
- **Check HTTPS:** Azure B2C only accepts custom URIs that use HTTPS.
- **Browser Cache:** If you made changes to the CSS file, run the user flow in an **Incognito/Private** window to ensure you aren't viewing a cached version.
- More information available [here](https://learn.microsoft.com/en-us/azure/active-directory-b2c/customize-ui-with-html?pivots=b2c-user-flow)
