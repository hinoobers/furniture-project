import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BottomNav from '@/components/bottom-nav';
import { back, go } from '../router';

export default function MyListingsScreen() {
  const [listings, setListings] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const fetchMyListings = async () => {
        setLoading(true);
        setError(null);
        try {
          const token = await AsyncStorage.getItem('token');

          const [profileResponse, productsResponse] = await Promise.all([
            fetch('https://furniture.pnglin.byenoob.com/profile', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token ?? ''}`,
              },
            }),
            fetch('https://furniture.pnglin.byenoob.com/products', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token ?? ''}`,
              },
            }),
          ]);

          if (!profileResponse.ok) {
            throw new Error('Failed to fetch profile');
          }
          if (!productsResponse.ok) {
            throw new Error('Failed to fetch products');
          }

          const profileData = await profileResponse.json();
          const products: Array<any> = await productsResponse.json();
          const userId = profileData.id;

          // Filter products listed by this user (ignore static ones where listed_by is null)
          const myProducts = products.filter(
            (p: any) => p.listed_by != null && Number(p.listed_by) === Number(userId)
          );
          setListings(myProducts);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchMyListings();
    }, [])
  );

  const deleteListing = async (productId: number) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`https://furniture.pnglin.byenoob.com/products`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token ?? ''}`,
        },
        body: JSON.stringify({ product_id: productId }),
      });
      if (!response.ok) {
        throw new Error('Failed to delete listing');
      }
      setListings((prev) => prev.filter((p) => Number(p.id) !== productId));
    } catch (err: any) {
      console.error('Error deleting listing:', err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => back()}>
          <Ionicons name="chevron-back" size={22} color="#4F63AC" />
        </TouchableOpacity>
        <Text style={styles.header}>My Listings</Text>
        <View style={{ width: 44 }} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <Text style={{ fontSize: 16, color: '#666' }}>Loading...</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={{ color: 'red' }}>{error}</Text>
        </View>
      ) : listings.length === 0 ? (
        <View style={styles.centered}>
          <Text style={{ fontSize: 16, color: '#666' }}>No listings yet</Text>
        </View>
      ) : (
        <FlatList
          data={listings}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.itemRow}
              activeOpacity={0.7}
              onPress={() => {
                go({
                  pathname: '/product',
                  params: { id: item.id },
                });
              }}
            >
              <Image source={{ uri: item.image_url }} style={styles.itemImage} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>$ {Number(item.price).toFixed(2)}</Text>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => deleteListing(Number(item.id))}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Image source={require('../../assets/images/trash.png')} style={{ width: 22, height: 22 }} />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}

      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginTop: 10,
    marginBottom: 16,
  },
  backButton: {
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
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 14,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  removeButton: {
    padding: 6,
  },
});
