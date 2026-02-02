import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import { Text, View } from 'react-native';

export default function Signin() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  return (
    <View style={styles.container}>
      <Text onPress={() => {
        router.push('/(tabs)');
      }} style={styles.backText}>{'←'} Sign in</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
            style={styles.input}
            placeholder="example@gmail.com"
            inputMode='email'
            keyboardType="default"
            placeholderTextColor="#808080"
          />

        <Text style={styles.label}>Password</Text>
        <TextInput
            style={styles.input}
            placeholder="Password"
            keyboardType="default"
            secureTextEntry={true}
            placeholderTextColor="#808080"
          />


      <TouchableOpacity style={styles.signUpButton} onPress={() => {
        router.push('/(tabs)/home');
      }}>
      <Text style={styles.signUpButtonText}>Sign in</Text>
      </TouchableOpacity>

      <Text style={{textAlign: 'center', marginBottom: 20, color: '#4F63AC'}}>---------Or sign in with---------</Text>
    <TouchableOpacity style={styles.googleButton} onPress={() => {
      // Handle Google sign up
    }}>
      <Image
        source={require('../../assets/images/google-logo.png')}
        style={styles.googleLogo}
      />
    </TouchableOpacity>

      <Text style={{textAlign: 'center', color: '#4F63AC'}} onPress={() => {
        router.push('/(auth)/signup');
      }}>Don't have an account? Sign up</Text>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    margin: 0,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center', 
    backgroundColor: 'black',
    paddingVertical: 15,
    width: '50%',
    borderRadius: 15,
    marginBottom: 20,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    color: '#808080',
  },
  signUpButton: {
    backgroundColor: '#4F63AC',
    marginTop: 10,
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
  label: {
    fontSize: 18,
    fontFamily: 'ge',

    color: '#4F63AC',
    marginLeft: 12,
  },
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  backText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4F63AC',
    marginTop: 40,
    paddingBottom: 40,
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  googleLogo: {
    width: 32,
    height: 32,
  },
});
