import 'dotenv/config';

export default ({ config }) => {
    return {
        ...config,
        ios: {
            ...config.ios,
            config: {
                googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
                bundleIdentifier: "com.anonymous.frontend",
            },
            infoPlist: {
                NSLocationWhenInUseUsageDescription: "This app uses your location to show your position on the map."
            }
        },
        android: {
            ...config.android,
            config: {
                googleMaps: {
                    apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
                }
            }
        },
        extra: {
            googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
            eas: {
                projectId: "033aae3e-d033-461f-918c-ba45385d4e3a"
            }
        },

    }
};
