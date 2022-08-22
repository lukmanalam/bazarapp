import React from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import VendorProfile from '../VendorProfile';
import ChatScreen from '../ChatScreen';

export default function ChatStack(){

  
  const Stack = createNativeStackNavigator();

  return (
    <View style={styles.container}>
        <Stack.Navigator screenOptions={{headerShown:false}}>
            <Stack.Screen name='ChartStack' component={ChatScreen} />
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
