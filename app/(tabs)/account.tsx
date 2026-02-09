import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BottomNav from '@/components/bottom-nav';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native';
import { go } from '../router';

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
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
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

        {/* My listings section */}
        <TouchableOpacity style={styles.sectionContainer} onPress={() => go("/(accounttabs)/mylistings")}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My listings</Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>Already have 10 listings</Text>
            <Text style={styles.arrow}>→</Text>
          </View>
        </TouchableOpacity>

        {/* Settings section */}
        <TouchableOpacity style={styles.sectionContainer} onPress={() => go('/(accounttabs)/settings')}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Settings</Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>Account, FAQ, Contact</Text>
            <Text style={styles.arrow}>→</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity style={styles.button} onPress={() => {
        go('/(accounttabs)/newlisting');
      }}>
        <Text style={styles.buttonText}>Add a new listing</Text>
      </TouchableOpacity>

      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 20 },
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
  sectionContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4F63AC',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  listItemText: {
    fontSize: 16,
    color: '#333',
  },
  arrow: {
    fontSize: 20,
    color: '#4F63AC',
  },
});
