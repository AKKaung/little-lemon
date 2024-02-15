import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';

const Filters = ({ onChange, selections, sections }) => {
  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      style={styles.filtersContainer}>
      {
        sections.map((section, index) => (
          <TouchableOpacity
            key={section}
            onPress={() => {
              onChange(index);
            }}
            style={{
              // flex: 1 / sections.length,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
              margin: 7,
              backgroundColor: selections[index] ? '#495E57' : '#cfe0e8',
              // borderWidth: 0.3,
              // borderColor: 'gray',
              opacity: selections[index] ? 1 : 0.7,
              borderRadius: 10,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 2,
              elevation: 2, // for Android
            }}>
            <View>
              <Text style={{ color: selections[index] ? 'white' : 'black', fontWeight: 'bold' }}>
                {section}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      }
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    // flexDirection: 'row',
    // alignItems: 'center',
    marginBottom: 10,
    padding: 0,
  },
});

export default Filters;
