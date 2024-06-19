import React, { useEffect, useState } from 'react';
import {FlatList, Platform, StyleSheet, View} from 'react-native';
import { Button, TextInput, Text, Appbar, Card } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import RootStackParamList from '../../RootStackParamList';

type ChatListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ChatList'>;

const ChatListScreen: React.FC = () => {
    const navigation = useNavigation<ChatListScreenNavigationProp>();
    const [contacts, setContacts] = useState<string[]>([]);
    const [email, setEmail] = useState<string>('');
    const [socket, setSocket] = useState<any>(null);

    useEffect(() => {

    }, []);

    const openChat = (recipient: string) => {
        navigation.navigate('ChatConversation', { recipient });
    };

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.Content title="Chat List" />
            </Appbar.Header>
            <View style={styles.inputContainer}>
                <TextInput
                    label="Recipient Email"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                />
                <Button mode="contained" onPress={() => openChat(email)} style={styles.button}>
                    Open Chat
                </Button>
            </View>
            <FlatList
                data={contacts}
                renderItem={({ item }) => (
                    <Card style={styles.contactCard} onPress={() => openChat(item)}>
                        <Card.Content>
                            <Text>{item}</Text>
                        </Card.Content>
                    </Card>
                )}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.contactList}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    inputContainer: {
        padding: 10,
        backgroundColor: '#fff',
        marginBottom: 10,
        borderRadius: 5,
    },
    input: {
        marginBottom: 10,
    },
    button: {
        marginVertical: 5,
    },
    contactList: {
        padding: 10,
    },
    contactCard: {
        marginBottom: 10,
    },
});

export default ChatListScreen;
