import { debounce } from 'lodash';
import { useEffect, useState, useCallback, useMemo } from 'react';
import {
    Text,
    Image,
    View,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Alert,
    StyleSheet,
} from "react-native";
import { Searchbar } from "react-native-paper";
import Filters from '../components/Filters';
import { createTable, filterByQueryAndCategories, getMenuItems, saveMenuItems } from '../database';
import { useUpdateEffect } from '../utils';

const API_URL =
    'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json';
const sections = ['Starters', 'Mains', 'Desserts', 'Drinks', 'Salads'];

const Item = ({ name, description, image, price }) => (
    <View style={styles.item}>
        <View style={styles.itemSection}>
            <View style={styles.itemSectionText}>
                <Text style={styles.itemTitle}>{name}</Text>
                <Text style={styles.itemDescription}>{description}</Text>
                <Text style={styles.itemPrice}>${price}</Text>
            </View>
            <View style={styles.itemBackImage}>
                {image === 'greekSalad.jpg' && <Image source={require('../img/greekSalad.png')} style={styles.itemImage} />}
                {image === 'bruschetta.jpg' && <Image source={require('../img/bruschetta.png')} style={styles.itemImage} />}
                {image === 'grilledFish.jpg' && <Image source={require('../img/grilledFish.png')} style={styles.itemImage} />}
                {image === 'pasta.jpg' && <Image source={require('../img/pasta.png')} style={styles.itemImage} />}
                {image === 'lemonDessert.jpg' && <Image source={require('../img/lemonDessert.png')} style={styles.itemImage} />}
            </View>
        </View>
    </View>
);

const ItemSeparator = () => (
    <View style={styles.separator} />
);

const getRandomNumberInRange = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
};

const Home = () => {
    const [data, setData] = useState([]);
    const [menu, setMenu] = useState([]);
    const [searchBarText, setSearchBarText] = useState('');
    const [query, setQuery] = useState('');
    const [filterSelections, setFilterSelections] = useState(
        sections.map(() => false)
    );

    const fetchData = async () => {
        try {
            const response = await fetch(API_URL);
            const json = await response.json();

            if (!json || !json.menu || !Array.isArray(json.menu)) {
                return json;
            }

            const flattenedMenu = json.menu.map(item => {
                return {
                    id: getRandomNumberInRange(1, 100),
                    name: item.name,
                    description: item.description,
                    price: item.price,
                    image: item.image,
                    category: item.category,
                };
            });

            console.log(`Fetching===> ${JSON.stringify(flattenedMenu)}`);
            return flattenedMenu;
        } catch (error) {
            console.error(error);
        }
        return [];
    };

    useEffect(() => {
        (async () => {
            try {
                await createTable();
                let menuItems = await getMenuItems();

                if (!menuItems.length) {
                    const menuItems = await fetchData();
                    saveMenuItems(menuItems);
                    setMenu(menuItems);
                }

                // const listData = getListData(menuItems);
                console.log(`MenuList: useEffect ==> ${JSON.stringify(menuItems)}`);
                setData(menuItems);
            } catch (e) {
                // Handle error
                Alert.alert(e.message);
            }
        })();
    }, [menu]);

    useUpdateEffect(() => {
        (async () => {
            const activeCategories = sections.filter((s, i) => {
                // If all filters are deselected, all categories are active
                if (filterSelections.every((item) => item === false)) {
                    return true;
                }
                return filterSelections[i];
            });
            try {
                const menuItems = await filterByQueryAndCategories(
                    query,
                    activeCategories
                );
                // const listData = getListData(menuItems);
                console.log(`MenuList: useUpdateEffect ==> ${JSON.stringify(menuItems)}`);
                setData(menuItems);
            } catch (e) {
                Alert.alert(e.message);
            }
        })();
    }, [filterSelections, query]);

    const lookup = useCallback((q) => {
        setQuery(q);
    }, []);

    const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup]);

    const handleSearchChange = (text) => {
        setSearchBarText(text);
        debouncedLookup(text);
    };

    const handleFiltersChange = async (index) => {
        const arrayCopy = [...filterSelections];
        arrayCopy[index] = !filterSelections[index];
        setFilterSelections(arrayCopy);
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            {/* <ScrollView keyboardDismissMode="on-drag" > */}
            {/* <View style={styles.footerSection}> */}
            <FlatList
                keyboardDismissMode='on-drag'
                data={data}
                renderItem={({ item }) => <Item key={item.id} name={item.name} description={item.description} image={item.image} price={item.price} />}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={ItemSeparator}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <>
                        <View style={styles.headerSection}>
                            <Text style={styles.headerTitle}>Little Lemon</Text>
                            <Text style={styles.headerDescription}>Chicago</Text>
                            <View style={styles.headerBodySection}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.headerBody}>We are a family owned Mediterranean restaurant,
                                        focused on traditional recipes served with a modern twist.</Text>
                                </View>
                                <Image
                                    style={styles.headerSectionImage}
                                    source={require('../img/hero_image.png')} />
                            </View>
                            <Searchbar
                                placeholder="Search"
                                placeholderTextColor="#495E57"
                                onChangeText={handleSearchChange}
                                value={searchBarText}
                                style={styles.searchBar}
                                iconColor="#495E57"
                                inputStyle={styles.searchBarInput}
                                elevation={0}
                            />
                        </View>
                        <View style={styles.bodySection}>
                            <Text style={styles.orderTitle}>Order for delivery!</Text>
                            <Filters
                                selections={filterSelections}
                                onChange={handleFiltersChange}
                                sections={sections}
                            />
                        </View>
                        <View style={styles.bodySeparator} />
                    </>
                }
                ListHeaderComponentStyle={styles.listHeaderSection}
            />
            {/* </View> */}
            {/* </ScrollView> */}
        </KeyboardAvoidingView >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    itemSectionText: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 0,
        alignItems: 'start',
        gap: 5,
    },
    itemSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 0,
        alignItems: 'center',
        gap: 10,
    },
    item: {
        padding: 20,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    itemDescription: {
        flex: 1,
        fontSize: 14,
        paddingVertical: 5,
        fontWeight: '300',
    },
    itemPrice: {
        fontSize: 15,
        fontWeight: '500',
    },
    itemImage: {
        width: 90,
        height: 90,
        borderRadius: 10,
    },
    itemBackImage: {
        width: 90,
        height: 90,
        backgroundColor: '#e0e2e4',
        borderRadius: 10,
    },
    searchBarInput: {
        color: '#495E57',
        justifyContent: 'center',
        height: 45,
        alignSelf: 'center'
    },
    listHeaderSection: {
        height: 'auto',
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0,
    },
    listSection: {
        height: 'auto',
        paddingTop: 0,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 20,
    },
    headerSection: {
        height: 'auto',
        backgroundColor: '#495E57',
        paddingTop: 10,
        paddingLeft: 20,
        paddingRight: 20,
    },
    headerBodySection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 0,
        alignItems: 'center',
        gap: 10,
    },
    headerTitle: {
        fontWeight: 'bold',
        fontSize: 30,
        fontStyle: 'normal',
        color: '#F4CE14',
        letterSpacing: 2,
    },
    headerDescription: {
        fontWeight: 'normal',
        fontSize: 24,
        fontStyle: 'normal',
        color: '#fff',
    },
    headerBody: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'auto',
        lineHeight: 26,
    },
    headerSectionImage: {
        width: 130,
        height: 150,
        backgroundColor: '#f0efef',
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderRadius: 20,
        resizeMode: 'cover',
    },
    searchBar: {
        height: 40,
        borderRadius: 10,
        marginVertical: 20,
        backgroundColor: '#fff',
    },
    bodySection: {
        height: 'auto',
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0,
        marginLeft: 20,
        marginRight: 20,
    },
    footerSection: {
        height: 'auto',
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 20,
    },
    orderTitle: {
        textTransform: 'uppercase',
        fontWeight: 'bold',
        fontSize: 18,
        marginVertical: 10,
        paddingLeft: 0,
        fontStyle: 'normal',
        color: '#1E1E1E',
    },
    bodySeparator: {
        height: 1,
        marginStart: 20,
        marginEnd: 20,
        backgroundColor: '#CED0CE',
    },
    separator: {
        height: 1,
        marginStart: 20,
        marginEnd: 20,
        backgroundColor: '#CED0CE',
    },
});

export default Home;