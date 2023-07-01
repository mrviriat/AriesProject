import React, { memo } from 'react';
import { Dimensions, View, FlatList, Text, StyleSheet } from 'react-native';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import ru from 'date-fns/locale/ru';
import Lesson from './Lesson';

const windowWidth = Dimensions.get('window').width;

function Day({ dayData }) {

    const dayDataByKey = useSelector(state => state.dayDataByKey);
    const lessonsByIdData = useSelector(state => state.lessonsByIdData);

    const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

    const today = `${new Date(dayData.day).getDate()}.${format(new Date(dayData.day), 'LL')} ${capitalize(format(new Date(dayData.day), 'EEEE', { locale: ru }))}`;

    const renderItem = ({ item, index }) => {
        return (<Lesson id={item} item={lessonsByIdData[item]} index={index} />);
    };

    return (
        <View style={{ width: windowWidth }}>
            <FlatList
                data={dayDataByKey[dayData.key]}
                keyExtractor={(item) => item}
                showsVerticalScrollIndicator={false}
                renderItem={renderItem}
            />
            <View style={styles.dayTitle}>
                <Text style={styles.textSize}>{today}</Text>
            </View>
        </View>
    );
};

export default memo(Day)

const styles = StyleSheet.create({
    dayTitle: {
        position: 'absolute',
        left: responsiveWidth(5),
        top: responsiveHeight(1),
        width: responsiveWidth(55),
        height: responsiveHeight(4.5),
        backgroundColor: 'white',
        borderRadius: responsiveWidth(2),
        paddingLeft: responsiveWidth(1)
    },
    textSize: {
        fontSize: responsiveFontSize(2.67),
        color: 'black',
        fontFamily: 'Inter-Regular'
    }
});