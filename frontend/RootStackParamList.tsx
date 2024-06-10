import { Place } from "./src/types/types";

type RootStackParamList = {
    Login: undefined;
    Map: undefined;
    User: undefined;
    Friends: undefined;
    AddPlace: undefined;
    PlaceScreen: { place: Place };
};

export default RootStackParamList;
