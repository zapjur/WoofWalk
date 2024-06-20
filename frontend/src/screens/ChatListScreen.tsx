import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
import { Button, TextInput, Text, Appbar, Card, Modal, Portal, Provider } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import RootStackParamList from '../../RootStackParamList';
import { PrivateChat } from "../constants/chatTypes";
import apiClient from "../../axiosConfig";
import BottomBar from "../components/BottomBar";

type ChatListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ChatList'>;

const ChatListScreen: React.FC = () => {
    const navigation = useNavigation<ChatListScreenNavigationProp>();
    const [email, setEmail] = useState<string>('');
    const [privateChats, setPrivateChats] = useState<PrivateChat[]>([]);
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    useEffect(() => {
        const fetchPrivateChats = async () => {
            try {
                const response = await apiClient.get('/chat/private');
                setPrivateChats(response.data);
                console.log('Private chats:', response.data);
            } catch (error) {
                console.error('Error fetching private chats:', error);
            }
        };

        fetchPrivateChats();
    }, []);

    const openChat = (recipient: string) => {
        navigation.navigate('ChatConversation', { recipient });
    };

    const handleAddChat = async () => {
        if (email) {
            try {
                const response = await apiClient.post('/chat/private/create', null, { params: { user2Email: email } });
                setPrivateChats([...privateChats, response.data]);
                setEmail('');
                setModalVisible(false);
                openChat(email);
            } catch (error) {
                console.error('Error adding new chat:', error);
            }
        }
    };

    return (
        <Provider>
            <View style={styles.container}>
                <FlatList
                    data={privateChats}
                    renderItem={({ item }) => (
                        <Card style={styles.contactCard} onPress={() => openChat(item.participant)}>
                            <Card.Content>
                                <Text>{item.participant}</Text>
                            </Card.Content>
                        </Card>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.contactList}
                />
                <Button mode="contained" onPress={() => setModalVisible(true)} style={styles.addButton}>
                    Add New Chat
                </Button>
                <Portal>
                    <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalContainer}>
                        <TextInput
                            label="Recipient Email"
                            value={email}
                            onChangeText={setEmail}
                            style={styles.input}
                        />
                        <Button mode="contained" onPress={handleAddChat} style={styles.button}>
                            Start Chat
                        </Button>
                    </Modal>
                </Portal>
                <BottomBar navigation={navigation} />
            </View>
        </Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        marginTop: '20%',
    },
    addButton: {
        position: 'absolute',
        bottom: 90,
        width: '80%',
        right: '10%',
        zIndex: 20,
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
    modalContainer: {
        padding: 20,
        backgroundColor: 'white',
        marginHorizontal: 20,
        borderRadius: 10,
    },
});

export default ChatListScreen;
