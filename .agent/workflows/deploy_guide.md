---
description: Guide to hosting the web version for free and publishing mobile updates
---

# Option 1: Host the Web Version for Free (Recommended)

The easiest way to share your app is to host the **Web Version** on Vercel.

1.  **Install Vercel CLI** (One time setup):
    ```powershell
    npm install -g vercel
    ```

2.  **Deploy**:
    Run this command in your project folder:
    ```powershell
    vercel
    ```
    - Follow the prompts (Select 'Yes' to defaults).
    - Login with GitHub or Email if asked.
    - It will give you a **Production URL** (e.g., `https://sheriyakam.vercel.app`) that you can share with anyone.

# Option 2: Publish for Mobile (Expo Go)

To let anyone run the app on their phone using the **Expo Go** app:

1.  **Create an EAS Account**: Sign up at [expo.dev](https://expo.dev).
2.  **Login in Terminal**:
    ```powershell
    npx eas-cli login
    ```
3.  **Configure Project**:
    ```powershell
    npx eas-cli build:configure
    ```
4.  **Create a Preview Update**:
    ```powershell
    npx eas-cli update --branch preview --message "Initial release"
    ```
    - This allows users with the Expo Go app to scan your QR code and run the app without you needing to send them an APK.
