import React, { memo } from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { SharedElement } from 'react-navigation-shared-element';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

function Lesson({ id, item, index }) {

    const navigation = useNavigation();

    // console.log(`${id} - отрендерен: ${item.title}`)

    const handlePress = () => {
        console.log(`${item.title} pressed`)
        navigation.navigate("Detail", { id })
    };

    const countFalseFlags = Object.values(item.students.dataById).reduce((count, obj) => {
        return count + (obj.isHere === false ? 1 : 0);
    }, 0);

    const countTrueFlags = Object.values(item.students.dataById).reduce((count, obj) => {
        return count + (obj.isHere === true ? 1 : 0);
    }, 0);

    return (
        <SharedElement id={id}>
            <Pressable
                style={[styles.container, { marginTop: index == 0 ? responsiveHeight(7) : 0, }]}
                onPress={handlePress}
            >
                <View style={{ flex: 3, alignItems: 'center', justifyContent: 'space-between', paddingTop: responsiveHeight(1.1848341), paddingBottom: responsiveHeight(1.77725118) }}>
                    <Text style={styles.textSize}>{item.timeStart}</Text>
                    <Text style={styles.textSize}>{item.timeEnd}</Text>
                </View>
                <View style={{ flex: 8 }}>
                    <Text style={[styles.textSize, { marginTop: responsiveHeight(1.1848341), marginLeft: responsiveWidth(1.25), marginRight: responsiveWidth(1.25) }]}>{item.title}</Text>
                    <Text style={[styles.typeInfo, { marginTop: responsiveHeight(2.962085) }]}>*{item.type}</Text>
                    <Text style={[styles.typeInfo, { marginBottom: responsiveHeight(1.77725118) }]}>На занятии: {countTrueFlags}{"\n"}Отсутствует: {countFalseFlags}</Text>
                </View>
            </Pressable>
        </SharedElement>
    );
};

export default memo(Lesson)

const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        elevation: 5,
        marginBottom: responsiveHeight(1.5),
        width: responsiveWidth(90),
        backgroundColor: '#D9D9D9',
        borderRadius: 15,
        flexDirection: 'row'
    },
    textSize: {
        fontSize: responsiveFontSize(2.67),
        color: 'black',
        fontFamily: 'Inter-Regular'
    },
    typeInfo: {
        marginLeft: responsiveWidth(1.25),
        fontSize: responsiveFontSize(2.1),
        color: '#656565',
        fontFamily: 'Inter-Regular'
    }
});