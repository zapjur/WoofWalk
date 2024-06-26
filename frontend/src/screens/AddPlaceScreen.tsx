import React, {useEffect, useRef, useState} from "react";
import {Alert, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import MapView, {Region} from 'react-native-maps';
import apiClient from "../../axiosConfig";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import RootStackParamList from "../../RootStackParamList";
import ModalSelector from 'react-native-modal-selector';
import {categories} from "../constants/types";
import {useLocation} from "../contexts/LocationContext";


const AddPlaceScreen: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [category, setCategory] = useState<string>(categories[0].value);
    const [region, setRegion] = useState<Region>({
        latitude: 50.0614300,
        longitude: 19.9365800,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const mapRef = useRef<MapView>(null);
    const { setRefreshKey } = useLocation();

    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');

    useEffect(() => {
        navigation.setOptions({
            title: 'Add new location'
        })
    }, []);

    const isDateValid = (Day: string, Month: string, Year: string) => {
        if (!/^\d*$/.test(Day)) {
            return false;
        }
        if (!/^\d*$/.test(Month)) {
            return false;
        }
        if (!/^\d*$/.test(Year)) {
            return false;
        }
        const day = parseInt(Day, 10);
        const month = parseInt(Month, 10);
        const year = parseInt(Month, 10);
        if (month < 1 || month > 12) {
            return false;
        }

        const daysInMonth = new Date(year, month, 0).getDate();
        if (day < 1 || day > daysInMonth) {
            return false;
        }

        if (year <= 0) {
            return false;
        }

        return true;
    }
    const dateFormatter = (Day: string, Month: string, Year: string) => {
        const day = parseInt(Day, 10);
        const month = parseInt(Month, 10);
        const year = parseInt(Year, 10);


        return `${day.toString().padStart(2, '0')}-${(month).toString().padStart(2, '0')}-${year.toString()}`;
    }



    const handleAddPlace = async () => {
        if (!name || !description) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        if(category.toUpperCase() == "EVENT"){
            const isDataValid = isDateValid(day, month, year);
            if(isDataValid){
                console.log("siemano kolano")
                try {
                    const date = dateFormatter(day, month, year);
                    console.log("Data: " + date);
                    const center = region;
                     await apiClient.post('/locations', {
                        name,
                        description,
                        latitude: center.latitude,
                        longitude: center.longitude,
                        category: category.toUpperCase(),
                        date: date,
                    });
                    setRefreshKey(oldKey => oldKey + 1);
                    navigation.navigate('Map');

                } catch (error) {
                    console.error('Error:', error);
                    Alert.alert('Error');
                }
            }
            else{
                Alert.alert("Invalid date", "Please provide Valid Date");
            }
        }
        else{
            try {
                const center = region;
                await apiClient.post('/locations', {
                    name,
                    description,
                    latitude: center.latitude,
                    longitude: center.longitude,
                    category: category.toUpperCase(),
                });
                setRefreshKey(oldKey => oldKey + 1);
                navigation.navigate('Map');

            } catch (error) {
                console.error('Error:', error);
                Alert.alert('Error');
            }
        }

    };


    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                region={region}
                onRegionChangeComplete={setRegion}
            />
            <View style={styles.markerFixed}>
                <View style={styles.marker} />
            </View>
            <View style={styles.form}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    returnKeyType="done"
                    placeholder="Enter place name"
                />
                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={styles.input}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Enter place description"
                    multiline
                    returnKeyType="done"
                />

                {category == "EVENT" && (
                    <View>
                        <Text style={styles.label}>Date</Text>
                        <View style={styles.dateContainer}>
                            <TextInput
                                style={styles.inputDate}
                                value={day}
                                keyboardType={'numeric'}
                                onChangeText={setDay}
                                placeholder="day"
                                multiline
                            />
                            <TextInput
                                style={styles.inputDate}
                                value={month}
                                keyboardType={'numeric'}
                                onChangeText={setMonth}
                                placeholder="month"
                                multiline
                            />
                            <TextInput
                                style={styles.inputDate}
                                value={year}
                                keyboardType={'numeric'}
                                onChangeText={setYear}
                                placeholder="year"
                                multiline
                            />
                        </View>
                    </View>
                )}
                <Text style={styles.label}>Category</Text>
                <ModalSelector
                    data={categories}
                    initValue="Select something"
                    onChange={(option) => setCategory(option.value)}
                    style={styles.input}
                >
                    <TextInput style={styles.text}
                        editable={false}
                        placeholder="Select category"
                        value={categories.find(cat => cat.value === category)?.label}
                    />
                </ModalSelector>
                <TouchableOpacity style={styles.button} onPress={handleAddPlace}>
                    <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    markerFixed: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        marginLeft: -12,
        marginTop: -24,
    },
    marker: {
        height: 24,
        width: 24,
        backgroundColor: 'red',
        borderColor: 'white',
        borderWidth: 3,
        borderRadius: 12,
        transform: [{ translateY: -12 }],
    },
    form: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    dateContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center"
    },
    inputDate: {
        width: 80,
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 5,
        borderRadius: 5,
        marginRight: 10,
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    text: {
        color: 'black',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#4c956c',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default AddPlaceScreen;