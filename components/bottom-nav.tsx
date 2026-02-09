import { Ionicons } from '@expo/vector-icons';
import { usePathname } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { go } from '../app/router';

const NAV_ITEMS = [
  { key: 'Home', icon: 'home', route: '/home', hidden: false },
  { key: 'Bookmarks', icon: 'bookmark', route: '/bookmarks', hidden: false },
  { key: 'Account', icon: 'person', route: '/account', hidden: false, additionalRoutes: ['/settings', '/mylistings'] },
];


export default function BottomNav() {
  const pathname = usePathname();

  return (
    <View style={styles.tabBar}>
      {NAV_ITEMS.filter(item => !item.hidden).map((item) => {
        console.log('Current pathname:', pathname);
        const isActive = pathname === item.route || (item.additionalRoutes && item.additionalRoutes.includes(pathname));
        return (
          <TouchableOpacity
            key={item.key}
            style={styles.tabButton}
            onPress={() => go(item.route)}
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
