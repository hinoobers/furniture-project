import { Checkbox } from 'expo-checkbox';
import { useState } from 'react';
import { Image, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { go } from '../router';

import { Text, View } from 'react-native';

export default function Signup() {
  const [checked, setChecked] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <Text onPress={() => {
        go('/(tabs)');
      }} style={styles.backText}>{'←'} Sign up</Text>

        <Text style={styles.label}>Name</Text>
        <TextInput
            style={styles.input}
            placeholder="John Doe"
            keyboardType="default"
            placeholderTextColor="#808080"
            onChangeText={setUsername}
            value={username}
          />
        <Text style={styles.label}>Email</Text>
        <TextInput
            style={styles.input}
            placeholder="example@gmail.com"
            inputMode='email'
            keyboardType="default"
            placeholderTextColor="#808080"
            onChangeText={setEmail}
            value={email}
          />

        <Text style={styles.label}>Password</Text>
        <TextInput
            style={styles.input}
            placeholder="Password"
            keyboardType="default"
            secureTextEntry={true}
            placeholderTextColor="#808080"
            onChangeText={setPassword}
            value={password}
          />

      <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
        <Checkbox
          style={{ margin: 12 }}
          value={checked}
          onValueChange={() => {setChecked(!checked);}}
        />
        <Text>I agree with Terms & Privacy</Text>
      </View>

      <TouchableOpacity style={styles.signUpButton} onPress={() => {
        if(!checked) {
          alert("You must agree with Terms & Privacy to sign up.");
          return; 
        }
        fetch("https://furniture.pnglin.byenoob.com/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            email: email,
            password: password
          })
        })
        .then((response) => {
            if (!response.ok) {
            return response.json().then((json) => {
              if (json && json.error) {
              alert(json.error);
              } else {
              alert(`Something went wrong. Status: ${response.status}`);
              }
              throw new Error(json && json.error ? json.error : `HTTP error! status: ${response.status}`);
            });
            }
          return response.json();
        })
        .then((json) => {
          if(json.error) {
            alert(json.error);
            return;
          }
          alert("Account created successfully!");
          go('/(auth)/signin');
        })
        .catch((error) => {
          console.error('Fetch error:', error);
        });
      }}>
      <Text style={styles.signUpButtonText}>Sign up</Text>
      </TouchableOpacity>

      <Text style={{textAlign: 'center', marginBottom: 20, color: '#4F63AC'}}>---------Or sign up with---------</Text>
    <TouchableOpacity style={styles.googleButton} onPress={() => {
      // Handle Google sign up
    }}>
      <Image
        source={require('../../assets/images/google-logo.png')}
        style={styles.googleLogo}
      />
    </TouchableOpacity>

      <Text style={{textAlign: 'center', color: '#4F63AC'}} onPress={() => {
        go('/(auth)/signin');
      }}>Already have an account? Sign in</Text>


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
