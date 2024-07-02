import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const authors = [
    { name: 'Piotr Zapiór', github: 'https://github.com/zapjur' },
    { name: 'Maciej Jurczyga', github: 'https://github.com/MaciekJurczyga' },
    { name: 'Szymon Burliga', github: 'https://github.com/SzupanBurliga' },
    { name: 'Paweł Piwowarczyk', github: 'https://github.com/Dewiant112' },
];

interface NamesModalProps {
    visible: boolean;
    onClose: () => void;
    onOpenGithub: (url: string) => void;
}

const NamesModal: React.FC<NamesModalProps> = ({ visible, onClose, onOpenGithub }) => {
    return (
        <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Creators of WoofWalk</Text>
                    <FlatList
                        data={authors}
                        renderItem={({ item }) => (
                            <View style={styles.modalItem}>
                                <Text style={styles.modalText}>{item.name}</Text>
                                <TouchableOpacity onPress={() => onOpenGithub(item.github)}>
                                    <MaterialCommunityIcon name="github" size={24} color="#000" />
                                </TouchableOpacity>
                            </View>
                        )}
                        keyExtractor={(item) => item.name}
                    />
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
    modalItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        width: '100%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 5,
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: "#ea4545",
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

export default NamesModal;
