import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, Animated, Text, Pressable, FlatList } from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";
import { SharedElement } from 'react-navigation-shared-element';
import { useDispatch, useSelector } from 'react-redux';
import ReasonStudent from './ReasonStudent';
import ReasonSelector from './ReasonSelector';

const CONTENT_SIZE = responsiveWidth(90);

export default function DetailScreen({ route, navigation }) {

  const dispatch = useDispatch();

  // const { id, item, item: { students } } = route.params;
  const { id } = route.params;

  const [visible, setVisible] = useState(false);
  const [changedStudent, setChangedStudent] = useState({});
  const [changedStudentId, setChangedStudentId] = useState("");

  const lessonsByIdData = useSelector(state => state.lessonsByIdData);
  const item = lessonsByIdData[id];
  const students = lessonsByIdData[id].students;

  const handlePress = () => {
    dispatch({ type: "SAVE_CHANGES" });
    navigation.goBack();
  };

  const openSelector = useCallback((student, id) => {
    setChangedStudent(student);
    setChangedStudentId(id);
    setVisible(true);
  }, []);

  const closeSelector = useCallback(() => {
    setVisible(false);
  }, []);

  const countFalseFlags = Object.values(item.students.dataById).reduce((count, obj) => {
    return count + (obj.isHere === false ? 1 : 0);
  }, 0);

  const countTrueFlags = Object.values(item.students.dataById).reduce((count, obj) => {
    return count + (obj.isHere === true ? 1 : 0);
  }, 0);

  const renderItem = ({ item, index }) => {

    const isFirstItem = index === 0;
    const isLastItem = index === students.listId.length - 1;



    return (
      <ReasonStudent
        item={students.dataById[item]}
        index={index}
        studentId={item}
        lessonId={id}
        isFirstItem={isFirstItem}
        isLastItem={isLastItem}
        openSelector={openSelector}
      />
    )
  };

  console.log(`${id} - отрендерен в детальном экране: ${item.title}`)

  return (
    <View style={styles.screen}>
      <SharedElement id={id}>
        <Pressable
          style={styles.container}
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
      <FlatList
        data={students.listId}
        keyExtractor={item => item}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => (
          <View style={styles.separator} />
        )}
      />
      <ReasonSelector
        visible={visible}
        options={{ type: 'slide', from: 'bottom' }}
        duration={500}
        onClose={closeSelector}
        item={changedStudent}
        studentId={changedStudentId}
        lessonKey={id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    // paddingTop: responsiveHeight(5),
  },
  container: {
    alignSelf: 'center',
    elevation: 5,
    marginTop: responsiveHeight(5),
    marginBottom: responsiveHeight(1.5),
    width: responsiveWidth(90),
    backgroundColor: '#D9D9D9',
    borderRadius: 15,
    flexDirection: 'row'
  },
  lessonContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: '#D9D9D9',
    width: responsiveWidth(90),
    borderRadius: 15,
    elevation: 5,
    marginBottom: responsiveHeight(2),
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
  },
  separator: {
    alignSelf: 'center',
    backgroundColor: "black",
    height: 1,
    width: CONTENT_SIZE
  },
});