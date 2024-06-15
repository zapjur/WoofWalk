import {StackNavigationProp} from "@react-navigation/stack";
import RootStackParamList from "../../RootStackParamList";
import React, {useEffect, useState} from "react";
import {Text, View, StyleSheet, TouchableOpacity, ScrollView, Alert, Button, Modal} from "react-native";
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
    return(
        <View style={styles.container}>
            <View style={styles.bar}>
                <View style={styles.topBar}>
                    <Text style={styles.topName}>{selectedTab}</Text>
                </View>
            </View>
            <View style={{ borderBottomColor: 'fff', borderBottomWidth: 1, marginVertical: 10 }} />
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => setSelectedTab('Friends')}>
                    <View style={styles.innerContainer}>
                        <Text style={styles.textNextTo}>Friends</Text>
                        <MaterialCommunityIcon name={"account-group"} size={33}></MaterialCommunityIcon>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => setSelectedTab('Requests')}>
                    <View style={styles.innerContainer}>
                        <Text style={styles.textNextTo} >Requests</Text>
                        <MaterialCommunityIcon name={"human-greeting-variant"} size={33}></MaterialCommunityIcon>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => setSelectedTab('Sent')}>
                    <View style={styles.innerContainer}>
                        <Text style={styles.textNextTo}>Sent</Text>
                        <MaterialCommunityIcon name={"email-fast"} size={33}></MaterialCommunityIcon>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{ borderBottomColor: 'fff', borderBottomWidth: 1, width: '80%', alignSelf: 'center', marginVertical: 10 }} />
            {selectedTab === 'Friends' &&
                <View >
                    <ScrollView>
                        {friendsEmails.length === 0 ? (
                            <View >
                                <Text >You don't have any friends yet :(</Text>
                            </View>
                        ) : (
                            friendsEmails.slice().reverse().map((friend, index) => (
                                <View key={index}>
                                    <Text>fotka </Text>
                                    <View style={styles.friendsText}>
                                        <Text >{index+1 + ". " + friend.friendEmail}</Text>

                                    </View>
                                    <View style={{ borderBottomColor: 'white', borderBottomWidth: 1, width: '80%', alignSelf: 'center', marginVertical: 10 }} />
                                </View>
                            ))
                        )}
                    </ScrollView>


                </View>


            }
            {selectedTab === 'Requests' &&
                <View>
                    <View>
                        <View>
                            {receivedFriendRequests.length === 0 ? (
                                <Text>You don't have any invitations</Text>
                            ) : (
                                receivedFriendRequests.slice().reverse().map((invitation, index) => (
                                    <>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} key={index}>
                                            <Text style={styles.textInvitation}>{invitation.senderEmail}</Text>
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
                                        <View style={{ borderBottomColor: 'gray', width: '80%', alignSelf: 'center', borderBottomWidth: 1, marginVertical: 10 }} />
                                    </>
                                ))
                            )}
                        </View>
                    </View>
                </View>
            }
            {selectedTab === 'Sent' &&
                <View >
                    <View >
                        <View>
                            <View >
                                {sentFriendRequests.length === 0 ? (
                                    <View>
                                        <Text >You don't have any invitations</Text>
                                    </View>
                                ) : (
                                    sentFriendRequests.slice().reverse().map((invitation, index) => (
                                        <View key={index}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Text style={styles.textInvitation}>{invitation.receiverEmail}</Text>
                                            </View>
                                            <View style={{ borderBottomColor: 'gray', borderBottomWidth: 1, width: '80%', alignSelf: 'center', marginVertical: 10 }} />
                                        </View>
                                    ))
                                )}
                            </View>
                        </View>
                    </View>
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
    },
    topName: {
        fontSize: 30,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    bar: {
        backgroundColor: '#fff',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 10,
    },
    button: {
        flex:1,
        alignItems: 'center',
        backgroundColor: 'gray',
        margin: 5,
        borderRadius: 10,
    },
    buttonPanel: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    innerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textNextTo: {
      marginRight: 10,
    },
    textInvitation: {
        fontSize: 19,
        textAlign: 'center',
        marginLeft: 10,
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
    }

})
export default FriendsScreen;