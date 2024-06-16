import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Button,
    FlatList,
    Image,
    Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { dogSexes, dogSizes, dogBreeds, dogAges } from '../constants/dogData';
import apiClient from '../../axiosConfig';
import {useAuth0} from "react-native-auth0";

interface AddDogModalProps {
    visible: boolean;
    onClose: () => void;
}

const AddDogModal: React.FC<AddDogModalProps> = ({ visible, onClose }) => {
    const [name, setName] = useState('');
    const [sex, setSex] = useState('');
    const [size, setSize] = useState('');
    const [breed, setBreed] = useState('');
    const [age, setAge] = useState('');
    const [photo, setPhoto] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState({ type: '', visible: false });
    const [breedSearch, setBreedSearch] = useState('');
    const { user } = useAuth0();

    const handleSave = async () => {
        if (!name || !sex || !size || !breed || !age || !user?.email) {
            Alert.alert('Error', 'All fields are required!');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('sex', sex);
        formData.append('size', size);
        formData.append('breed', breed);
        formData.append('age', age);
        formData.append('userEmail', user.email)

        if (photo) {
            const filename = photo.split('/').pop();
            if(filename) {
                const fileType = filename.split('.').pop();
                formData.append('photo', {
                    uri: photo,
                    name: filename,
                    type: `image/${fileType}`,
                } as any);
            }
        }

        try {
            await apiClient.post('/dogs', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            onClose();

            setName('');
            setSex('');
            setSize('');
            setBreed('');
            setAge('');
            setPhoto(null);
            Alert.alert('Success', 'Dog added successfully!');
        } catch (error) {
            console.error('Error adding dog:', error);
            Alert.alert('Error', 'An error occurred while adding the dog.');
        }
    };

    const openModal = (type: string) => {
        setModalVisible({ type, visible: true });
    };

    const closeModal = () => {
        setModalVisible({ type: '', visible: false });
        setBreedSearch('');
    };

    const getModalData = () => {
        switch (modalVisible.type) {
            case 'sex':
                return dogSexes;
            case 'size':
                return dogSizes;
            case 'breed':
                return dogBreeds.filter(breed =>
                    breed.label.toLowerCase().includes(breedSearch.toLowerCase())
                );
            case 'age':
                return dogAges;
            default:
                return [];
        }
    };

    const handleSelect = (value: string) => {
        switch (modalVisible.type) {
            case 'sex':
                setSex(value);
                break;
            case 'size':
                setSize(value);
                break;
            case 'breed':
                setBreed(value);
                break;
            case 'age':
                setAge(value);
                break;
        }
        closeModal();
    };

    const selectImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: false,
        });

        if (!result.canceled) {
            setPhoto(result.assets[0].uri);
        }
    };

    const renderModalSelector = () => (
        <Modal visible={modalVisible.visible} animationType="slide" transparent={true}>
            <View style={styles.breedModalContainer}>
                <View style={styles.breedModalContent}>
                    {modalVisible.type === 'breed' && (
                        <TextInput
                            style={styles.breedSearchInput}
                            placeholder="Search Breed"
                            value={breedSearch}
                            onChangeText={setBreedSearch}
                        />
                    )}
                    <FlatList
                        data={getModalData()}
                        keyExtractor={item => item.value}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.breedItem}
                                onPress={() => handleSelect(item.value)}
                            >
                                <Text style={styles.breedItemText}>{item.label}</Text>
                            </TouchableOpacity>
                        )}
                    />
                    <Button title="Close" onPress={closeModal} />
                </View>
            </View>
        </Modal>
    );

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Add New Dog</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Dog's Name"
                        value={name}
                        onChangeText={setName}
                    />
                    <TouchableOpacity onPress={() => openModal('breed')} style={styles.selector}>
                        <Text style={styles.selectText}>
                            {breed ? dogBreeds.find(b => b.value === breed)?.label : 'Select Breed'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => openModal('sex')} style={styles.selector}>
                        <Text style={styles.selectText}>
                            {sex ? dogSexes.find(s => s.value === sex)?.label : 'Select Sex'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => openModal('size')} style={styles.selector}>
                        <Text style={styles.selectText}>
                            {size ? dogSizes.find(s => s.value === size)?.label : 'Select Size'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => openModal('age')} style={styles.selector}>
                        <Text style={styles.selectText}>
                            {age ? dogAges.find(a => a.value === age)?.label : 'Select Age'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={selectImage} style={styles.imageSelector}>
                        <Text style={styles.selectText}>Select Dog Photo</Text>
                    </TouchableOpacity>
                    {photo && (
                        <Image source={{ uri: photo }} style={styles.imagePreview} />
                    )}
                    <View style={styles.buttonContainer}>
                        <Button title="Cancel" onPress={onClose} />
                        <Button title="Submit" onPress={handleSave} />
                    </View>
                </View>
                {renderModalSelector()}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        maxHeight: '80%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    selector: {
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
    },
    imageSelector: {
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
    },
    initValueText: {
        color: '#ccc',
    },
    selectText: {
        color: '#000',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    breedModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    breedModalContent: {
        width: '90%',
        maxHeight: '80%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    breedSearchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    breedItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    breedItemText: {
        fontSize: 16,
    },
    imagePreview: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 10,
    },
});

export default AddDogModal;
