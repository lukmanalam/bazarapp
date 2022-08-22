import React from "react";
import { 
    View, 
    Text, 
    StyleSheet, 
} from "react-native";
import Fontisto from "react-native-vector-icons/Fontisto";


export default function ProfileHeader({nav}){

    return(
        <View style={styles.header}>
            <View style={styles.headerSub}>
                <Text style={{color:"#000",fontSize:16,fontWeight:"500"}}>Account</Text>
                <Fontisto name="bell" color="#000" size={24} onPress={nav} />
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    header: {
        marginHorizontal: 20,
        marginBottom: 20
    },
    headerSub: {
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        marginTop:40
    },
    round: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#00C897",
        height: 40,
        width: 40,
        borderRadius: 40/2,
        marginLeft: 10
    },
})