import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { back } from '../router';

const categories = [
    { key: 'CHAIR', label: 'Chair' },
    { key: 'TABLE', label: 'Table' },
    { key: 'SOFA', label: 'Sofa' },
    { key: 'BED', label: 'Bed' },
    { key: 'LAMP', label: 'Lamp' },
];

export default function NewListingScreen() {
    const [photos, setPhotos] = useState<string[]>([]);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [showCategoryPicker, setShowCategoryPicker] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 0.8,
        });
        if (!result.canceled && result.assets.length > 0) {
            setPhotos((prev) => [...prev, result.assets[0].uri]);
        }
    };

    const removePhoto = (index: number) => {
        setPhotos((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!title.trim()) {
            Alert.alert('Error', 'Please enter a title');
            return;
        }
        if (!category) {
            Alert.alert('Error', 'Please select a category');
            return;
        }
        if (!price.trim() || isNaN(Number(price))) {
            Alert.alert('Error', 'Please enter a valid price');
            return;
        }

        setSubmitting(true);
        try {
            const token = await AsyncStorage.getItem('token');

            const body: any = {
                name: title.trim(),
                category,
                price: Number(price),
                description: description.trim(),
            };

            if (photos.length > 0) {
                for (const uri of photos) {
                    const response = await fetch(uri);
                    const blob = await response.blob();
                    const reader = new FileReader();
                    const base64 = await new Promise<string>((resolve, reject) => {
                        reader.onloadend = () => resolve(reader.result as string);
                        reader.onerror = reject;
                        reader.readAsDataURL(blob);
                    });
                    body.image_url = base64;
                    break; // Demo, first photo only
                }
            }

            const response = await fetch('https://furniture.pnglin.byenoob.com/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token ?? ''}`,
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.error || 'Failed to create listing');
            }

            Alert.alert('Success', 'Listing created!', [
                { text: 'OK', onPress: () => back() },
            ]);
        } catch (err: any) {
            Alert.alert('Error', err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const selectedCategoryLabel = categories.find((c) => c.key === category)?.label ?? '';

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.headerContainer}>
                    <TouchableOpacity style={styles.backButton} onPress={() => back()}>
                        <Ionicons name="chevron-back" size={22} color="#4F63AC" />
                    </TouchableOpacity>
                    <Text style={styles.header}>Create a new listing</Text>
                    <View style={{ width: 44 }} />
                </View>

                {/* Upload photos */}
                <Text style={styles.sectionLabel}>Upload photos</Text>
                <View style={styles.photosRow}>
                    <TouchableOpacity style={styles.addPhotoButton} onPress={pickImage}>
                        <Ionicons name="add" size={32} color="#4F63AC" />
                    </TouchableOpacity>
                    {photos.map((uri, index) => (
                        <View key={index} style={styles.photoWrapper}>
                            <Image source={{ uri }} style={styles.photoThumb} />
                            <TouchableOpacity
                                style={styles.removePhotoButton}
                                onPress={() => removePhoto(index)}
                            >
                                <Ionicons name="close-circle" size={20} color="#4F63AC" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                {/* Title */}
                <Text style={styles.fieldLabel}>Title</Text>
                <View style={styles.inputCard}>
                    <TextInput
                        style={styles.input}
                        placeholder="Listing Title"
                        placeholderTextColor="#aaa"
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>

                {/* Category */}
                <Text style={styles.fieldLabel}>Category</Text>
                <TouchableOpacity
                    style={styles.inputCard}
                    onPress={() => setShowCategoryPicker(!showCategoryPicker)}
                >
                    <Text style={[styles.input, !category && { color: '#aaa' }]}>
                        {selectedCategoryLabel || 'Select the category'}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color="#999" />
                </TouchableOpacity>
                {showCategoryPicker && (
                    <View style={styles.pickerDropdown}>
                        {categories.map((cat) => (
                            <TouchableOpacity
                                key={cat.key}
                                style={[
                                    styles.pickerItem,
                                    category === cat.key && styles.pickerItemSelected,
                                ]}
                                onPress={() => {
                                    setCategory(cat.key);
                                    setShowCategoryPicker(false);
                                }}
                            >
                                <Text
                                    style={[
                                        styles.pickerItemText,
                                        category === cat.key && styles.pickerItemTextSelected,
                                    ]}
                                >
                                    {cat.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {/* Price */}
                <Text style={styles.fieldLabel}>Price</Text>
                <View style={styles.inputCard}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter price in USD"
                        placeholderTextColor="#aaa"
                        keyboardType="numeric"
                        value={price}
                        onChangeText={setPrice}
                    />
                </View>

                {/* Description */}
                <Text style={styles.fieldLabel}>Description</Text>
                <View style={[styles.inputCard, { alignItems: 'flex-start', minHeight: 120 }]}>
                    <TextInput
                        style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                        placeholder="Tell us more..."
                        placeholderTextColor="#aaa"
                        multiline
                        value={description}
                        onChangeText={setDescription}
                    />
                </View>

                {/* Submit */}
                <TouchableOpacity
                    style={[styles.submitButton, submitting && { opacity: 0.6 }]}
                    onPress={handleSubmit}
                    disabled={submitting}
                >
                    {submitting ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.submitText}>Submit</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    scrollView: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
        marginBottom: 24,
    },
    backButton: {
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
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Montserrat',
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10,
    },
    photosRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 20,
    },
    addPhotoButton: {
        width: 70,
        height: 70,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: '#4F63AC',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8ff',
    },
    photoWrapper: {
        position: 'relative',
    },
    photoThumb: {
        width: 70,
        height: 70,
        borderRadius: 10,
        backgroundColor: '#f5f5f5',
    },
    removePhotoButton: {
        position: 'absolute',
        top: -6,
        right: -6,
    },
    fieldLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4F63AC',
        marginBottom: 8,
    },
    inputCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginBottom: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#222',
    },
    pickerDropdown: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginTop: -10,
        marginBottom: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
        overflow: 'hidden',
    },
    pickerItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    pickerItemSelected: {
        backgroundColor: '#f0f2ff',
    },
    pickerItemText: {
        fontSize: 15,
        color: '#333',
    },
    pickerItemTextSelected: {
        color: '#4F63AC',
        fontWeight: '600',
    },
    submitButton: {
        backgroundColor: '#4F63AC',
        borderRadius: 10,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 10,
    },
    submitText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: 'bold',
    },
});
