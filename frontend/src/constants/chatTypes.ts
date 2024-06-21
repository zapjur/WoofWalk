export interface PrivateChat {
    id: number;
    participant: string;
}

export interface GroupChat {
    id: number;
    name: string;
    members: string[];
}