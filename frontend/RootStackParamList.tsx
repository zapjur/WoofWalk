import { Place, userLocation } from "./src/constants/types";

type RootStackParamList = {
    Login: undefined;
    Map: undefined;
    User: undefined;
    Friends: undefined;
    AddPlace: undefined;
    ChatList: undefined;
    DM: {email: string };
    PlaceScreen: {
        place: Place;
        userLocation: userLocation | null
    };
    NearbyScreen: undefined;
    EventScreen: {
        place: Place;
        userLocation: userLocation | null
    };
    ChatConversation: { recipient: string, chatId: string};
};

export default RootStackParamList;
