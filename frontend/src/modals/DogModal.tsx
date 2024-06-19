import { Modal, Text, View, StyleSheet, Button, Image } from "react-native";
import React, { useEffect, useState } from "react";
import apiClient from "../../axiosConfig";
import { Dog } from "../constants/dogData";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

interface DogModalProps {
    visible: boolean;
    onClose: () => void;
    dogId: number;
}

const DogModal: React.FC<DogModalProps> = ({ visible, onClose, dogId }) => {

    const [dog, setDog] = useState<Dog | null>(null);

    useEffect(() => {
        if (!visible) {
            return;
        }
        apiClient.get(`/dogs/${dogId}`)
            .then(response => {
                setDog(response.data);
            })
            .catch(error => {
                console.error(`Error fetching dog ${dogId}:`, error);
            });

    }, [visible, dogId]);

    const capitalizeWords = (str: string) => {
        return str
            .toLowerCase()
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    if (!dog) {
        return (
            <Modal visible={visible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text>No data</Text>
                        <Button title="Close" onPress={onClose} />
                    </View>
                </View>
            </Modal>
        );
    }

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.dogName}>{dog.name}</Text>
                    {dog.photo ? (
                        <Image source={{ uri: dog.photo }} style={styles.dogPhoto} />
                    ) : (
                        <Image
                            source={{ uri: 'https://cdn-icons-png.flaticon.com/128/848/848043.png' }}
                            style={styles.dogPhoto}
                        />
                    )}
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoTitle}>Breed:</Text>
                        <Text style={styles.infoText}>{capitalizeWords(dog.breed)}</Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoTitle}>Age:</Text>
                        <Text style={styles.infoText}>{capitalizeWords(dog.age)}</Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoTitle}>Size:</Text>
                        <Text style={styles.infoText}>{capitalizeWords(dog.size)}</Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoTitle}>Sex:</Text>
                        <Text style={styles.infoText}>{capitalizeWords(dog.sex)}</Text>
                    </View>
                    <Button title="Close" onPress={onClose} />
                </View>
            </View>
        </Modal>
    );

}

export default DogModal;

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
    dogName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    dogPhoto: {
        width: '100%',
        height: 300,
        borderRadius: 16,
        marginBottom: 16,
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 8,
    },
    infoTitle: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    infoText: {
        fontSize: 16,
    }
});