import { Place, userLocation } from "./src/constants/types";

type RootStackParamList = {
    Login: undefined;
    Map: undefined;
    User: undefined;
    Friends: undefined;
    AddPlace: undefined;
    Chat: undefined;
    DM: {email: string };
    PlaceScreen: {
        place: Place;
        userLocation: userLocation | null
    };
    NearbyScreen: undefined;
    EventScreen: {
        place: Place;
        userLocation: userLocation | null
    }

};

export default RootStackParamList;
