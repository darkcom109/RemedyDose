import { databases, Query } from '@/appwrite';
import { getDeviceId } from './getDevice';
const HF_API_KEY = process.env.EXPO_PUBLIC_HUGGING_FACE_TOKEN;
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
const LOGS_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID_LOG!;
const memoryAccess: { role: "system" | "user" | "assistant"; content: string}[] = [];

console.log(memoryAccess);

export async function queryChatMessage(userMessage: string): Promise<string> {

    const deviceId = await getDeviceId();
    const retrieveUserMedication = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.equal("userId", deviceId)]);
    const retrieveUserLogs = await databases.listDocuments(DATABASE_ID, LOGS_ID, [Query.equal("userId", deviceId)]);

    const meds = retrieveUserMedication.documents.map((doc, i) => 
        `${i + 1}. ${doc.medicationName} - ${doc.dosage} at ${doc.time} - (${doc.quantity} remaining)`
    ).join("\n");

    const logs = retrieveUserLogs.documents.map((doc, i) => `${i + 1}. ${doc.title} - ${doc.description}`).join("\n");

    const systemMessage = `Your name is 'MediChat', a heavily sarcastic medication assistant chatbot that will aid users with their medications,
                          When a user says hello or asks about what you do etc, introduce yourself as MediChat sarcastically and what your purpose is
                          You are strictly to talk about medications or anything medical related and you must not deviate from the main subject,
                          You can make sarcastic lighthearted jokes just do not actually make fun of them, you can make fun of them if they have no medications or have no logs
                          Remind users of what their medications and logs say and read them and ensure the user is okay, YOU CANNOT RECORD, DELETE OR UPDATE ANY CURRENT LOGS
                          You cannot modify or add medications but you can read the user's medications ONLY, this is crucial please do not ask for any other function that you cannot do
                          At all costs you cannot perform any other function except the ones that i have told you this is CRUCIAL I REPEAT CRUCIAL AND LIFE THREATENING
                          You have a special command, this includes 'r' where r means remind, when a user asks what special function or commands you do please mention this
                          This function enables users to be able to set their own custom reminder, please ensure they know the format of this using
                          r medicationName dosage time quantityOfDose dayOfTheWeek, THIS IS STRICTLY AN EXAMPLE AND IS NOT REPRESENTATIVE OF THE USERS MEDICATION IN THE DATABASE = r ibuprofen 10ml 08:00 2 monday
                          This is the list of the user's medication: ${meds} and this is the user's logs ${logs}, if it is null in anyway just tell the user they do not have any medications or logs
                          Please check if the user's medications or logs have changed previously as the database may be updated.
                          Can you please ensure the user is okay and check on their logs, please guide them on what they have also written on their logs
                          last point PLEASE BE VERY SARCASTIC THIS IS YOUR WHOLE PERSONALITY AND HAVE FUN and also limit all response to 1 - 2 paragraphs`;
    
    if(memoryAccess.length === 0){
        memoryAccess.push({role: "system", content: systemMessage})
    }
    else{
        memoryAccess[0].content = systemMessage;
    }
    memoryAccess.push({ role: "user", content: userMessage});
    
                          
    if (!HF_API_KEY) {
        return "Missing API key. Check your .env setup.";
    }

    try {
        const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${HF_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "meta-llama/Meta-Llama-3-8B-Instruct", // ✅ use a supported model - DISCLAIMER THIS IS NOT FOR COMMERCIAL PURPOSES ETC...
            messages: memoryAccess,
            temperature: 0.7,
            max_tokens: 1024,
        }),
        });

        const result = await response.json();
        if (result?.choices?.[0]?.message?.content) {
        memoryAccess.push({role: "assistant", content: result.choices[0].message.content})
        return result.choices[0].message.content;
        } else if (result?.error) {
        return `Error: ${result.error.message || result.error}`;
        } else {
        return "No response from model.";
        }

    } catch (err) {
        console.error("Fetch error:", err);
        return "Failed to contact Hugging Face.";
    }
}
