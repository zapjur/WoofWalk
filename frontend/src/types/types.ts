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