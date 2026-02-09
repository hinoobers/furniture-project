import { useFonts } from 'expo-font';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
const {go, back} = require('../router');

export default function HomeScreen() {
  const [fontsLoaded] = useFonts({
    'DMSans': require('@/assets/fonts/dmsans.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Image 
        source={require('@/assets/images/splashscreen.jpg')}
        style={styles.logo}
        resizeMode="contain"
      />
      
      <View style={styles.sloganContainer}>
        <Text style={styles.sloganText}>You'll find</Text>
        <Text style={styles.sloganHighlight}>All you need</Text>
        <Text style={styles.sloganText}> Here!</Text>
      </View>
      
      <TouchableOpacity style={styles.signUpButton} onPress={() => {
        go('/(auth)/signup');
      }}>
        <Text style={styles.signUpButtonText}>Sign up</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => {
        go('/(auth)/signin');
      }}>
        <Text style={styles.signInText}>Sign in</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 400,
    height: 250,
    marginBottom: 40,
  },
  signUpButton: {
    backgroundColor: '#4F63AC',
    paddingVertical: 15,
    paddingHorizontal: 100,
    borderRadius: 8,
    marginBottom: 20,
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  signInText: {
    color: '#4F63AC',
    fontSize: 16,
    fontWeight: 'bold'
  },
  sloganContainer: {
    flexDirection: 'column',
    marginBottom: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  sloganText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#000000',
    fontFamily: 'DMSans',
  },
  sloganHighlight: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FF8C00',
    textDecorationLine: 'underline',
    fontFamily: 'DMSans',
  },
});
