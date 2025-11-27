---
description: How to run the Pongdang project
---

# How to Run

1. **Install Dependencies** (if you haven't already)

   ```bash
   npm install
   ```

2. **Start the Development Server**

   ```bash
   npx expo start
   ```

3. **Run on Device/Simulator**
   - **Physical Device (Easiest)**: Download **Expo Go** app on your phone. Scan the QR code from the terminal. (Make sure phone and PC are on same Wi-Fi).
   - **Android Emulator/USB**: Requires **Android Studio** and `ANDROID_HOME` setup. Press `a` or run `npm run android`.
   - **iOS Simulator**: Requires Xcode (Mac only). Press `i`.
   - **Web**: Press `w`.

## Troubleshooting

- If you see "Network response timed out", make sure your phone and computer are on the same Wi-Fi.
- If you have issues with dependencies, try `npm install --legacy-peer-deps`.
