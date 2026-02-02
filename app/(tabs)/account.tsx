import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BottomNav from '@/components/bottom-nav';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native';

export default function AccountScreen() {
  const [profile, setProfile] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch('https://furniture.pnglin.byenoob.com/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token ?? ''}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        const data = await response.json();
        setProfile({ name: data.username ?? 'John Doe', email: data.email ?? 'john.doe@example.com' });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Profile</Text>
      </View>

      <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
        {loading ? (
          <Text>Loading...</Text>
        ) : error ? (
          <Text style={{ color: 'red' }}>{error}</Text>
        ) : profile ? (
          <>
            <Text style={{ fontSize: 24, fontWeight: 'bold', paddingBottom: 8 }}>{profile.name}</Text>
            <Text style={{ fontSize: 16, color: '#666' }}>{profile.email}</Text>
          </>
        ) : null}
      </View>

      { // My listings, Settings, at the very bottom Add a new listing btn
      }

      
        <TouchableOpacity style={styles.button} onPress={() => {
             
        }}>
        <Text style={styles.buttonText}>Add a new listing</Text>
        </TouchableOpacity>
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
    header: { 
        fontSize: 28,
        fontWeight: 'bold',
        fontFamily: 'Montserrat',
    },
    categoryScrollView: {
        marginBottom: 10,
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
    button: {
      backgroundColor: '#4F63AC',
      paddingVertical: 15,
      paddingHorizontal: 60,
      borderRadius: 8,
      marginBottom: 20,
      alignSelf: 'center',
      minWidth: 180,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
