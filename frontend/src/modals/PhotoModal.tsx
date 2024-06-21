import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

interface PhotoModalProps {
    visible: boolean;
    onClose: () => void;
    uploadImage: (mode: string) => void;
    deleteImage: () => void;
}

const PhotoModal: React.FC<PhotoModalProps> = ({ visible, onClose, uploadImage, deleteImage }) => {
    return (
        <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
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
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
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
        width: 300,
        padding: 20,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalItems: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-evenly',
    },
    modalProfilePictureItem: {
        marginBottom: 0,
        marginTop: 5,
    },
    modalTitleProfilePicture: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: "#fc3d3d",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: 90,
        height: 40,
        borderRadius: 20,
    },
    closeButtonText: {
        color: '#ffffff',
        fontSize: 16,
    },
});

export default PhotoModal;
