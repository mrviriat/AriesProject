import React from 'react';
import { View, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import Day from './Day';

export default function HomeScreen({ navigation }) {

    const daysKey = useSelector(state => state.daysKey);

    const renderItem = ({ item, index }) => {
        let selectedDay = index;
        return (
            <Day dayData={item} />
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={daysKey}
                keyExtractor={(item) => item.key}
                renderItem={renderItem}
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                horizontal
            />
        </View>
    );
};