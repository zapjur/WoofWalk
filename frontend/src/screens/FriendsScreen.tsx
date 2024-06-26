import {StackNavigationProp} from "@react-navigation/stack";
import RootStackParamList from "../../RootStackParamList";
import React, {useEffect, useState} from "react";
import {Text, View, StyleSheet, TouchableOpacity, ScrollView, Alert, Image} from "react-native";
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
    imageUri: string,
}
interface sentInvitation{
    id: number,
    receiverEmail: string,
    imageUri: string,
}
interface friend{
    friendEmail: string,
    imageUri: string
}
const FriendsScreen: React.FC<FriendsScreenProp> = ({navigation}) => {
    const [receivedFriendRequests, setReceivedFriendRequests] = useState<receivedInvitation[]>([]);
    const [sentFriendRequests, setSentFriendRequests] = useState<sentInvitation[]>([]);
    const [friendsEmails, setFriendsEmail] = useState<friend[]>([]);
    const [refresh, setRefresh] = useState(false);
    const {user} = useAuth0();
    const [selectedTab, setSelectedTab] = useState('Friends');

    useEffect(() => {
        if(user){
            if(selectedTab === 'Friends'){
                apiClient.get("/friends/getAllFriends",{
                    params: {
                        email: user.email
                    }
                }).then(response => {
                    const userFriends: friend[] = response.data.map((item: any) => ({
                        friendEmail: item.email,
                        imageUri: item.imageUri
                    }));
                    setFriendsEmail(userFriends);
                })
            }
            if(selectedTab === 'Requests'){
                const receiverEmail = user.email
                apiClient.get("/friends/receivedFriendRequests",{
                    params: {
                        receiverEmail: receiverEmail,
                    }
                }).then(response => {
                    const receivedRequests: receivedInvitation[] = response.data.map((item: any) => ({
                        id: item.id,
                        senderEmail: item.senderEmail,
                        imageUri: item.imageUri,
                    }));
                    setReceivedFriendRequests(receivedRequests);
                }).catch(error => {
                    console.error("Error while fetching data:", error);
                });
            }
            if(selectedTab === 'Sent'){
                const senderEmail = user.email;
                apiClient.get("/friends/sentFriendRequests", {
                    params: {
                        senderEmail: senderEmail,
                    }
                }).then(response => {
                    const sentRequests: sentInvitation[] = response.data.map((item: any) => ({
                        id: item.id,
                        receiverEmail: item.receiverEmail,
                        imageUri: item.imageUri,
                    }));
                    setSentFriendRequests(sentRequests);
                }).catch(error => {
                    console.error("Error while fetching invitations:", error);
                });
            }

        }
    }, [refresh, selectedTab]);



    const acceptFriendRequest = async (id: number) => {
        const response = await apiClient.post(`/friends/${id}/accept`);
        setRefresh(!refresh);
        Alert.alert("Success", response.data);
    }
    const declineFriendRequest = async (id: number)=> {
        const response = await apiClient.post(`/friends/${id}/decline`);
        setRefresh(!refresh);
        Alert.alert("Success", response.data);
    }
    const handleInvitationSent = () =>{
        setRefresh(!refresh);
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

                }}>
                    <View style={styles.innerContainer}>
                        <Text style={styles.textNextTo}>Friends</Text>
                        <MaterialCommunityIcon name={"account-group"} size={33} color={"white"}></MaterialCommunityIcon>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() =>{
                    setSelectedTab('Requests');

                    }}>
                    <View style={styles.innerContainer}>
                        <Text style={styles.textNextTo} >Requests</Text>
                        <MaterialCommunityIcon name={"human-greeting-variant"} size={33} color={"white"}></MaterialCommunityIcon>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => {
                    setSelectedTab('Sent')

                }}>
                    <View style={styles.innerContainer}>
                        <Text style={styles.textNextTo}>Sent</Text>
                        <MaterialCommunityIcon name={"email-fast"} size={33} color={"white"}></MaterialCommunityIcon>
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
                        friendsEmails
                            .sort((a, b) => a.friendEmail.localeCompare(b.friendEmail))
                            .map((friend, index) => (
                                <View style={styles.shadowPanel} key={index}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', height: 82 }}>
                                        {friend.imageUri !== null ? (
                                            <Image
                                                style={styles.imageStyle}
                                                source={{ uri: friend.imageUri }}
                                            />
                                        ) : (
                                            <Image
                                                style={styles.imageStyle}
                                                source={{ uri: "https://cdn-icons-png.flaticon.com/128/848/848043.png" }}
                                            />
                                        )}
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
                                receivedFriendRequests
                                    .sort((a, b) => a.senderEmail.localeCompare(b.senderEmail))
                                    .map((invitation, index) => (
                                        <View style={styles.shadowPanel} key={index}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                {invitation.imageUri !== null ? (
                                                    <Image
                                                        style={styles.imageStyle}
                                                        source={{ uri: invitation.imageUri }}
                                                    />
                                                ) : (
                                                    <Image
                                                        style={styles.imageStyle}
                                                        source={{ uri: "https://cdn-icons-png.flaticon.com/128/848/848043.png" }}
                                                    />
                                                )}
                                                <Text style={styles.textSend}>{invitation.senderEmail}</Text>
                                                <View style={styles.buttonPanel}>
                                                    <TouchableOpacity style={styles.addButton} onPress={() => acceptFriendRequest(invitation.id)}>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                            <MaterialCommunityIcon name={"account-multiple-check"} size={21}></MaterialCommunityIcon>
                                                            <Text style={styles.buttonText}>Accept</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={styles.rejectButton} onPress={() => declineFriendRequest(invitation.id)}>
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
                        sentFriendRequests.map((invitation, index) => (
                            <View style={styles.shadowPanel} key={index}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', height: 82 }}>
                                    {invitation.imageUri !== null ?  (
                                        <Image
                                            style={styles.imageStyle}
                                            source={{uri: invitation.imageUri}}
                                        />
                                    ): (
                                        <Image
                                            style={styles.imageStyle}
                                            source={{uri: "https://cdn-icons-png.flaticon.com/128/848/848043.png"}}
                                        />
                                    )}
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
        marginTop: '10%',
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
        backgroundColor: '#74b291',
        margin: 5,
        borderRadius: 20,

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
        color: "white",
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