import React, { useRef, useState, useEffect, memo } from 'react';
import { View, TextInput, Alert, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/AntDesign';
import { FlatList } from 'react-native-gesture-handler';


function Item({ value, item }) {

    const dispatch = useDispatch();

    const handlePress = () => {
        dispatch({ type: "CHANGE_VALUE", key: item, value: `${value}  CH`, title: "title" });
    };

    console.log(`${item} Render - ${value}`);

    return (
        <TouchableOpacity style={styles.container} onPress={handlePress} >
            <Text style={styles.text}>{value}</Text>
        </TouchableOpacity>
    );
};

export default memo(Item)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'red',
        height: 130,
        width: 200,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        color: "black",
        fontSize: 20
    },
});
