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
export const icons = [
    { key: 1, label: "Other", value: "https://cdn-icons-png.flaticon.com/128/5978/5978100.png" },
    { key: 2, label: "Park", value: "https://cdn-icons-png.flaticon.com/128/3095/3095057.png" },
    { key: 3, label: "Beach", value: "https://cdn-icons-png.flaticon.com/128/4336/4336883.png" },
    { key: 4, label: "Lake", value: "https://cdn-icons-png.flaticon.com/128/2046/2046214.png" },
    { key: 5, label: "Forest", value: "https://cdn-icons-png.flaticon.com/128/3038/3038873.png" },
    { key: 6, label: "Mountain", value: "https://cdn-icons-png.flaticon.com/128/366/366998.png" },
    { key: 7, label: "Urban", value: "https://cdn-icons-png.flaticon.com/128/2942/2942149.png" },
    { key: 8, label: "River", value: "https://cdn-icons-png.flaticon.com/128/9997/9997725.png" },
    { key: 9, label: "Cafe", value: "https://cdn-icons-png.flaticon.com/128/9620/9620447.png" },
    { key: 10, label: "Restaurant", value: "https://cdn-icons-png.flaticon.com/128/948/948036.png" },
    { key: 11, label: "Meadow", value: "https://cdn-icons-png.flaticon.com/128/7591/7591243.png" },
]

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
