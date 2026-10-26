# StudyFlow (React Native + Expo, Android first)

STATUS: source written but NOT yet installed, type-checked or built. Run the steps below and fix any errors.

## Setup
    npm install
    npx expo install --fix        # aligns all package versions with the installed Expo SDK
    npx tsc --noEmit              # TypeScript check
    npx expo-doctor               # diagnostics
    npx expo start --android      # run on emulator/device

## Android APK (preview) and AAB (Google Play)
    npm i -g eas-cli && eas login && eas build:configure
    eas build -p android --profile preview      # installable APK
    eas build -p android --profile production   # AAB for Play Store
Change `android.package` in app.json (currently com.example.studyflow) before release.

## iOS later
Set `ios.bundleIdentifier`, then `eas build -p ios --profile preview` (needs Apple Developer account). Not tested.

## Known limitations
- Dates/times are typed as YYYY-MM-DD and HH:MM (no native picker yet).
- Charts are simple animated bars (no chart library).
- zh/ja translations are partial; missing keys fall back to English.
- Mascots are cropped from the supplied sheet; replace src/assets/mascot/*.png with originals when available.
- Day view shows the selected date from the month grid; no separate week view.
