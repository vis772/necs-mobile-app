import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageCircle, Send } from 'lucide-react-native';
import GameSelector from '@/components/GameSelector';
import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import { GAMES } from '@/constants/games';

const initialMessages = [
  { id: '1', user: 'Player1', message: 'That was an insane play!', time: '2:34 PM', game: 'valorant', isOwn: false },
  { id: '2', user: 'EsportsFan', message: 'Best tournament so far', time: '2:35 PM', game: 'valorant', isOwn: false },
  { id: '3', user: 'ProGamer', message: 'The clutch was incredible', time: '2:36 PM', game: 'valorant', isOwn: false },
  { id: '4', user: 'SmashMain', message: 'Fox vs Kirby is heating up!', time: '2:37 PM', game: 'smash', isOwn: false },
  { id: '5', user: 'RLfanatic', message: 'That aerial shot was perfect', time: '2:38 PM', game: 'rocketleague', isOwn: false },
];

type Message = {
  id: string;
  user: string;
  message: string;
  time: string;
  game: string;
  isOwn: boolean;
};

export default function ChatScreen() {
  const { selectedGame } = useApp();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const scrollViewRef = useRef<ScrollView>(null);
  
  const filteredMessages = messages.filter(msg => msg.game === selectedGame);
  const currentGame = GAMES.find(g => g.id === selectedGame);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [filteredMessages.length]);

  const handleSendMessage = () => {
    if (message.trim().length === 0) return;
    
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    
    const newMessage: Message = {
      id: Date.now().toString(),
      user: 'You',
      message: message.trim(),
      time: timeString,
      game: selectedGame,
      isOwn: true,
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessage('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <MessageCircle size={28} color={Colors.accent} />
          <Text style={styles.headerTitle}>Community Chat</Text>
        </View>
      </SafeAreaView>

      <GameSelector />

      <ScrollView 
        ref={scrollViewRef}
        style={styles.content} 
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.channelBanner}>
          <Text style={styles.channelIcon}>{currentGame?.icon}</Text>
          <Text style={styles.channelName}>{currentGame?.name} Chat</Text>
          <Text style={styles.channelDescription}>
            Discuss live matches, strategies, and highlights
          </Text>
        </View>

        {filteredMessages.map((msg) => (
          <View key={msg.id} style={[
            styles.messageCard,
            msg.isOwn && styles.messageCardOwn
          ]}>
            <View style={styles.messageHeader}>
              <View style={[
                styles.avatar,
                msg.isOwn && styles.avatarOwn
              ]}>
                <Text style={styles.avatarText}>{msg.user[0]}</Text>
              </View>
              <View style={styles.messageInfo}>
                <Text style={[
                  styles.username,
                  msg.isOwn && styles.usernameOwn
                ]}>{msg.user}</Text>
                <Text style={styles.timestamp}>{msg.time}</Text>
              </View>
            </View>
            <Text style={styles.messageText}>{msg.message}</Text>
          </View>
        ))}
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={Colors.gray}
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <TouchableOpacity 
            style={styles.sendButton}
            onPress={handleSendMessage}
            disabled={message.trim().length === 0}
          >
            <Send size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  safeArea: {
    backgroundColor: Colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.white,
  },
  content: {
    flex: 1,
  },
  messagesList: {
    padding: 20,
    paddingBottom: 100,
  },
  channelBanner: {
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.darkGray,
  },
  channelIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  channelName: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 6,
  },
  channelDescription: {
    fontSize: 13,
    color: Colors.gray,
    textAlign: 'center',
  },
  messageCard: {
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.darkGray,
  },
  messageCardOwn: {
    backgroundColor: '#1a3a52',
    borderColor: Colors.accent,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarOwn: {
    backgroundColor: Colors.accent,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.white,
  },
  messageInfo: {
    flex: 1,
  },
  username: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
  usernameOwn: {
    color: Colors.accent,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 2,
  },
  messageText: {
    fontSize: 14,
    color: Colors.white,
    lineHeight: 20,
  },
  inputContainer: {
    backgroundColor: Colors.primary,
    borderTopWidth: 1,
    borderTopColor: Colors.secondary,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.secondary,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: Colors.white,
    fontSize: 15,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: Colors.darkGray,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
