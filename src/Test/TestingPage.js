import React, { useRef, useState, useEffect, memo } from 'react';
import { View, TextInput, Alert, Text, StyleSheet, Button, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/AntDesign';
import Item from './Item';

const CONTENT_SIZE = responsiveWidth(90);

export default function TestingPage({ navigation }) {

    const warField = useSelector(state => state.warField);


    useEffect(() => {
        console.log("Test is render");
    }, []);

    const handlePress = () => {
        console.log(warField);
    };

    const renderItem = ({ item }) => {
        return (
            <Item value={warField.dataById[item].value} item={item}/>
        );
    }

    return (
        <View style={styles.container}>
            <Button title="Press me" onPress={handlePress} />
            <FlatList
                data={warField.listId}
                keyExtractor={item => item}
                renderItem={renderItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    }
});
