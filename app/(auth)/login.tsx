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

export default function LoginScreen() {
  const { signInWithEmail, signInAsGuest } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);
    try {
      await signInWithEmail(email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Erreur de connexion', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    try {
      await signInAsGuest();
      router.replace('/(tabs)');
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
        {/* Logo & Title */}
        <View style={styles.header}>
          <Text style={styles.logo}>👑</Text>
          <Text style={styles.title}>Kingdom Clash</Text>
          <Text style={styles.subtitle}>Connectez-vous pour jouer</Text>
        </View>

        {/* Login Form */}
        <Card variant="elevated" padding="lg" style={styles.card}>
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

          <Button
            title="Se connecter"
            onPress={handleEmailLogin}
            loading={isLoading}
            fullWidth
          />

          <Link href="/(auth)/register" asChild>
            <Text style={styles.link}>Pas encore de compte ? S'inscrire</Text>
          </Link>
        </Card>

        {/* Guest Option */}
        <View style={styles.guestSection}>
          <Text style={styles.orText}>ou</Text>
          <Button
            title="Jouer en tant qu'invité"
            onPress={handleGuestLogin}
            variant="secondary"
            fullWidth
            loading={isLoading}
          />
          <Text style={styles.guestNote}>
            Vous pourrez créer un compte plus tard
          </Text>
        </View>
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
  guestSection: {
    marginTop: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
  },
  orText: {
    ...typography.body,
    color: colors.navy[400],
  },
  guestNote: {
    ...typography.caption,
    color: colors.navy[500],
  },
});
