import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    TextInput,
    Linking, ScrollView, Dimensions,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import BottomBar from "../components/BottomBar";
import { StackNavigationProp } from "@react-navigation/stack";
import RootStackParamList from "../../RootStackParamList";
import { useAuth0 } from "react-native-auth0";
import * as ImagePicker from "expo-image-picker";
import apiClient from "../../axiosConfig";
import mime from "mime";
import NamesModal from "../modals/NamesModal";
import PhotoModal from "../modals/PhotoModal";
import AddDogModal from "../modals/AddDogModal";
import { DogSummary } from "../constants/dogData";
import DogModal from "../modals/DogModal";

type MapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Map'>;
type UserScreenNavigationProp = StackNavigationProp<RootStackParamList, 'User'>
type FriendsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Friends'>
interface UserScreenProps {
    navigation: MapScreenNavigationProp & UserScreenNavigationProp & FriendsScreenNavigationProp;
}
const FormData = global.FormData;

const UserScreen: React.FC<UserScreenProps> = ({ navigation }) => {
    const { user } = useAuth0();
    const [namesModalVisible, setNamesModalVisible] = useState(false);
    const [photoModalVisible, setPhotoModalVisible] = useState(false);
    const [dogModalVisible, setDogModalVisible] = useState(false);
    const [dogInfoModalVisible, setDogInfoModalVisible] = useState(false);
    const [address, setAddress] = useState("Provide your address");
    const [editingAddress, setEditingAddress] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("Provide your phone number");
    const [editingPhoneNumber, setEditingPhoneNumber] = useState(false);
    const [image, setImage] = useState("none");
    const [dogs, setDogs] = useState<DogSummary[]>([]);
    const [dogId, setDogId] = useState<number>(0);
    const { clearSession } = useAuth0();

    useEffect(() => {
        if (user) {
            apiClient.get("/user/getAddress", {
                params: { email: user.email }
            }).then(response => {
                setAddress(response.data.length !== 0 ? response.data : "Provide your address");
            });

            apiClient.get("/user/getPhoneNumber", {
                params: { email: user.email }
            }).then(response => {
                setPhoneNumber(response.data.length !== 0 ? response.data : "Provide your phone number");
            });

            apiClient.get("/user/profilePicture/download", {
                params: { email: user.email },
                responseType: 'blob'
            }).then(response => {
                const blob = response.data;
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (reader.result) setImage(reader.result as string);
                };
                reader.readAsDataURL(blob);
            });

            apiClient.get("/dogs/user", {
                params: { userEmail: user.email }
            }).then(response => {
                setDogs(response.data);
            });
            }
    }, []);

    const handleLogoutButtonPress = async () => {
        try {
            await clearSession({ federated: true });
            console.log("User's session cleared")
            navigation.navigate('Login');
        } catch (e) {
            console.log(e);
        }
    };

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
        if (user) {
            const userData = { email: user.email, address };
            await apiClient.post("/user/updateAddress", userData);
        }
        setEditingAddress(false);
    };

    const handleEditPhoneNumberClick = () => {
        setEditingPhoneNumber(true);
    };

    const handleEditPhoneNumberSaveClick = () => {
        if (user) {
            const userData = { email: user.email, phoneNumber };
            apiClient.post("/user/updatePhoneNumber", userData);
        }
        setEditingPhoneNumber(false);
    };

    const handleOpenDogModal = () => {
      setDogModalVisible(true);
    };

    const handleCloseDogModal = () => {
        setDogModalVisible(false);
    };

    const handleOpenDogInfoModal = (id: number) => {
        setDogId(id);
        setDogInfoModalVisible(true);
    };

    const handleCloseDogInfoModal = () => {
        setDogInfoModalVisible(false);
    };

    const uploadImage = async (mode: string) => {
        try {
            if (mode === "gallery") {
                await ImagePicker.requestMediaLibraryPermissionsAsync();
                const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1,
                });
                if (!result.canceled) {
                    await saveImage(result.assets[0].uri);
                }
            } else {
                await ImagePicker.requestCameraPermissionsAsync();
                const result = await ImagePicker.launchCameraAsync({
                    cameraType: ImagePicker.CameraType.front,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1,
                });
                if (!result.canceled) {
                    await saveImage(result.assets[0].uri);
                }
            }
        } catch (error) {
            alert("Error uploading image " + error);
            setPhotoModalVisible(false);
        }
    };

    const saveImage = async (imageUri: string) => {
        const userEmail = user?.email;
        if (user && userEmail) {
            const formData: FormData = new FormData();
            (formData as any).append('file', {
                uri: imageUri,
                type: mime.getType(imageUri),
                name: imageUri.split("/").pop()
            });
            formData.append('email', userEmail);
            try {
                await apiClient.put('/user/profilePicture/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                setPhotoModalVisible(false);
            } catch (error) {
                console.error('Upload failed', error);
            }
        }
    };

    const deleteImage = async () => {
        if (user) {
            try {
                const userData = { email: user.email };
                await apiClient.post("/user/profilePicture/delete", userData);
                setImage("none");
                setPhotoModalVisible(false);
            } catch (error) {
                console.error(error);
            }
        }
    };

    const capitalizeWords = (str: string) => {
        return str
            .toLowerCase()
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };


    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Your Profile</Text>
            </View>
            <View style={styles.profileInfo}>
                <View style={styles.profileImageContainer}>
                    <Image
                        source={{ uri: image !== "none" ? image : 'https://cdn-icons-png.flaticon.com/128/848/848043.png' }}
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
                        <Text style={styles.infoText}>{phoneNumber}</Text>
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
                        <Text style={styles.infoText}>{address}</Text>
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
                <Text style={styles.dogHeader}>Dogs</Text>
                    {dogs && dogs.map((dog, index) => (
                        <TouchableOpacity key={index} style={styles.dogSection} onPress={() => handleOpenDogInfoModal(dog.id)}>
                            <View style={styles.dogPhotoName}>
                                {dog.photo ? (
                                    <Image source={{uri: dog.photo}} style={styles.dogPhoto}/>
                                ) : (
                                    <MaterialIcon name="pets" size={40} color="#007bff" />
                                )
                                }
                                <Text style={styles.dogName}>{dog.name}</Text>
                            </View>
                            <Text style={styles.dogBreed}>{capitalizeWords(dog.breed)}</Text>
                        </TouchableOpacity>

                    ))}
                <View style={styles.addDogButtonContainer}>
                    <TouchableOpacity style={styles.addDogButton} onPress={handleOpenDogModal}>
                        <MaterialIcon name="add" size={24} color="#ffffff" />
                        <Text style={styles.addDogButtonText}>Add new dog</Text>
                    </TouchableOpacity>
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
            </ScrollView>
            <BottomBar navigation={navigation} />
            <NamesModal visible={namesModalVisible} onClose={handleCloseNamesModal} onOpenGithub={handleOpenGithub} />
            <PhotoModal visible={photoModalVisible} onClose={handleClosePhotoModal} uploadImage={uploadImage} deleteImage={deleteImage} />
            <AddDogModal visible={dogModalVisible} onClose={handleCloseDogModal} />
            <DogModal visible={dogInfoModalVisible} onClose={handleCloseDogInfoModal} dogId={dogId}/>
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
    infoHeaderText: {
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
    infoSectionEditComponent: {
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
    editView: {
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
    addDogButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#007bff',
        borderRadius: 24,
        width: '80%',
        height: 30,
    },
    addDogButtonText: {
        color: '#ffffff',
        fontSize: 16,
    },
    addDogButtonContainer: {
        alignItems: 'center',
    },
    scrollView: {
        paddingBottom: 80,
    },
    dogPhoto: {
        width: 40,
        height: 40,
        borderRadius: 24,
    },
    dogName: {
        fontSize: 16,
        marginLeft: 15,
        fontWeight: 'bold',
    },
    dogBreed: {
        fontSize: 14,
        marginLeft: 15,
    },
    dogPhotoName: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dogSection: {
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dogHeader: {
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 16,
    },
});

export default UserScreen;
