import 'dotenv/config';

export default ({ config }) => {
    return {
        ...config,
        ios: {
            ...config.ios,
            config: {
                googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
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
                projectId: "134f1c30-c6b1-47ff-a0db-e4cb41ef9255"
            }
        }
    };
};
