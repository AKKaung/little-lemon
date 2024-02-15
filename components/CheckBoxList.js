import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import CheckBox from 'react-native-check-box';
// import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CheckBoxList = ({ items }) => {
    const [checkedItems, setCheckedItems] = useState({});

    useEffect(() => {
        // Retrieve the checked state from AsyncStorage when the component mounts
        AsyncStorage.getItem('checkedItems').then((storedCheckedItems) => {
            if (storedCheckedItems) {
                setCheckedItems(JSON.parse(storedCheckedItems));
            }
        });
    }, []); // Empty dependency array ensures this effect runs only once on mount

    const handleCheckBoxChange = (item) => {
        const newCheckedItems = {
            ...checkedItems,
            [item.id]: !checkedItems[item.id]
        };

        // Save the updated checked state in AsyncStorage
        AsyncStorage.setItem('checkedItems', JSON.stringify(newCheckedItems)).then(() => {
            // Update the state and trigger a rerender
            setCheckedItems(newCheckedItems);
        });
    };

    return (
        <View>
            {items.map((item) => (
                <CheckBox
                    key={item.id}
                    style={{ flex: 1, marginVertical: 5 }}
                    onClick={() => handleCheckBoxChange(item)}
                    isChecked={checkedItems[item.id]}
                    rightText={item.label}
                />
            ))}
        </View>
    );
};

rnff

export default CheckBoxList;