import React, { useState } from "react";
import { 
    View, 
    Text, 
    StyleSheet, 
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";


export default function ChatRoomHeader({name,back,pop_up}){


    return(
        <View style={styles.header}>
            <View style={{flexDirection:"row",alignItems:"center"}}>
                <AntDesign name="left" color="#000" size={24} onPress={back} />
                <Text style={styles.name}>{name}</Text>
            </View>
            <View style={{flexDirection:"row",alignItems:"center"}}>
                <MaterialCommunityIcons name="dots-vertical" color="#000" size={26} style={{marginLeft:20}} onPress={pop_up} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between",
        marginTop: 30,
        marginHorizontal:20
    },
    name: {
        color:"#000",
        fontWeight:"500",
        marginLeft:20,
        fontSize:16
    }
})