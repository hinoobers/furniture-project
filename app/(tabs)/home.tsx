import BottomNav from '@/components/bottom-nav';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { go } from '../router';

// luup Find All you need
// kategooriate valik (Popular, Chair, Table, Armchair, Bed, La..)
// Tooted 2x2 (Black Simple Lamp, Minimal Stand) ja all (Coffee Chair, Simple Desk)
// Pilt tootel, ja pildi all toote nimetus ja hind

// Removed default tabs (Home, Bookmarks, Konto) as requested


const categories = [
    { key: 'POPULAR', label: 'Popular', icon: 'star' },
    { key: 'CHAIR', label: 'Chair', image: require('../../assets/images/chair.png') },
    { key: 'TABLE', label: 'Table', image: require('../../assets/images/table.png') },
    { key: 'SOFA', label: 'Armchair', image: require('../../assets/images/armchair.png') },
    { key: 'BED', label: 'Bed', image: require('../../assets/images/bed.png') },
    { key: 'LAMP', label: 'Lamp', image: require('../../assets/images/lamp.png') },
];

// const products = [
//     {
//         id: '1',
//         name: 'Black Simple Lamp',
//         price: '$ 25',
//         image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
//         category: 'Lamp',
//     },
//     {
//         id: '2',
//         name: 'Minimal Stand',
//         price: '$ 40',
//         image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
//         category: 'Table',
//     },
//     {
//         id: '3',
//         name: 'Coffee Chair',
//         price: '$ 55',
//         image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=400&q=80',
//         category: 'Chair',
//     },
//     {
//         id: '4',
//         name: 'Simple Desk',
//         price: '$ 70',
//         image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
//         category: 'Table',
//     },
// ];

export default function HomeScreen() {
    const [selectedCategory, setSelectedCategory] = useState('POPULAR');
    const [products, setProducts] = useState<Array<any>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useFocusEffect(
        useCallback(() => {
            const fetchProducts = async () => {
                setLoading(true);
                setError(null);
                try {
                    const token = await AsyncStorage.getItem('token');
                    const response = await fetch('https://furniture.pnglin.byenoob.com/products', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token ?? ''}`,
                        },
                    });
                    if (!response.ok) {
                        throw new Error('Failed to fetch products');
                    }
                    const data = await response.json();
                    setProducts(data);
                } catch (err: any) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchProducts();
        }, [])
    );

    const filteredProducts =
        selectedCategory === 'POPULAR'
            ? products.filter((p) => p.is_popular)
            : products.filter((p) => p.category === selectedCategory);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <Ionicons name="search" size={24} color="#222" style={styles.searchIcon} />
                <Text style={styles.header}>Find All You Need</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScrollView}>
                <View style={styles.categoryContainer}>
                    {categories.map((cat) => (
                        <TouchableOpacity
                            key={cat.key}
                            style={[
                                styles.categoryButton,
                                selectedCategory === cat.key && styles.categoryButtonSelected,
                            ]}
                            onPress={() => setSelectedCategory(cat.key)}
                        >
                            {cat.image ? (
                                <Image
                                    source={cat.image}
                                    style={{ width: 32, height: 32, marginBottom: 4 }}
                                    resizeMode="contain"
                                />
                            ) : (
                                <Ionicons
                                    name={cat.icon}
                                    size={24}
                                    color={selectedCategory === cat.key ? '#fff' : '#222'}
                                    style={{ marginBottom: 4 }}
                                />
                            )}
                        </TouchableOpacity>

                    ))}
                </View>
            </ScrollView>
            <FlatList
                data={filteredProducts}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.row}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => {
                        go({
                            pathname: "/product",
                            params: { id: item.id }
                        });
                    }}>
                        <View style={styles.productCard}>
                            <Image source={{ uri: item.image_url }} style={styles.productImage} />
                            <View style={styles.productInfo}>
                                <Text style={styles.productName}>{item.name}</Text>
                                <Text style={styles.productPrice}>$ {item.price}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.productsList}
            />
            <BottomNav />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 20,
    },
    searchIcon: {
        position: 'absolute', left: 0,
        marginLeft: 10,
        color: '#4F63AC'
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        fontFamily: 'Montserrat',
    },
    categoryScrollView: {
        marginBottom: 10,
        maxHeight: 60,
    },
    categoryContainer: { flexDirection: 'row', paddingHorizontal: 10 },
    categoryButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        backgroundColor: '#f2f2f2',
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
        height: 48,
    },
    categoryButtonSelected: {
        backgroundColor: '#222',
    },
    categoryText: { color: '#222', fontWeight: '500', fontSize: 16 },
    categoryTextSelected: { color: '#fff' },
    productsList: { paddingHorizontal: 10 },
    row: { justifyContent: 'space-between', marginBottom: 16 },
    productCard: {
        borderRadius: 12,
        padding: 16,
        alignItems: 'flex-start',
        flex: 1,
        marginHorizontal: 5,
        height: 220,
    },
    productImage: { width: 140, height: 140, borderRadius: 8, marginBottom: 8 },
    productInfo: {
        width: '100%',
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    productName: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
    productPrice: { fontSize: 14, fontWeight: 'bold', color: '#000000ff' },
});