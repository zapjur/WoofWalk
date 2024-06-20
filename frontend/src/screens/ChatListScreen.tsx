import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, TextInput, Text, Appbar, Card, Modal, Portal, Provider } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import RootStackParamList from '../../RootStackParamList';
import { GroupChat, PrivateChat } from "../constants/chatTypes";
import apiClient from "../../axiosConfig";
import BottomBar from "../components/BottomBar";

type ChatListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ChatList'>;

const ChatListScreen: React.FC = () => {
    const navigation = useNavigation<ChatListScreenNavigationProp>();
    const [email, setEmail] = useState<string>('');
    const [groupEmails, setGroupEmails] = useState<string>('');
    const [privateChats, setPrivateChats] = useState<PrivateChat[]>([]);
    const [groupChats, setGroupChats] = useState<GroupChat[]>([]);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [showPrivateChats, setShowPrivateChats] = useState<boolean>(true);

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

        const fetchGroupChats = async () => {
            try {
                const response = await apiClient.get('/chat/group');
                setGroupChats(response.data);
                console.log('Group chats:', response.data);
            } catch (error) {
                console.error('Error fetching group chats:', error);
            }
        };

        fetchGroupChats();
    }, []);

    const openChat = (chatId: string, recipient: string) => {
        navigation.navigate('ChatConversation', { chatId, recipient });
    };

    const handleAddPrivateChat = async () => {
        if (email) {
            try {
                const response = await apiClient.post('/chat/private/create', null, { params: { user2Email: email } });
                setPrivateChats([...privateChats, response.data]);
                setEmail('');
                setModalVisible(false);
                openChat(response.data.id, email);
            } catch (error) {
                console.error('Error adding new chat:', error);
            }
        }
    };

    const handleAddGroupChat = async () => {
        if (groupEmails) {
            const emails = groupEmails.split(',').map(email => email.trim());
            try {
                const response = await apiClient.post('/chat/group/create', { emails });
                setGroupChats([...groupChats, response.data]);
                setGroupEmails('');
                setModalVisible(false);
                //openChat(response.data.id, response.data.name);
            } catch (error) {
                console.error('Error adding new group chat:', error);
            }
        }
    };

    const renderChatItem = ({ item }: { item: PrivateChat | GroupChat }) => {
        const name = showPrivateChats ? (item as PrivateChat).participant : (item as GroupChat).name;
        const chatId = showPrivateChats ? (item as PrivateChat).id.toString() : (item as GroupChat).id.toString();
        const recipient = showPrivateChats ? (item as PrivateChat).participant : (item as GroupChat).name;
        return (
            <Card style={styles.contactCard} onPress={() => openChat(chatId, recipient)}>
                <Card.Content>
                    <Text>{name}</Text>
                </Card.Content>
            </Card>
        );
    };

    return (
        <Provider>
            <View style={styles.container}>
                <View style={styles.buttonContainer}>
                    <Button
                        mode={showPrivateChats ? 'contained' : 'outlined'}
                        onPress={() => setShowPrivateChats(true)}
                        style={styles.switchButton}
                    >
                        Private Chats
                    </Button>
                    <Button
                        mode={!showPrivateChats ? 'contained' : 'outlined'}
                        onPress={() => setShowPrivateChats(false)}
                        style={styles.switchButton}
                    >
                        Group Chats
                    </Button>
                </View>
                <FlatList
                    data={showPrivateChats ? privateChats : groupChats}
                    renderItem={renderChatItem}
                    keyExtractor={(item) => (showPrivateChats ? (item as PrivateChat).id.toString() : (item as GroupChat).id.toString())}
                    contentContainerStyle={styles.contactList}
                />
                <Button mode="contained" onPress={() => setModalVisible(true)} style={styles.addButton}>
                    Add New Chat
                </Button>
                <Portal>
                    <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalContainer}>
                        {showPrivateChats ? (
                            <>
                                <TextInput
                                    label="Recipient Email"
                                    value={email}
                                    onChangeText={setEmail}
                                    style={styles.input}
                                />
                                <Button mode="contained" onPress={handleAddPrivateChat} style={styles.button}>
                                    Start Private Chat
                                </Button>
                            </>
                        ) : (
                            <>
                                <TextInput
                                    label="Group Members Emails (comma separated)"
                                    value={groupEmails}
                                    onChangeText={setGroupEmails}
                                    style={styles.input}
                                />
                                <Button mode="contained" onPress={handleAddGroupChat} style={styles.button}>
                                    Start Group Chat
                                </Button>
                            </>
                        )}
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10,
    },
    switchButton: {
        flex: 1,
        marginHorizontal: 5,
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
