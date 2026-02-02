import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

const NAV_ITEMS = [
  { key: 'Home', icon: 'home', route: '/home' },
  { key: 'Bookmarks', icon: 'bookmark', route: '/bookmarks' },
  { key: 'Account', icon: 'person', route: '/account' },
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.tabBar}>
      {NAV_ITEMS.map((item) => {
        console.log('Current pathname:', pathname);
        const isActive = pathname === item.route;
        return (
          <TouchableOpacity
            key={item.key}
            style={styles.tabButton}
            onPress={() => router.push(item.route)}
          >
            <Ionicons
              name={isActive ? item.icon : `${item.icon}-outline`}
              size={24}
              color={isActive ? '#4F63AC' : '#888'}
            />
          </TouchableOpacity>
        );
      })}
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
  tabButton: {
    alignItems: 'center',
  },
});
