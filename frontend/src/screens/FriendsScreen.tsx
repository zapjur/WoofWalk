import {StackNavigationProp} from "@react-navigation/stack";
import RootStackParamList from "../../RootStackParamList";
import React, {useEffect, useState} from "react";
import {Text, View, StyleSheet, TouchableOpacity, ScrollView, Alert, Button, Modal, Image} from "react-native";
import AddFriend from "../components/AddFriend";
import BottomBar from "../components/BottomBar";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import {useAuth0} from "react-native-auth0";
import apiClient from "../../axiosConfig";
type MapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Map'>;
type UserScreenNavigationProp = StackNavigationProp<RootStackParamList, 'User'>
type FriendsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Friends'>
interface FriendsScreenProp {
    navigation: MapScreenNavigationProp & UserScreenNavigationProp & FriendsScreenNavigationProp;
}
interface receivedInvitation{
    id: number,
    senderEmail: string,
}
interface sentInvitation{
    id: number,
    receiverEmail: string,
}
interface friend{
    friendEmail: string
}
const FriendsScreen: React.FC<FriendsScreenProp> = ({navigation}) => {
    const [receivedFriendRequests, setReceivedFriendRequests] = useState<receivedInvitation[]>([]);
    const [sentFriendRequests, setSentFriendRequests] = useState<sentInvitation[]>([]);
    const [friendsEmails, setFriendsEmail] = useState<friend[]>([]);
    const [refresh, setRefresh] = useState(false);
    const {user} = useAuth0();
    const [selectedTab, setSelectedTab] = useState('Friends');
    const [profilePictures, setProfilePictures] = useState<[String, string][]>([]);
    const[refreshFriends, setRefreshFriends] = useState(0);
    const[refreshRequest, setRefreshRequest] = useState(0);
    const[refreshSent, setRefreshSent] = useState(0);
    useEffect(() => {
        if(user){
            const receiverEmail = user.email
            apiClient.get("/friends/receivedFriendRequests",{
                params: {
                    receiverEmail: receiverEmail,
                }
            }).then(response => {
                const receivedRequests: receivedInvitation[] = response.data.map((item: any) => ({
                    id: item.id,
                    senderEmail: item.senderEmail
                }));
                setReceivedFriendRequests(receivedRequests);
            }).catch(error => {
                console.error("Error while fetching data:", error);
            });
            const senderEmail = user.email;
            apiClient.get("/friends/sentFriendRequests", {
                params: {
                    senderEmail: senderEmail,
                }
            }).then(response => {
                const sentRequests: sentInvitation[] = response.data.map((item: any) => ({
                    id: item.id,
                    receiverEmail: item.receiverEmail
                }));
                setSentFriendRequests(sentRequests);
            }).catch(error => {
                console.error("Błąd podczas pobierania wysłanych zaproszeń:", error);
            });
            apiClient.get("/friends/getAllFriends",{
                params: {
                    email: user.email
                }
            }).then(response => {
                const userFriends: friend[] = response.data.map((item: any) => ({
                    friendEmail: item.email
                }));
                setFriendsEmail(userFriends);
            })

            setRefresh(false);

        }
    }, [refresh]);

    useEffect(() => {
        if (selectedTab === 'Friends') {
            getUserImage(friendsEmails.map(friend => friend.friendEmail));
        }
    }, [friendsEmails]);

    useEffect(() => {
        if (selectedTab === 'Requests') {
            getUserImage(receivedFriendRequests.map(invitation => invitation.senderEmail));
        }
    }, [receivedFriendRequests]);

    useEffect(() => {
        if (selectedTab === 'Sent') {
            getUserImage(sentFriendRequests.map(invitation => invitation.receiverEmail));
        }
    }, [sentFriendRequests]);

    const acceptFriendRequest = async (id: number) => {
        const response = await apiClient.post(`/friends/${id}/accept`);
        Alert.alert("Success", response.data);
    }
    const declineFriendRequest = async (id: number)=> {
        const response = await apiClient.post(`/friends/${id}/decline`);
        Alert.alert("Success", response.data);
    }
    const handleInvitationSent = () =>{
        setRefresh(true);
    }
    const getUserImage = async (Users: String[]) => {
        if (user) {
            Users.map(userEmail => {
                apiClient.get("/user/profilePicture/download", {
                    params: { email: userEmail },
                    responseType: 'blob'
                }).then(response => {

                    if(response.status === 204){
                        setProfilePictures(prevProfilePictures => [
                            ...prevProfilePictures,
                            [userEmail, "https://cdn-icons-png.flaticon.com/128/848/848043.png"]
                        ]);
                    } else{
                        const blob = response.data;
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            try {
                                if (reader.result) {
                                    setProfilePictures(prevProfilePictures => [
                                        ...prevProfilePictures,
                                        [userEmail, reader.result as string]
                                    ]);
                                }
                            } catch (error) {

                                console.error('Error setting profile picture:', error);
                            }
                        };
                        reader.readAsDataURL(blob);
                    }
                }).catch(error => {
                    console.error('Error downloading profile picture:', error);
                });
            });
        }
    }


    const findValue = (email : String) => {
        const found = profilePictures.find(entry => entry[0] === email);
        return found ? found[1] : 'https://cdn-icons-png.flaticon.com/128/848/848043.png'
    }

    return(
        <View style={styles.container}>
            <View style={styles.bar}>
                <View style={styles.topBar}>
                    <Text style={styles.topName}>{selectedTab}</Text>
                </View>
            </View>
            <View style={{ borderBottomColor: 'gray', borderBottomWidth: 1, marginVertical: 10 }} />
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => {
                    setSelectedTab('Friends')
                    setRefreshFriends(prevKey => prevKey + 1);
                }}>
                    <View style={styles.innerContainer}>
                        <Text style={styles.textNextTo}>Friends</Text>
                        <MaterialCommunityIcon name={"account-group"} size={33}></MaterialCommunityIcon>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() =>{
                    setSelectedTab('Requests');
                    setRefreshRequest(prevKey => prevKey + 1);
                    }}>
                    <View style={styles.innerContainer}>
                        <Text style={styles.textNextTo} >Requests</Text>
                        <MaterialCommunityIcon name={"human-greeting-variant"} size={33}></MaterialCommunityIcon>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => {
                    setSelectedTab('Sent')
                    setRefreshSent(prevKey => prevKey + 1);
                }}>
                    <View style={styles.innerContainer}>
                        <Text style={styles.textNextTo}>Sent</Text>
                        <MaterialCommunityIcon name={"email-fast"} size={33}></MaterialCommunityIcon>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{ borderBottomColor: 'gray', borderBottomWidth: 1, width: '80%', alignSelf: 'center', marginVertical: 10 }} />

            {selectedTab === 'Friends' &&
                <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'flex-start', alignItems: 'center'}}>
                    {friendsEmails.length === 0 ? (
                        <View style={styles.shadowPanel}>
                            <Text style={styles.sadText}>You don't have any friends yet :(</Text>
                        </View>
                    ) : (
                        friendsEmails.slice().reverse().map((friend, index) => (
                            console.log("1test"),
                            <View style={styles.shadowPanel} key={index}>
                                <View style={{ flexDirection: 'row', alignItems: 'center',height: 82 }}>
                                    <Image
                                        style={styles.imageStyle}
                                        source={{uri: findValue(friend.friendEmail)}}
                                    />
                                    <Text style={styles.textSend}>{friend.friendEmail}</Text>
                                </View>
                            </View>
                        ))
                    )}
                </ScrollView>
            }
            {selectedTab === 'Requests' &&
                <View>
                    <View>
                        <View >
                            {receivedFriendRequests.length === 0 ? (
                                <View style={styles.shadowPanel}>
                                    <Text style={styles.sadText}>You don't have any invitations</Text>
                                </View>
                            ) : (
                                receivedFriendRequests.slice().reverse().map((invitation, index) => (
                                    console.log("2test", refreshRequest),
                                    <View style={styles.shadowPanel} key={index}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Image
                                                style={styles.imageStyle}
                                                source={{uri: findValue(invitation.senderEmail)}}
                                            />
                                            <Text style={styles.textSend}>{invitation.senderEmail}</Text>
                                            <View style={styles.buttonPanel}>
                                                <TouchableOpacity style={styles.addButton} onPress={() => acceptFriendRequest(invitation.id)}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <MaterialCommunityIcon name={"account-multiple-check"} size={21}></MaterialCommunityIcon>
                                                        <Text style={styles.buttonText}>Accept</Text>
                                                    </View>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={styles.rejectButton}  onPress={() => declineFriendRequest(invitation.id)}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <MaterialCommunityIcon name={"account-multiple-remove"} size={21}></MaterialCommunityIcon>
                                                        <Text style={styles.buttonText}>Reject</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                ))
                            )}
                        </View>
                    </View>
                </View>
            }
            {selectedTab === 'Sent' &&
                <View style={{flex: 1}}>
                    {sentFriendRequests.length === 0 ? (
                        <View style={styles.shadowPanel}>
                            <Text style={styles.sadText} >You don't have any sent invitations</Text>
                        </View>
                    ) : (
                        sentFriendRequests.slice().reverse().map((invitation, index) => (
                            console.log("3test", refreshSent),
                            <View style={styles.shadowPanel} key={index}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', height: 82 }}>
                                    <Image
                                        style={styles.imageStyle}
                                        source={{uri: findValue(invitation.receiverEmail)}}
                                    />
                                    <Text style={styles.textSend}>{invitation.receiverEmail}</Text>
                                </View>
                            </View>
                        ))
                    )}
                </View>
            }

            <View style={styles.container}>
                {selectedTab === 'Friends' &&
                    <View style={styles.addFriendButton}>
                        <AddFriend onInvitationSent={handleInvitationSent}/>
                    </View>
                }
                <BottomBar navigation={navigation}/>
            </View>
        </View>



    );
}
const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        flex:1,
    },
    topBar: {
        marginTop: 15,
        backgroundColor: 'white',
        borderRadius: 10,
        width: "96%",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,

    },
    topName: {
        fontSize: 33,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    bar: {
        alignItems: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        width: "96%",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,

    },
    button: {
        flex:1,
        alignItems: 'center',
        backgroundColor: 'lightblue',
        margin: 5,
        borderRadius: 10,

    },
    buttonPanel: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',

    },
    innerContainer: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    textNextTo: {
        marginRight: 10,
        fontWeight: 'bold',
    },
    textInvitation: {
        fontSize: 19,
        textAlign: 'center',
        marginLeft: 10,
    },
    textSend: {
        fontSize: 19,
        marginLeft: 20,
    },
    addButton: {
        backgroundColor: 'green',
        borderRadius: 20,
        padding: 5,
        margin: 3,
        marginRight: 14,
    },
    rejectButton: {

        backgroundColor: 'red',
        borderRadius: 20,
        padding: 5,
        margin: 3,
        marginRight: 14,
        paddingLeft: 10,
    },
    friendsText: {
        alignSelf: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        borderRadius: 10,
        width: "80%",
        height: 40,
        textAlign: 'center',
    },
    addFriendButton: {
        marginTop: 10,
        flex:1,
        marginBottom: 93,
    },
    buttonText: {
        fontSize: 18,
    },
    shadowPanel: {
        backgroundColor: 'white',
        borderRadius: 10,
        width: "96%",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
        alignSelf: 'center',
        marginBottom: 10,
    },
    sadText: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        padding: 10,
    },
    imageStyle: {
        width: 50,
        height: 50,
        borderRadius: 50,
        marginLeft: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 10,
    }
})
export default FriendsScreen;