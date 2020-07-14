import { firebase } from '../firebaseconfig'

import React, { useState } from 'react'
import {
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    StyleSheet,
    Picker,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { db } from '../firebaseconfig.js'

export default function RegistrationScreen({ navigation }) {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [foodPreference, setFoodPreference] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const onFooterLinkPress = () => {
        // navigation.navigate('Login');
    }

    const onRegisterPress = () => {
        if (password !== confirmPassword) {
            alert('Please provide the correct credentials')
            return
        }
        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(async (response) => {
                db.collection('users')
                    .doc(response.user.uid)
                    .update({
                        firstName: firstName ? firstName : 'Mysterious Cook',
                        lastName: lastName ? lastName : '',
                        foodPreference: foodPreference
                            ? foodPreference.toString()
                            : 'vegan',
                    })
                console.log('check the database now')
                // uid = response.user.uid
            })
            .catch((error) => {
                alert(error)
            })
    }

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always"
            >
                <TextInput
                    style={styles.input}
                    placeholder="First Name"
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setFirstName(text)}
                    value={firstName}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Last Name"
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setLastName(text)}
                    value={lastName}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <Text
                    style={{
                        marginTop: 5,
                        marginBottom: 5,
                        marginLeft: 25,
                        marginRight: 30,
                        paddingLeft: 10,
                    }}
                >
                    Select your food preference:{' '}
                </Text>
                <Picker
                    style={styles.input}
                    placeholder="Food Preference"
                    placeholderTextColor="#aaaaaa"
                    selectedValue={foodPreference}
                    value="vegan"
                    onValueChange={(itemValue, itemIndex) =>
                        setFoodPreference(itemValue)
                    }
                >
                    <Picker.Item label="Vegan" value="vegan" />
                    <Picker.Item label="Meatlover" value="meatlover" />
                </Picker>
                <TextInput
                    style={styles.input}
                    placeholder="E-mail"
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder="Password"
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder="Confirm Password"
                    onChangeText={(text) => setConfirmPassword(text)}
                    value={confirmPassword}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onRegisterPress()}
                >
                    <Text style={styles.buttonTitle}>Create account</Text>
                </TouchableOpacity>

                <View style={styles.footerView}>
                    <Text style={styles.footerText}>
                        Already got an account?{' '}
                        <Text
                            onPress={onFooterLinkPress}
                            style={styles.footerLink}
                        >
                            Log in
                        </Text>
                    </Text>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop: 50,
    },
    title: {},
    logo: {
        flex: 1,
        height: 120,
        width: 90,
        alignSelf: 'center',
        margin: 30,
    },
    input: {
        height: 48,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 30,
        marginRight: 30,
        paddingLeft: 16,
    },
    button: {
        backgroundColor: '#788eec',
        marginLeft: 30,
        marginRight: 30,
        marginTop: 20,
        height: 48,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footerView: {
        flex: 1,
        alignItems: 'center',
        marginTop: 20,
    },
    footerText: {
        fontSize: 16,
        color: '#2e2e2d',
    },
    footerLink: {
        color: '#788eec',
        fontWeight: 'bold',
        fontSize: 16,
    },
})
