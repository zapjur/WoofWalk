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
                projectId: "bbfed984-781e-4a20-8565-4ff4b6ee249e"
            }
        },

    }
};
