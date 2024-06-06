import {StackNavigationProp} from "@react-navigation/stack";
import RootStackParamList from "../../RootStackParamList";
import React, {useEffect, useState} from "react";
import {Text, View, StyleSheet, TouchableOpacity, ScrollView} from "react-native";
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
const FriendsScreen: React.FC<FriendsScreenProp> = ({navigation}) => {
    const [receivedFriendRequests, setReceivedFriendRequests] = useState<receivedInvitation[]>([]);
    const [sentFriendRequests, setSentFriendRequests] = useState<sentInvitation[]>([]);
    const {user} = useAuth0();
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
        }
    }, []);
    return(
        <View style={styles.container}>
            <View style={styles.subContainer}>
                <View style={styles.mainHeader}>
                    <Text style={styles.mainHeaderText}>
                        YOUR FRIENDS
                    </Text>
                </View>
                <View>
                    <Text style={styles.text}>You don't have any friends yet</Text>
                </View>
            </View>
            <View style={styles.subContainer}>
                <View style={styles.mainHeader}>
                    <Text style={styles.mainHeaderText}>
                        YOUR INVITATIONS
                    </Text>
                </View>
                <View style={styles.subSubContainer}>
                        <View style={styles.invitationHeader}>
                            <Text style={styles.header}>
                                Sent
                            </Text>
                        </View>
                        <View style={styles.invitations}>
                            <ScrollView>
                                {sentFriendRequests.length === 0 ? (
                                    <View>
                                        <Text style={styles.text}>You don't have any invitations</Text>
                                    </View>
                                ) : (
                                    sentFriendRequests.slice().reverse().map((invitation, index) => (
                                        <View style={styles.invitation} key={index}>
                                            <Text style={styles.text}>To: {invitation.receiverEmail}</Text>
                                        </View>
                                    ))
                                )}
                            </ScrollView>
                        </View>
                    </View>
                    <View style={styles.subSubContainer}>
                    <View style={styles.invitationHeader}>
                        <Text style={styles.header}>
                            Received
                        </Text>
                    </View>
                    <View style={styles.invitations}>
                        <ScrollView>
                            {receivedFriendRequests.slice().reverse().map((invitation, index) => (
                                <View style={styles.invitationsOptions} key={index}>
                                    <View style={styles.invitation}>
                                        <Text style={styles.text}>From: {invitation.senderEmail}</Text>
                                    </View>
                                    <View style={styles.buttons}>
                                        <TouchableOpacity style={styles.addButton}>
                                            <MaterialCommunityIcon name={"plus-box"} size={33}></MaterialCommunityIcon>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.rejectButton}>
                                            <MaterialCommunityIcon name={"minus-box"} size={33}></MaterialCommunityIcon>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </View>
            <View style={styles.container}>
                <BottomBar navigation={navigation}/>
                <AddFriend/>
            </View>
        </View>


    );
}
const styles = StyleSheet.create({
    container: {
        flex:1
    },

    subContainer: {
        flex: 2
    },
    subSubContainer: {
        flex: 2.5
    },
    mainHeader: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 15,
    },
    mainHeaderText: {
        fontWeight: "bold",
        fontSize: 25
    },
    invitationHeader: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        marginLeft: 5,
    },
    header: {
        fontWeight: "bold",
        fontSize: 22,
        marginBottom: 4,
        marginTop: 3,
    },
    invitations:{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        marginBottom: 35,
        borderWidth: 2,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 5,

    },
    invitation: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        marginLeft: 15,
        marginBottom: 6,
        marginTop: 0,
    },
    invitationsOptions: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    text: {
        fontSize: 18,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    buttons: {
        marginRight: 15,
        marginTop: 5,
        display: "flex",
        flexDirection: "row",
    },
    addButton: {
        backgroundColor: '#83f134',
        marginRight: 15,
    },
    rejectButton: {
        backgroundColor: '#ff0000',

    },
})
export default FriendsScreen;