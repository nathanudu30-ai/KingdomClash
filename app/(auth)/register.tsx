import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { Button, Card } from '@/components/ui';
import { useAuth } from '@/lib/auth';

export default function RegisterScreen() {
  const { signUpWithEmail } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (username.length < 3) {
      Alert.alert('Erreur', 'Le pseudo doit faire au moins 3 caractères');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit faire au moins 6 caractères');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    setIsLoading(true);
    try {
      await signUpWithEmail(email, password, username);
      Alert.alert(
        'Inscription réussie',
        'Vérifiez votre email pour confirmer votre compte',
        [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
      );
    } catch (error: any) {
      Alert.alert('Erreur', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>👑</Text>
          <Text style={styles.title}>Créer un compte</Text>
          <Text style={styles.subtitle}>Rejoignez Kingdom Clash</Text>
        </View>

        {/* Register Form */}
        <Card variant="elevated" padding="lg" style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Pseudo"
            placeholderTextColor={colors.navy[400]}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            maxLength={20}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={colors.navy[400]}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            placeholderTextColor={colors.navy[400]}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TextInput
            style={styles.input}
            placeholder="Confirmer le mot de passe"
            placeholderTextColor={colors.navy[400]}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <Button
            title="S'inscrire"
            onPress={handleRegister}
            loading={isLoading}
            fullWidth
          />

          <Link href="/(auth)/login" asChild>
            <Text style={styles.link}>Déjà un compte ? Se connecter</Text>
          </Link>
        </Card>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.navy[900],
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logo: {
    fontSize: 64,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.h1,
    color: colors.white,
  },
  subtitle: {
    ...typography.body,
    color: colors.navy[400],
    marginTop: spacing.xs,
  },
  card: {
    gap: spacing.md,
  },
  input: {
    backgroundColor: colors.navy[700],
    borderRadius: 12,
    padding: spacing.md,
    color: colors.white,
    fontSize: 16,
  },
  link: {
    ...typography.body,
    color: colors.primary[400],
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
