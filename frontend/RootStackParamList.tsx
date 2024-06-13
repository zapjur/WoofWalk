import { Place, userLocation } from "./src/types/types";

type RootStackParamList = {
    Login: undefined;
    Map: undefined;
    User: undefined;
    Friends: undefined;
    AddPlace: undefined;
    PlaceScreen: { place: Place; userLocation: userLocation | null };
    NearbyScreen: undefined;
};

export default RootStackParamList;
