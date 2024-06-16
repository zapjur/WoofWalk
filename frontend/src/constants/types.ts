export interface Place {
    id: number;
    latitude: number;
    longitude: number;
    name: string;
    description: string;
    rating: number;
    ratingCount: number;
    category: string;
}

export interface NearestPlace extends Place {
    distance: number;
    imageUri: string;
}

export interface userLocation {
    latitude: number;
    longitude: number;

}

export interface LocationDetails {
    images: string[];
    ratings: {
        userEmail: string;
        rating: number;
        opinion: string;
    }[];

}

export const categories = [
    { key: 1, label: "Other", value: "OTHER" },
    { key: 2, label: "Park", value: "PARK" },
    { key: 3, label: "Beach", value: "BEACH" },
    { key: 4, label: "Lake", value: "LAKE" },
    { key: 5, label: "Forest", value: "FOREST" },
    { key: 6, label: "Mountain", value: "MOUNTAIN" },
    { key: 7, label: "Urban", value: "URBAN" },
    { key: 8, label: "River", value: "RIVER" },
    { key: 9, label: "Cafe", value: "CAFE" },
    { key: 10, label: "Restaurant", value: "RESTAURANT" },
    { key: 11, label: "Meadow", value: "MEADOW" },

];
