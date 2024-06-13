export interface Place {
    id: number;
    latitude: number;
    longitude: number;
    name: string;
    description: string;
    rating: number;
    ratingCount: number;
}

export interface NearestPlace extends Place {
    distance: number;
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