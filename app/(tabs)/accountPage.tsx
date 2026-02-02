import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';


export default function AccountPage() {
    const [selectedTab, setSelectedTab] = useState('Home');
    return (

       <View style={styles.tabBar}>
                    <TouchableOpacity
                        style={styles.tabButton}
                        onPress={() => setSelectedTab('Home')}
                    >
                        <Ionicons
                            name={selectedTab === 'Home' ? 'home' : 'home-outline'}
                            size={24}
                            color={selectedTab === 'Home' ? '#4F63AC' : '#888'}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.tabButton}
                        onPress={() => setSelectedTab('Bookmarks')}
                    >
                        <Ionicons
                            name={selectedTab === 'Bookmarks' ? 'bookmark' : 'bookmark-outline'}
                            size={24}
                            color={selectedTab === 'Bookmarks' ? '#4F63AC' : '#888'}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.tabButton}
                        onPress={() => setSelectedTab('Account')}
                    >
                        <Ionicons
                            name={selectedTab === 'Account' ? 'person' : 'person-outline'}
                            size={24}
                            color={selectedTab === 'Account' ? '#4F63AC' : '#888'}
                        />
                    </TouchableOpacity>
                </View>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 16,
        borderTopWidth: 1,
        borderColor: '#eee',
        backgroundColor: '#fff',
        gap: 60,
    },
    tabButton: { alignItems: 'center' },
});