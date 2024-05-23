import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapScreen from './src/screens/MapScreen';
import BottomBar from "./src/components/BottomBar";
import AddPlaceButton from "./src/components/AddPlaceButton";

const App: React.FC = () => {
  return (
      <View style={styles.container}>
          <MapScreen />
          <AddPlaceButton/>
          <BottomBar />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;
