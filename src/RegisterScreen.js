import React, { useRef, useState, useEffect, useCallback } from 'react';
import { View, TextInput, Alert, Text, StyleSheet, } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/AntDesign';
import DatePicker from 'react-native-date-picker'

const CONTENT_SIZE = responsiveWidth(90);

export default function RegisterScreen({ navigation }) {

    const dispatch = useDispatch();

    const input = useRef(null);

    const [login, setLogin] = useState();
    const [date, setDate] = useState(new Date())
    const [open, setOpen] = useState(false)

    const isUpdated = useSelector(state => state.isUpdated);
    
    const getUser = async (date) => {
    
        const url = `http://api.grsu.by/1.x/app1/getStudent?login=${login}&lang=ru_RU`;

        const data = await fetch(url)
            .then((resp) => resp.json())
            .then((json) => json);

        // console.log(data);

        if (data.k_sgryp) {
            dispatch({ type: "UPDATE_USER", payload: data, date: date });
            AsyncStorage.setItem('userData', JSON.stringify(data));
            AsyncStorage.setItem('@semesterSatrt', JSON.stringify(date));
        }
        else {
            Alert.alert('Ошибка', 'Вы ввели неверный логин', [
                {
                    text: 'Я понял',
                    onPress: () => input.current?.focus()
                },
                {
                    text: ':(',
                    onPress: () => input.current?.focus()
                }
            ]);
        }
    };

    const confirmDate = (date) => {
        let nowDate = new Date();
        if (nowDate < date) {
            Alert.alert('Oooops', 'Вы не можете указывать дату начала семестра, который ещё не начался.', [
                {
                    text: 'Я понял',
                },
                {
                    text: ':(',
                }
            ]);
            setOpen(false);
            return;
        }
        setOpen(false);
        setDate(date);
        getUser(date);
    };

    const openDate = useCallback(() => {
        setOpen(true);
    }, []);

    const closeDate = useCallback(() => {
        setOpen(false);
    }, []);

    useEffect(() => {
        if (isUpdated) {
            navigation.goBack();
            console.log("возвращаюсь к расписанию");
            dispatch({ type: "CANCLE_UPDATING", payload: false });
        };
    }, [isUpdated]);

    return (
        <View style={{ flex: 1, alignItems: 'center' }}>
            <View style={[styles.icon, styles.windowsParams]}>
                <Icon name="aliwangwang-o1" size={80} color='black' />
            </View>
            <TextInput
                ref={input}
                style={styles.textInput}
                placeholder={"Логин пользователя"}
                placeholderTextColor="#808080"
                onChangeText={setLogin}
                // onEndEditing={getUser}
                onEndEditing={openDate}
            />
            <View style={[styles.messageWindow, styles.windowsParams]}>
                <Text style={styles.alertMassedge}>Я вижу, ты хочешь ввести свой логин, получить расписание, да? А ты не забыл заполнить перед этим список своей учебной группы и распределить людей по подгруппам? После ввода логина тебе придёт расписание с теми людьми, которые указаны у тебя в списке. Если вдруг ты забыл кого-то внести в список или указать для кого-то его подгруппу, просто сделай это и заново введи свой логин.</Text>
            </View>
            <DatePicker
                modal
                mode="date"
                locale="ru"
                title="Дата начала семестра"
                open={open}
                date={date}
                onConfirm={confirmDate}
                onCancel={closeDate}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    textInput: {
        width: CONTENT_SIZE,
        height: responsiveHeight(7),
        backgroundColor: 'white',
        marginTop: responsiveHeight(5),
        borderRadius: 15,
        fontSize: responsiveFontSize(2.1),
        paddingHorizontal: 10,
        color: 'black',
        fontFamily: 'Inter-Regular'
    },
    alertMassedge: {
        color: 'black',
        fontSize: responsiveFontSize(2.1),
        fontFamily: 'Inter-Regular'
    },
    icon: {
        width: responsiveHeight(17),
        height: responsiveHeight(17),
        marginTop: responsiveHeight(10),
        justifyContent: 'center',
        alignItems: 'center'
    },
    messageWindow: {
        width: CONTENT_SIZE,
        marginTop: responsiveHeight(5),
        padding: 10
    },
    windowsParams: {
        borderRadius: 15,
        elevation: 5,
        backgroundColor: 'white',
    }
});
