const fs = require('fs');

const config = require('./app.json');

const androidGoogleServicesFile = './google-services.json';
const iosGoogleServicesFile = './GoogleService-Info.plist';
const hasAndroidFirebaseConfig = fs.existsSync(androidGoogleServicesFile);
const hasIosFirebaseConfig = fs.existsSync(iosGoogleServicesFile);

function readAndroidPackage() {
  if (!hasAndroidFirebaseConfig) return undefined;

  try {
    const googleServices = JSON.parse(fs.readFileSync(androidGoogleServicesFile, 'utf8'));
    return googleServices.client?.[0]?.client_info?.android_client_info?.package_name;
  } catch {
    return undefined;
  }
}

function readIosBundleId() {
  if (!hasIosFirebaseConfig) return undefined;

  try {
    const plist = fs.readFileSync(iosGoogleServicesFile, 'utf8');
    return plist.match(/<key>BUNDLE_ID<\/key>\s*<string>([^<]+)<\/string>/)?.[1];
  } catch {
    return undefined;
  }
}

module.exports = ({ config: expoConfig }) => {
  const baseConfig = {
    ...expoConfig,
    ...config.expo,
  };
  const androidPackage = process.env.EXPO_PUBLIC_ANDROID_PACKAGE ?? readAndroidPackage();
  const iosBundleIdentifier = process.env.EXPO_PUBLIC_IOS_BUNDLE_ID ?? readIosBundleId();
  const plugins = [
    ...(baseConfig.plugins ?? []),
    [
      'expo-build-properties',
      {
        ios: {
          useFrameworks: 'static',
        },
      },
    ],
    ...(hasAndroidFirebaseConfig || hasIosFirebaseConfig ? ['@react-native-firebase/app'] : []),
  ];

  return {
    ...baseConfig,
    scheme: 'fitup',
    plugins,
    ios: {
      ...baseConfig.ios,
      ...(iosBundleIdentifier ? { bundleIdentifier: iosBundleIdentifier } : {}),
      ...(hasIosFirebaseConfig ? { googleServicesFile: iosGoogleServicesFile } : {}),
    },
    android: {
      ...baseConfig.android,
      ...(androidPackage ? { package: androidPackage } : {}),
      ...(hasAndroidFirebaseConfig ? { googleServicesFile: androidGoogleServicesFile } : {}),
    },
  };
};
