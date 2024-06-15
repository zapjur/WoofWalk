import React, {useEffect, useState} from 'react';
import {Button,  ScrollView,  Text, TextInput, View} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import RootStackParamList  from '../../RootStackParamList';

import {Client, Frame, IMessage, Stomp} from "@stomp/stompjs";
import * as SecureStore from "expo-secure-store";


type DirectMessageScreenRouteProp = RouteProp<RootStackParamList, 'DM'>;

interface Message {
    timestamp: string;
    user: string;
    message: string;
}

const DirectMessageScreen: React.FC = () => {
    const route = useRoute<DirectMessageScreenRouteProp>();
    const [client, setClient] = useState<Client | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [user, setUser] = useState<string>('');
    const [messageToSend, setMessageToSend] = useState<string>('');

    useEffect(() => {
        onConnect();
    }, []);
    const onConnect = async () => {
        console.log("chuj");
        const token = await SecureStore.getItemAsync('authToken');
        const headers = {
            Authorization: `Bearer ${token}`,
        };
        console.log("Token: " + token);
        const newClient = Stomp.client('ws://10.0.2.2:8080/chat');
        newClient.connect(headers, (frame: Frame) => {
            console.log('Connected to STOMP');
            newClient.subscribe('/topic/messages', (message: IMessage) => {
                const body = JSON.parse(message.body || '{}');
                showMessage(body.message, body.user);
            });
        }, onError);
        setClient(newClient);
    };
    const onError = (error: any) => {
        console.log('Error connecting to STOMP:', error);
    };
    const showMessage = (value: string, user: string) => {
        const today = new Date();
        const date = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
        const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
        const dateTime = `${date} ${time}`;

        setMessages(prevMessages => [
            ...prevMessages,
            {
                timestamp: dateTime,
                user: user,
                message: value
            }
        ]);
    };
    const sendMessage = () => {
        if (!client) return;
        console.log(client);
        console.log(messageToSend);
        client.publish({ destination: '/app/chat', body: JSON.stringify({ message: messageToSend, user: user }) });
        setMessageToSend('');
    };
    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 10 }}>
            <Text style={{ fontSize: 20, marginBottom: 20 }}>React Native Chat</Text>

            <ScrollView style={{ flex: 1, marginBottom: 20 }}>
                {messages.map((msg, index) => (
                    <View key={index} style={{ flexDirection: 'row', marginBottom: 10 }}>
                        <Text style={{ fontWeight: 'bold', marginRight: 5 }}>{`[${msg.timestamp}]`}</Text>
                        <Text style={{ fontWeight: 'bold', color: 'blue', marginRight: 5 }}>{msg.user}</Text>
                        <Text>{`: ${msg.message}`}</Text>
                    </View>
                ))}
            </ScrollView>

            <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 5 }}
                onChangeText={text => setUser(text)}
                value={user}
                placeholder="User"
            />

            <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 5 }}
                onChangeText={text => setMessageToSend(text)}
                value={messageToSend}
                placeholder="Message"
            />

            <Button onPress={sendMessage} title="Send" />
        </View>
    );
};

export default DirectMessageScreen;
