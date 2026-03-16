# Google Play Store Submission Guide for SoloLvlUp

This guide will walk you through the entire process of publishing your SoloLvlUp RPG app on the Google Play Store, from building the signed release bundle to filling out the required policy declarations.

---

## 🚀 Part 1: Generating the Signed App Bundle (.aab)

Before submitting to Google Play, you need a signed `.aab` (Android App Bundle). The app bundle contains all your compiled code and resources.

### 1. Build the Next.js Export
Run these commands in your project root:
```bash
npm install
npm run build
npx cap sync android
```

### 2. Generate a Keystore (One time only)
Open a terminal in the `android/app` folder and run the `keytool` command to generate your signing key. 
```bash
cd android/app
keytool -genkey -v -keystore sololvlup-release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias sololvlup-key
```
*Make sure to remember the password you set! Keep this `.jks` file extremely safe.*

### 3. Configure Gradle for Signing
Create a file named `keystore.properties` inside `android/app` and add:
```properties
storePassword=YOUR_PASSWORD
keyPassword=YOUR_PASSWORD
keyAlias=sololvlup-key
storeFile=sololvlup-release.jks
```

### 4. Build the Release Bundle
Run the following from the root of your `android/` directory:
```bash
cd android
./gradlew bundleRelease
```
**Done!** Your Play Store ready file is located at:
`android/app/build/outputs/bundle/release/app-release.aab`

---

## 📝 Part 2: Google Play Console Policies & Declarations

Go to [play.google.com/console](https://play.google.com/console) and create your app. Under the **Policy and programs > App content** page, you must fill out the following declarations:

### 1. Privacy Policy
1. Go to **Privacy Policy** section.
2. Enter the URL of your app's privacy policy.
   * If you are hosting this Next.js app on Vercel or similar, the URL will be: `https://your-domain.com/privacy`
3. Click **Save**.

### 2. Ads Declaration
* **Does your app contain ads?** Select **No** (unless you plan to add AdMob later).

### 3. App Access
* **Are all parts of your app accessible?** Select **All parts are available without special access**. (Since users create their own local RPG profiles).

### 4. Content Ratings
1. Fill out the questionnaire.
2. **Category:** Select **Utility, Productivity, Communication, or Other** (or **Game > Role Playing** if you prefer to market it strictly as a game).
3. **Violence/Blood/Etc:** Answer **No** to all restricted content questions.

### 5. Target Audience and Content
* **Target Age Group:** Select **13-15, 16-17, and 18 and over**.
* **Appeal to children:** Select **No, this app is not primarily directed to children under 13.** (This reduces strict COPPA requirements).

### 6. Data Safety Form
Because SoloLvlUp uses local storage and `@capacitor/local-notifications`, your data safety form is very straightforward:
1. **Data Collection:** Does your app collect or share any of the required user data types? **No**. (All RPG data, stats, and journals are saved locally on the device using Capacitor/Zustand persist).
2. **Security:** Is data encrypted in transit? **Yes** (Assuming you use HTTPS APIs like Gemini).
3. **Account Deletion:** Do you provide a way for users to request data deletion? **Yes**. Add a link to the privacy policy data deletion section, or state that data is deleted unconditionally upon app uninstall.

### 7. Notifications Permission
* If asked why your app uses notifications (due to our use of `@capacitor/local-notifications`), explain that it is for **Local Daily Reminders** and **Level Up Alerts**. It is strictly for user productivity and engagement, without relying on remote push notifications.

---

## 🎨 Part 3: Store Listing Assets
To successfully publish, you will need:
- **App Icon:** 512 x 512 pixels (PNG or JPEG).
- **Feature Graphic:** 1024 x 500 pixels (PNG or JPEG).
- **Phone Screenshots:** At least 2 screenshots showing the RPG dashboard, quests page, and stats page (aspect ratio between 16:9 and 2:1).
- **Short Description:** Catchy 80-character tagline. (e.g., *Gamify your life, conquer real-world quests, and level up your stats!*)
- **Full Description:** Describe the app features (AI Quest generation, RPG stats, moods tracking) up to 4000 characters.

---

## 🚀 Part 4: Upload and Release
1. In the console menu, go to **Testing > Closed testing** or **Production**.
2. Click **Create new release**.
3. Upload the `app-release.aab` file you created in Part 1.
4. Enter your Release Notes (e.g., "Initial Release of SoloLvlUp!").
5. Click **Next**, review the submission, and click **Roll Out to Production**.

Congratulations! Google normally takes 1 to 7 days to review new applications. Watch your email for any policy violation notices or your approval!
