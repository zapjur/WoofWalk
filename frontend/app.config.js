import 'dotenv/config';

export default ({ config }) => {
    return {
        ...config,
        ios: {
            ...config.ios,
            config: {
                googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
            },
            infoPlist: {
                NSLocationWhenInUseUsageDescription: "This app uses your location to show your position on the map."
            }
        },
        android: {
            ...config.android,
            config: {
                googleMaps: {
                    apiKey: process.env.GOOGLE_MAPS_API_KEY
                }
            }
        },
        extra: {
            googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
        }
    };
};
