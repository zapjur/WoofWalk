import {
    Button,
    FlatList,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import BottomBar from "../components/BottomBar";
import React, {useEffect, useState} from "react";
import {StackNavigationProp} from "@react-navigation/stack";
import RootStackParamList from "../../RootStackParamList";
import DirectMessageModal from "../components/DirectMessageModal";
import * as SecureStore from "expo-secure-store";

type MapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Map'>;
type UserScreenNavigationProp = StackNavigationProp<RootStackParamList, 'User'>
type FriendsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Friends'>
type ChatScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Chat'>
interface ChatScreenProps {
    navigation: MapScreenNavigationProp & UserScreenNavigationProp & FriendsScreenNavigationProp & ChatScreenNavigationProp;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ navigation }) =>{
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [message, setMessage] = useState<string>('');
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        const connectWebSocket = async () => {
            const token = await SecureStore.getItemAsync('authToken');
            if (!token) {
                console.error('No token found');
                return;
            }

            const websocket = new WebSocket(`ws://localhost:8080/ws?token=${token}`);

            websocket.onopen = () => {
                console.log('WebSocket connected');
            };
            websocket.onmessage = (event) => {
                setMessages(prevMessages => [...prevMessages, event.data]);
            };
            websocket.onerror = (error) => {
                console.error('WebSocket error', error);
            };
            websocket.onclose = () => {
                console.log('WebSocket closed');
            };
            setWs(websocket);

            return () => {
                websocket.close();
            };
        };

        connectWebSocket();
    }, []);

    const sendMessage = () => {
        if (ws) {
            ws.send(message);
            setMessage('');
        }
    };

    return (
        <View>
            <Text>WebSocket Chat</Text>
            <FlatList
                data={messages}
                renderItem={({ item }) => <Text>{item}</Text>}
                keyExtractor={(item, index) => index.toString()}
            />
            <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="Type a message"
            />
            <Button title="Send" onPress={sendMessage} />
        </View>
    );
};
export default ChatScreen;