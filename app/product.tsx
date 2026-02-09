import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { back } from './router';

export default function ProductScreen() {
    const params = useLocalSearchParams();
    const productId = params.id;
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [favourite, setFavourite] = useState(false);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await AsyncStorage.getItem('token');

                // Fetch product and favourites in parallel
                const [productsResponse, favResponse] = await Promise.all([
                    fetch('https://furniture.pnglin.byenoob.com/products', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token ?? ''}`,
                        },
                    }),
                    fetch('https://furniture.pnglin.byenoob.com/favourites', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token ?? ''}`,
                        },
                    }),
                ]);

                if (productsResponse.ok) {
                    const products = await productsResponse.json();
                    const found = products.find((p: any) => String(p.id) === String(productId));
                    if (found) setProduct(found);
                }

                if (favResponse.ok) {
                    const favData = await favResponse.json();
                    const favIds: number[] = JSON.parse(favData.favourites);
                    if (favIds.some((id: number) => id == Number(productId))) {
                        setFavourite(true);
                    }
                }
            } catch (err: any) {
                console.error('Error fetching product data:', err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [productId]);

    const toggleFavourite = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(`https://furniture.pnglin.byenoob.com/favourites`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token ?? ''}`,
                },
                body: JSON.stringify({ product_id: Number(productId), value: !favourite }),
            });
            if (!response.ok) {
                throw new Error('Failed to update favourite');
            }
            setFavourite(!favourite);
        } catch (err: any) {
            console.error('Error toggling favourite:', err.message);
        }
    };


    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12 }}>
                    <TouchableOpacity style={styles.backButton} onPress={() => back()}>
                        <Ionicons name="chevron-back" size={22} color="#4F63AC" />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, color: '#666' }}>Loading...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!product) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ fontSize: 16, color: '#666' }}>Product not found</Text>
                <TouchableOpacity style={{ marginTop: 16 }} onPress={() => back()}>
                    <Text style={{ color: '#4F63AC', fontWeight: 'bold' }}>Go back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <View>
                    <Image source={{ uri: String(product.image_url) }} style={styles.productImage} />
                    <TouchableOpacity style={styles.backButton} onPress={() => back()}>
                        <Ionicons name="chevron-back" size={22} color="#4F63AC" />
                    </TouchableOpacity>
                </View>

                <View style={styles.productInfoContainer}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productPrice}>$ {product.price}</Text>
                </View>

                <View style={styles.descriptionContainer}>
                    <Text style={styles.productDescription}>{product.description}</Text>
                </View>

                <View style={styles.spacer} />
            </ScrollView>

            <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.favouriteButton} onPress={toggleFavourite}>
                    <Ionicons name={favourite ? "bookmark" : "bookmark-outline"} size={32} color="#4F63AC" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.contactSellerButton}>
                    <Text style={styles.contactSellerText}>Contact Seller</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    scrollView: { flex: 1 },
    scrollContent: { paddingBottom: 20 },
    backButton: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: '#fff',
        borderRadius: 12,
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    productImage: {
        width: '100%',
        height: 400,
        backgroundColor: '#000',
    },
    productInfoContainer: {
        marginTop: -30,
        padding: 20,
        paddingTop: 30,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
    },
    productPrice: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 4,
        color: '#000',
    },
    productName: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    descriptionContainer: {
        paddingHorizontal: 20,
        paddingTop: 8,
        backgroundColor: '#fff',
    },
    productDescription: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
    },
    spacer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        paddingHorizontal: 16,
        paddingBottom: 4,
        backgroundColor: '#fff',
    },
    favouriteButton: {
        borderRadius: 12,
        backgroundColor: '#F0F0F0',
        padding: 16,
        width: 64,
        height: 64,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contactSellerButton: {
        flex: 1,
        borderRadius: 12,
        backgroundColor: '#4F63AC',
        paddingVertical: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contactSellerText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    }
});
