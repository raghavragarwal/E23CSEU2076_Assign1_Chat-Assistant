import React, { useState } from 'react';
import axios from 'axios';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
};

export default function HomeScreen() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<Message[]>([]);

  const sendMessage = async () => {
  if (!message.trim()) return;

  const userMessage: Message = {
    id: Date.now().toString(),
    text: message,
    sender: 'user',
  };

  setChat(prev => [...prev, userMessage]);

  const userQuery = message;
  setMessage('');

  try {
    const response = await axios.post(
      'http://10.12.22.71:5000/chat',
      { message: userQuery }
    );

    const botMessage: Message = {
      id: Date.now().toString(),
      text: response.data.reply,
      sender: 'bot',
    };

    setChat(prev => [...prev, botMessage]);
  } catch (error) {
    console.error('Backend error:', error);
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chat Assistant</Text>

      <FlatList
        data={chat}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={
              item.sender === 'user'
                ? styles.userBubble
                : styles.botBubble
            }
          >
            <Text>{item.text}</Text>
          </View>
        )}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={message}
          onChangeText={setMessage}
        />

        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#b14242',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '80%',
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5EA',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '80%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 20,
  },
  sendText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
