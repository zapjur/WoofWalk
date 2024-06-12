import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Modal,
    FlatList,
    Linking,
    TextInput,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import BottomBar from "../components/BottomBar";
import {StackNavigationProp} from "@react-navigation/stack";
import RootStackParamList from "../../RootStackParamList";
import {useAuth0} from "react-native-auth0";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import * as ImagePicker from "expo-image-picker";
import apiClient from "../../axiosConfig";
import mime from "mime"


type MapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Map'>;
type UserScreenNavigationProp = StackNavigationProp<RootStackParamList, 'User'>
type FriendsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Friends'>
type ChatScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Chat'>
interface UserScreenProps {
    navigation: MapScreenNavigationProp & UserScreenNavigationProp & FriendsScreenNavigationProp & ChatScreenNavigationProp;
}
const FormData = global.FormData;



const UserScreen: React.FC<UserScreenProps> = ({navigation}) => {
    const {user} = useAuth0();
    const [namesModalVisible, setNamesModalVisible] = useState(false);
    const [photoModalVisible, setPhotoModalVisible] = useState(false);
    const [address, setAddress] = useState("Provide your address");
    const [editingAddress, setEditingAddress] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("Provide your phone number");
    const [editingPhoneNumber, setEditingPhoneNumber] = useState(false);
    const [image, setImage] = useState("none");
    const {clearSession} = useAuth0();
    useEffect(() => {
        if(user){
             apiClient.get("/user/getAddress", {
                params: {
                    email: user.email,
                }
            }).then(response => {
                    if(response.data.length !== 0){
                        setAddress(response.data);
                    }
                    else{
                        setAddress("Provide your address");
                    }
                });
            apiClient.get("/user/getPhoneNumber", {
                params: {
                    email: user.email,
                }
            }).then(response => {
                    if(response.data.length !== 0){
                        setPhoneNumber(response.data);
                    }
                    else{
                        setPhoneNumber("Provide your phone number");
                    }
            });
            apiClient.get("/user/profilePicture/download",{
                params: {
                    email: user.email,
                },
                responseType: 'blob'
            }).then(response => {
                const blob = response.data;
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (reader.result) {
                        setImage(reader.result as string);

                    }
                };
                reader.readAsDataURL(blob);
            })

        }

    }, []);
    const handleLogoutButtonPress = async () => {
        try {
            await clearSession({
                federated: true
            });
            console.log("User's session cleared")
            navigation.navigate('Login');

        } catch (e) {
            console.log(e);
        }
    }
    const authors = [
        { name: 'Piotr Zapiór', github: 'https://github.com/zapjur' },
        { name: 'Maciej Jurczyga', github: 'https://github.com/MaciekJurczyga' },
        { name: 'Szymon Burliga', github: 'https://github.com/SzupanBurliga' },
        { name: 'Paweł Piwowarczyk', github: 'https://github.com/Dewiant112' },
    ];
    const handleOpenGithub = (url: string) => {
        Linking.openURL(url);
    };
    const handleOpenNamesModal = () => {
        setNamesModalVisible(true);
    };

    const handleCloseNamesModal = () => {
        setNamesModalVisible(false);
    };

    const handleOpenPhotoModal = () => {
        setPhotoModalVisible(true);
    };

    const handleClosePhotoModal = () => {
        setPhotoModalVisible(false);
    };
    const handleEditAddressClick = () => {
        setEditingAddress(true);
    };

    const handleEditAddressSaveClick = async () => {
        if(user){
            const userData = {
                email : user.email,
                address: address
            }
             await apiClient.post("/user/updateAddress", userData);
        }
        setEditingAddress(false);
    };
    const handleEditPhoneNumberClick = () => {
        setEditingPhoneNumber(true);
    };

    const handleEditPhoneNumberSaveClick = () => {
        if(user){
            const userData = {
                email : user.email,
                phoneNumber: phoneNumber,
            }
            apiClient.post("/user/updatePhoneNumber", userData);
        }
        setEditingPhoneNumber(false);
    };
    const uploadImage = async (mode:string) => {

        try{
            if(mode === "gallery"){
                await ImagePicker.requestMediaLibraryPermissionsAsync();
                const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1,1],
                    quality: 1,
                })
                if(!result.canceled){
                    await saveImage(result.assets[0].uri);
                }
            }
            else{
                await ImagePicker.requestCameraPermissionsAsync();
                const result = await ImagePicker.launchCameraAsync(
                    {
                        cameraType: ImagePicker.CameraType.front,
                        allowsEditing: true,
                        aspect: [1, 1],
                        quality: 1,
                    });
                if(!result.canceled){
                    await saveImage(result.assets[0].uri);
                }
            }
        }
        catch (error){
            alert("Error uploading image " + error);
            setPhotoModalVisible(false);
        }
    }
    const saveImage = async ( imageUri: string) => {
        const userEmail = user?.email;
        if(user && userEmail){
            const formData: FormData = new FormData();
            (formData as any).append('file', {
                uri: imageUri,
                type: mime.getType(imageUri),
                name: imageUri.split("/").pop()
            })
            formData.append('email', userEmail);
            try {
              await apiClient.put('/user/profilePicture/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
              setPhotoModalVisible(false);
            } catch (error) {
                console.error('Upload failed', error);
            }
        }
        }

    const deleteImage = async () => {
        if(user){
            try{
                const userData = {
                    email : user.email,
                }
                await apiClient.post("/user/profilePicture/delete", userData)
                setImage("none");
                setPhotoModalVisible(false);
            }
            catch (error){
                console.error(error);
            }
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Your Profile</Text>
            </View>
            <View style={styles.profileInfo}>
                <View style={styles.profileImageContainer}>
                    <Image
                        source={{ uri: image != "none" ? image : 'https://cdn-icons-png.flaticon.com/128/848/848043.png' }}
                        style={styles.profileImage}
                    />
                    <TouchableOpacity style={styles.cameraIcon} onPress={handleOpenPhotoModal}>
                        <MaterialIcon name="camera-alt" size={24} color="#ffffff" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.userName}>{user?.nickname}</Text>
            </View>
            <View style={styles.infoHeader}>
                <Text style={styles.infoHeaderText}>Personal Info</Text>
            </View>
            <View style={styles.infoSection}>
                <MaterialIcon name="email" size={24} color="#007bff" />
                <Text style={styles.infoText}>{user?.email}</Text>
            </View>
            <View style={styles.infoSectionEdit}>
                <View style={styles.infoSectionEditComponent}>
                    <MaterialIcon name="phone" size={24} color="#007bff" />
                    {editingPhoneNumber ? (
                        <TextInput
                            style={styles.infoText}
                            keyboardType={"numeric"}
                            onChangeText={setPhoneNumber}
                            placeholder="Provide your phone number"
                        />
                    ) : (
                        <Text style= {styles.infoText}>{phoneNumber}</Text>
                    )}
                </View>
                <View style={styles.infoSectionEditComponent}>
                    {editingPhoneNumber ? (
                        <TouchableOpacity onPress={handleEditPhoneNumberSaveClick}>
                            <MaterialIcon name={"save"} size={17}></MaterialIcon>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={handleEditPhoneNumberClick}>
                            <MaterialIcon name={"edit"} size={17}></MaterialIcon>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
            <View style={styles.infoSectionEdit}>
                <View style={styles.infoSectionEditComponent}>
                    <MaterialIcon name="location-on" size={24} color="#007bff" />
                    {editingAddress ? (
                        <TextInput
                            style={styles.infoText}
                            onChangeText={setAddress}
                            placeholder="Provide your address"
                        />
                    ) : (
                        <Text style= {styles.infoText}>{address}</Text>
                    )}
                </View>
                <View style={styles.infoSectionEditComponent}>
                    {editingAddress ? (
                        <TouchableOpacity onPress={handleEditAddressSaveClick}>
                            <MaterialIcon name={"save"} size={17}></MaterialIcon>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={handleEditAddressClick}>
                            <MaterialIcon name={"edit"} size={17}></MaterialIcon>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
            <View style={styles.infoHeader}>
                <Text style={styles.infoHeaderText}>Utilities</Text>
            </View>
            <View style={styles.menuSection}>
                <TouchableOpacity style={styles.menuItem} onPress={handleOpenNamesModal}>
                    <MaterialIcon name="code" size={24} color="#007bff" />
                    <Text style={styles.menuText}>Creators</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <MaterialIcon name="settings" size={24} color="#007bff" />
                    <Text style={styles.menuText}>Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={handleLogoutButtonPress}>
                    <MaterialIcon name="logout" size={24} color="#007bff" />
                    <Text style={styles.menuText}>Log Out</Text>
                </TouchableOpacity>
            </View>
            <BottomBar navigation={navigation}/>
            <Modal
                animationType="slide"
                transparent={true}
                visible={namesModalVisible}
                onRequestClose={handleCloseNamesModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Creators of WoofWalk</Text>
                        <FlatList
                            data={authors}
                            renderItem={({ item }) => (
                                <View style={styles.modalItem}>
                                    <Text style={styles.modalText}>{item.name}</Text>
                                    <TouchableOpacity onPress={() => handleOpenGithub(item.github)}>
                                        <MaterialCommunityIcon name="github" size={24} color="#000" />
                                    </TouchableOpacity>
                                </View>
                            )}
                            keyExtractor={(item) => item.name}
                        />
                        <TouchableOpacity style={styles.closeButton} onPress={handleCloseNamesModal}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={photoModalVisible}
                onRequestClose={handleClosePhotoModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitleProfilePicture}>Profile Picture</Text>
                        <View style={styles.modalItems}>
                            <TouchableOpacity style={styles.modalProfilePictureItem} onPress={() => uploadImage("photo")}>
                                <MaterialIcon name="photo-camera" size={55} color="#000" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalProfilePictureItem} onPress={() => uploadImage("gallery")}>
                                <MaterialIcon name="photo-library" size={55} color="#000" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalProfilePictureItem} onPress={deleteImage}>
                                <MaterialIcon name="delete" size={55} color="#000" />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.closeButton} onPress={handleClosePhotoModal}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },

    headerText: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    profileInfo: {
        alignItems: 'center',
        marginBottom: 45,
    },
    profileImageContainer: {
        position: 'relative',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#007bff',
        padding: 5,
        borderRadius: 50,
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    infoHeaderText:{
        fontSize: 17,
        fontWeight: 'bold',
    },
    userDetails: {
        fontSize: 16,
        color: '#666',
    },

    infoSection: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 30,
        marginLeft: 10,
    },
    infoSectionEdit: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },

    infoSectionEditComponent:{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 10,
        marginBottom: 30,
    },

    infoText: {
        fontSize: 16,
        marginLeft: 15,
    },
    editView:{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    menuSection: {
        marginTop: 0,
        marginLeft: 10,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    menuText: {
        fontSize: 16,
        marginLeft: 15,
    },
    infoHeader: {
        marginBottom: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalItems:{
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: "space-evenly",
    },
    modalItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        width: '100%',
    },
    modalProfilePictureItem: {
        marginBottom: 0,
        marginTop: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalTitleProfilePicture: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 5,
    },
    closeButton: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#007bff',
        borderRadius: 5,
    },
    closeButtonText: {
        color: '#ffffff',
        fontSize: 16,
    },
});

export default UserScreen;
