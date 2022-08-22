import React from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import VendorProfile from '../VendorProfile';
import SearchScreen from '../SearchScreen';



export default function SearchStack(){

  
  const Stack = createNativeStackNavigator();

  return (
    <View style={styles.container}>
        <Stack.Navigator screenOptions={{headerShown:false}}>
            <Stack.Screen name='SearchStack' component={SearchScreen} />
            <Stack.Screen name='VendorProfile' component={VendorProfile} />
        </Stack.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#054d36"
  }
});
