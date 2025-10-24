import { databases, Query } from '@/appwrite';
import { getDeviceId } from '@/utils/getDevice';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import type { Models } from "appwrite";
import { ID } from 'appwrite';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID_LOG!;

export default function Log() {
    const [logs, setLogs] = useState<Models.Document[]>([]);
    const [enableModal, setEnableModal] = useState(false);
    const [newLogTitle, setNewLogTitle] = useState("");
    const [newLogDescription, setNewLogDescription] = useState("");


    const fetchLogs = async() => {
        try{
          const deviceId = await getDeviceId();
          const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.equal("userId", deviceId)]);
          return response.documents;
        }
        catch(error){
          console.error("Error fetching medications", error);
          return [];
        }
    }

    const handleAddLog = async () => {
        try {
        const deviceId = await getDeviceId()
        await databases.createDocument(
            DATABASE_ID,
            COLLECTION_ID,
            ID.unique(), // Generates a unique ID for the new document
            {
            title: newLogTitle,
            description: newLogDescription,
            userId: deviceId, // Automatically includes the device ID
            },
        )
        // Clear input fields and close the modal
        setNewLogTitle("")
        setNewLogDescription("")
        setEnableModal(false)
        // Re-fetch logs to update the displayed list
        const updatedLogs = await fetchLogs()
        setLogs(updatedLogs)
        } catch (error) {
        console.error("Error adding log:", error)
        // You might want to add user-facing error feedback here
        }
    }

    useFocusEffect(
        useCallback(
          () => {
          const loadLogs = async() => {
            const logs = await fetchLogs();
            setLogs(logs);
        };
    
        loadLogs();
        }, [])
    );

    const deleteMedication = async (documentId: string) => {
        Alert.alert(
          "Delete Medication",
          "Are you sure you want to delete this medication?",
          [
            {text: "Cancel", style:"cancel"}, 
            {text: "Delete", style: "destructive",
              onPress: async() => {
                try {
                  await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, documentId);
                  setLogs((prev) => prev.filter((med) => med.$id !== documentId));
                }
                catch(error){
                  console.error("Error deleting medication: ", error);
                }
              }
            }
          ], 
          {cancelable: true}
        )
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Text style={styles.title}>Your Logs</Text>
            </View>
            <Text style={styles.subtitle}>Record Your Logs Here</Text>

            {logs.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIconContainer}>
                        <MaterialIcons name="book" size={64} color="#E0E7FF" />
                    </View>
                    <Text style={styles.emptyTitle}>No Logs Made Yet</Text>
                    <Text style={styles.emptySubtitle}>
                        Add your first log to track your symptoms and habits
                    </Text>
                    <TouchableOpacity onPress={() => setEnableModal(true)}>
                        <MaterialIcons name='add' size={24} style={styles.addIcon}></MaterialIcons>
                    </TouchableOpacity>
                </View>
            ) :

            (<ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                {logs.map((log, index) => (
                    <View key={index} style={styles.logItem}>
                        <View style={{flexDirection: "row"}}>
                            <Text style={styles.logTitle}>{log.title}</Text>
                            <TouchableOpacity 
                                onPress={() => deleteMedication(log.$id)}
                                style={{marginTop: 4, marginLeft: "auto"}}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="trash-outline" size={20} color="#EF4444"/>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.logDescription}>{log.description}</Text>
                    </View>
                ))}
                {/* Floating Action Button to add new logs when list is not empty */}
                <TouchableOpacity onPress={() => setEnableModal(true)} style={styles.fab}>
                    <MaterialIcons name="add" size={16} color="#FFF"></MaterialIcons>
                </TouchableOpacity>
            </ScrollView>)}

            <Modal
                animationType="slide" // Slide animation for the modal
                transparent={true} // Makes the background transparent
                visible={enableModal} // Controls modal visibility
                onRequestClose={() => setEnableModal(false)} // Handles Android back button
            >
                <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Add New Log</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Log Title"
                        placeholderTextColor="#64748B"
                        value={newLogTitle}
                        onChangeText={setNewLogTitle}
                        maxLength={30}
                        
                    />
                    <TextInput
                        style={[styles.input, styles.descriptionInput]}
                        placeholder="Log Description"
                        placeholderTextColor="#64748B"
                        value={newLogDescription}
                        onChangeText={setNewLogDescription}
                        multiline // Allows multiple lines of text
                        numberOfLines={4} // Sets initial number of lines
                    />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.button, styles.buttonClose]} onPress={() => setEnableModal(false)}>
                            <Text style={styles.textStyleCancel}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity disabled={!newLogTitle.trim() || !newLogDescription.trim()} style={[styles.button, styles.buttonSave]} onPress={handleAddLog}>
                            <Text style={styles.textStyle}>Save Log</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25,
    },
    title: {
        fontSize: 28,
        fontFamily: "Inter_600SemiBold",
        color: '#1E293B',
        textAlign: 'center',
    },
    subtitle: {
        fontFamily: "Inter_400Regular",
        textAlign: "center",
        fontSize: 14,
        marginBottom: 10,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 24,
        fontFamily: "Inter_600SemiBold",
        color: '#1E293B',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 16,
        fontFamily: "Inter_400Regular",
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 24,
    },
    addIcon: {
        backgroundColor:"#E0E7FF", 
        borderRadius: 50,
        marginTop: 10 
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)", // Semi-transparent overlay
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: "90%", // Modal width
        maxWidth: 400, // Max width for larger screens
    },
    modalTitle: {
        fontSize: 22,
        fontFamily: "Inter_600SemiBold",
        marginBottom: 20,
        color: "#1E293B",
    },
    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#CBD5E1",
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        fontFamily: "Inter_400Regular",
        fontSize: 16,
        color: "#1E293B",
    },
    descriptionInput: {
        height: 100, // Larger height for description input
        textAlignVertical: "top", // Aligns text to the top for multiline input
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 10,
    },
    button: {
        borderRadius: 8,
        padding: 12,
        elevation: 2,
        flex: 1, // Distributes space evenly between buttons
        marginHorizontal: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonClose: {
        backgroundColor: "#E2E8F0", // Light gray for cancel button
    },
    buttonSave: {
        backgroundColor: "#4F46E5", // Primary blue for save button
    },
    textStyle: {
        color: "white",
        fontFamily: "Inter_600SemiBold",
        textAlign: "center",
        fontSize: 16,
    },
    textStyleCancel: {
        color: "#1E293B", // Dark text for cancel button
        fontFamily: "Inter_600SemiBold",
        textAlign: "center",
        fontSize: 16,
    },
    // Styles for displaying existing logs
    logItem: {
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        padding: 15,
        marginHorizontal: 16,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    logTitle: {
        fontSize: 18,
        fontFamily: "Inter_600SemiBold",
        color: "#1E293B",
        marginBottom: 5,
    },
    logDescription: {
        fontSize: 14,
        fontFamily: "Inter_400Regular",
        color: "#64748B",
    },
    fab: {
        width: 28,
        height: 28,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#4F46E5", // Primary color for Floating Action Button
        borderRadius: 30,
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        marginLeft: 167,
    },
})