import { useState } from 'react';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../_layout';
import { COLORS, FONT } from '../../style/theme';

export default function PasswordScreen() {
	const router = useRouter();
	const { currentUser, updateProfile } = useAuth();

	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [saving, setSaving] = useState(false);
	const [authError, setAuthError] = useState('');

	const [errors, setErrors] = useState({
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	});

	async function handleSave() {
		setAuthError('');

		const newErrors = {
			currentPassword: '',
			newPassword: '',
			confirmPassword: '',
		};

		if (!currentPassword) {
			newErrors.currentPassword = 'Informe a senha atual.';
		}

		if (newPassword.trim().length < 6) {
			newErrors.newPassword = 'A nova senha precisa ter no minimo 6 caracteres.';
		}

		if (newPassword !== confirmPassword) {
			newErrors.confirmPassword = 'As senhas nao coincidem.';
		}

		setErrors(newErrors);

		if (newErrors.currentPassword || newErrors.newPassword || newErrors.confirmPassword) {
			return;
		}

		setSaving(true);

		try {
			await updateProfile({
				name: currentUser?.name,
				email: currentUser?.email,
				photo: currentUser?.photo,
				currentPassword,
				newPassword,
			});

			router.back();
		} catch (error) {
			setAuthError(error.message || 'Nao foi possivel alterar a senha.');
		} finally {
			setSaving(false);
		}
	}

	return (
		<SafeAreaView style={styles.safeArea}>
			<KeyboardAvoidingView
				style={styles.keyboard}
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}
			>
				<View style={styles.container}>
					<View style={styles.topBar}>
						<TouchableOpacity
							style={styles.backButton}
							onPress={() => router.back()}
						>
							<Ionicons name="chevron-back" size={28} color={COLORS.lightNeutral} />
						</TouchableOpacity>
					</View>

					<Text style={styles.title}>Trocar senha</Text>
					<Text style={styles.subtitle}>Atualize sua senha de acesso.</Text>

					<View style={styles.form}>
						<Text style={styles.label}>SENHA ATUAL</Text>
						<View style={styles.passwordField}>
							<TextInput
								style={styles.input}
								value={currentPassword}
								onChangeText={(text) => {
									setCurrentPassword(text);
									setErrors((prev) => ({ ...prev, currentPassword: '' }));
								}}
								secureTextEntry={!showCurrentPassword}
								placeholder="Digite sua senha atual"
								placeholderTextColor="rgba(255,255,255,0.55)"
							/>
							<TouchableOpacity style={styles.eyeButton} onPress={() => setShowCurrentPassword((value) => !value)}>
								<Ionicons name={showCurrentPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="rgba(255,255,255,0.7)" />
							</TouchableOpacity>
						</View>
						<Text style={styles.fieldError}>{errors.currentPassword || ' '}</Text>

						<Text style={styles.label}>NOVA SENHA</Text>
						<View style={styles.passwordField}>
							<TextInput
								style={styles.input}
								value={newPassword}
								onChangeText={(text) => {
									setNewPassword(text);
									setErrors((prev) => ({ ...prev, newPassword: '' }));
								}}
								secureTextEntry={!showNewPassword}
								placeholder="Digite a nova senha"
								placeholderTextColor="rgba(255,255,255,0.55)"
							/>
							<TouchableOpacity style={styles.eyeButton} onPress={() => setShowNewPassword((value) => !value)}>
								<Ionicons name={showNewPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="rgba(255,255,255,0.7)" />
							</TouchableOpacity>
						</View>
						<Text style={styles.fieldError}>{errors.newPassword || ' '}</Text>

						<Text style={styles.label}>CONFIRMAR NOVA SENHA</Text>
						<View style={styles.passwordField}>
							<TextInput
								style={styles.input}
								value={confirmPassword}
								onChangeText={(text) => {
									setConfirmPassword(text);
									setErrors((prev) => ({ ...prev, confirmPassword: '' }));
								}}
								secureTextEntry={!showConfirmPassword}
								placeholder="Repita a nova senha"
								placeholderTextColor="rgba(255,255,255,0.55)"
							/>
							<TouchableOpacity style={styles.eyeButton} onPress={() => setShowConfirmPassword((value) => !value)}>
								<Ionicons name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="rgba(255,255,255,0.7)" />
							</TouchableOpacity>
						</View>
						<Text style={styles.fieldError}>{errors.confirmPassword || ' '}</Text>

						{authError ? <Text style={styles.authError}>{authError}</Text> : null}

						<TouchableOpacity style={[styles.primaryButton, saving ? styles.primaryButtonDisabled : null]} onPress={handleSave} disabled={saving}>
							<Text style={styles.primaryButtonText}>{saving ? 'Salvando...' : 'Salvar senha'}</Text>
						</TouchableOpacity>
					</View>
				</View>
			</KeyboardAvoidingView>

			<StatusBar style="light" />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: { flex: 1, backgroundColor: COLORS.primary },
	keyboard: { flex: 1 },
	container: { flex: 1, padding: 28, paddingTop: 30 },
	topBar: { marginBottom: 18 },
	backButton: {
		width: 44,
		height: 44,
		borderRadius: 999,
		backgroundColor: 'rgba(255,255,255,0.1)',
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: { fontFamily: FONT.title, color: COLORS.lightNeutral, fontSize: 44, textTransform: 'uppercase' },
	subtitle: { fontFamily: FONT.body, color: COLORS.lightNeutral, opacity: 0.75, marginTop: 4 },
	form: { marginTop: 26 },
	label: { fontFamily: FONT.bodyBold, color: COLORS.lightNeutral, fontSize: 12, letterSpacing: 0.4, opacity: 0.9, marginBottom: 6 },
	passwordField: { position: 'relative' },
	input: { borderWidth: 1, borderColor: COLORS.lightNeutral, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 13, color: COLORS.lightNeutral, fontFamily: FONT.bodyBold, fontSize: 14 },
	eyeButton: { position: 'absolute', right: 14, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' },
	fieldError: { height: 20, color: '#ff4d6d', fontFamily: FONT.bodyBold, fontSize: 11, marginLeft: 4, marginTop: 2 },
	authError: { color: '#ff4d6d', fontFamily: FONT.bodyBold, fontSize: 12, textAlign: 'center', marginTop: 8, marginBottom: 8 },
	primaryButton: { backgroundColor: COLORS.lightNeutral, borderRadius: 99, paddingVertical: 10, alignItems: 'center', marginTop: 6 },
	primaryButtonDisabled: { opacity: 0.7 },
	primaryButtonText: { color: COLORS.primary, fontFamily: FONT.bodyBold, fontSize: 16, textTransform: 'uppercase' },
});
