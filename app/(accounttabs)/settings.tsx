import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BottomNav from '@/components/bottom-nav';
import { back } from '../router';
export default function SettingsScreen() {
    const [profile, setProfile] = useState<{ name: string; email: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editing, setEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');

    const startEditing = () => {
        if (profile) {
            setEditName(profile.name);
            setEditEmail(profile.email);
            setEditing(true);
        }
    };

    const saveProfile = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch('https://furniture.pnglin.byenoob.com/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token ?? ''}`,
                },
                body: JSON.stringify({ username: editName, email: editEmail }),
            });
            if (!response.ok) {
                const json = await response.json();
                throw new Error(json.error || 'Failed to update profile');
            }
            setProfile({ name: editName, email: editEmail });
            setEditing(false);
        } catch (err: any) {
            Alert.alert('Error', err.message);
        }
    };

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
                {/* Header */}
                <View style={styles.headerContainer}>
                    <Text style={styles.header}>Settings</Text>
                    <TouchableOpacity style={styles.backButton} onPress={() => back()}>
                        <Ionicons name="chevron-back" size={22} color="#4F63AC" />
                    </TouchableOpacity>
                </View>


                {/* Personal Information */}
                <View style={styles.sectionLabelRow}>
                    <Text style={styles.sectionLabel}>Personal Information</Text>
                    {editing ? (
                        <TouchableOpacity onPress={saveProfile}>
                            <Ionicons name="checkmark-circle-outline" size={22} color="#4F63AC" />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={startEditing}>
                            <Image source={require('../../assets/images/edit-2.png')} style={{ width: 20, height: 20 }} />
                        </TouchableOpacity>
                    )}
                </View>

                <View style={{ marginHorizontal: 16, marginBottom: 24 }}>
                    {loading ? (
                        <Text style={{ padding: 16, color: '#666' }}>Loading...</Text>
                    ) : error ? (
                        <Text style={{ padding: 16, color: 'red' }}>{error}</Text>
                    ) : profile ? (
                        <>
                            <View style={styles.fieldCard}>
                                <Text style={styles.fieldLabel}>Name</Text>
                                {editing ? (
                                    <TextInput
                                        style={styles.fieldInput}
                                        value={editName}
                                        onChangeText={setEditName}
                                        autoFocus
                                    />
                                ) : (
                                    <Text style={styles.fieldValue}>{profile.name}</Text>
                                )}
                            </View>
                            <View style={styles.fieldCard}>
                                <Text style={styles.fieldLabel}>Email</Text>
                                {editing ? (
                                    <TextInput
                                        style={styles.fieldInput}
                                        value={editEmail}
                                        onChangeText={setEditEmail}
                                        keyboardType="email-address"
                                    />
                                ) : (
                                    <Text style={styles.fieldValue}>{profile.email}</Text>
                                )}
                            </View>
                        </>
                    ) : null}
                </View>

                {/* Help Center */}
                <View style={styles.sectionLabelRow}>
                    <Text style={styles.sectionLabel}>Help Center</Text>
                </View>

                <View style={{ marginHorizontal: 16, marginBottom: 24 }}>
                    <TouchableOpacity style={styles.helpCard}>
                        <Text style={styles.helpText}>FAQ</Text>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.helpCard}>
                        <Text style={styles.helpText}>Contact Us</Text>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.helpCard}>
                        <Text style={styles.helpText}>Privacy & Terms</Text>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <BottomNav />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    scrollView: { flex: 1 },
    scrollContent: { paddingBottom: 20 },
    headerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 40,
    },
    backButton: {
        position: 'absolute',
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
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        fontFamily: 'Montserrat',
    },
    sectionLabelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    sectionLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#888',
    },
    card: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginBottom: 24,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
        overflow: 'hidden',
    },
    fieldCard: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },
    fieldLabel: {
        fontSize: 12,
        color: '#999',
        marginBottom: 2,
    },
    fieldValue: {
        fontSize: 16,
        color: '#4F63AC',
        fontWeight: '500',
    },
    fieldInput: {
        fontSize: 16,
        color: '#222',
        fontWeight: '500',
        borderBottomWidth: 1,
        borderBottomColor: '#4F63AC',
        paddingVertical: 4,
    },
    helpCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 16,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },
    helpText: {
        fontSize: 16,
        color: '#4F63AC',
        fontWeight: '600',
    },
});
