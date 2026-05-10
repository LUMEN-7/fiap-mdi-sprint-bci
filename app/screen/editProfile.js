import { useEffect, useState } from 'react';
import { Image } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../_layout';
import { COLORS, FONT } from '../../style/theme';

function isValidEmail(email) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function EditProfileScreen() {
	const router = useRouter();
	const { currentUser, updateProfile } = useAuth();

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [photo, setPhoto] = useState(null);
	const [saving, setSaving] = useState(false);
	const [authError, setAuthError] = useState('');

	const [errors, setErrors] = useState({
		name: '',
		email: '',
	});

	useEffect(() => {
		setName(currentUser?.name || '');
		setEmail(currentUser?.email || '');
		setPhoto(currentUser?.photo || null);
	}, [currentUser]);

	async function handlePickImage() {
		const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

		if (!permission.granted) {
			alert('Permita o acesso a galeria para escolher uma foto.');
			return;
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.8,
		});

		if (!result.canceled) {
			setPhoto(result.assets[0].uri);
		}
	}

	async function handleSave() {
		setAuthError('');

		const newErrors = {
			name: '',
			email: '',
		};

		if (name.trim().length < 3) {
			newErrors.name = 'Nome muito curto.';
		}

		if (!isValidEmail(email)) {
			newErrors.email = 'E-mail invalido.';
		}

		setErrors(newErrors);

		if (newErrors.name || newErrors.email) {
			return;
		}

		setSaving(true);

		try {
			await updateProfile({
				name,
				email,
				photo,
			});

			router.back();
		} catch (error) {
			setAuthError(error.message || 'Nao foi possivel salvar o perfil.');
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
				<ScrollView
					contentContainerStyle={styles.container}
					showsVerticalScrollIndicator={false}
				>
					<View style={styles.topBar}>
						<TouchableOpacity
							style={styles.backButton}
							onPress={() => router.back()}
						>
							<Ionicons
								name="chevron-back"
								size={28}
								color={COLORS.lightNeutral}
							/>
						</TouchableOpacity>
					</View>

					<Text style={styles.title}>Editar perfil</Text>
					<Text style={styles.subtitle}>Atualize seus dados da conta.</Text>

					<TouchableOpacity
						style={styles.photoWrapper}
						onPress={handlePickImage}
					>
						{photo ? (
							<Image
								source={{ uri: photo }}
								style={styles.profilePhoto}
							/>
						) : (
							<View style={styles.photoPlaceholder}>
								<Ionicons
									name="person-outline"
									size={38}
									color={COLORS.lightNeutral}
								/>
							</View>
						)}

						<View style={styles.cameraButton}>
							<Ionicons
								name="camera-outline"
								size={18}
								color={COLORS.lightNeutral}
							/>
						</View>
					</TouchableOpacity>

					<Text style={styles.photoText}>Trocar foto de perfil</Text>

					<View style={styles.form}>
						<Text style={styles.label}>NOME</Text>
						<TextInput
							style={[styles.input, errors.name ? styles.inputErrorBorder : null]}
							value={name}
							onChangeText={(text) => {
								setName(text);
								setErrors((prev) => ({ ...prev, name: '' }));
							}}
							placeholder="Seu nome"
							placeholderTextColor="rgba(255,255,255,0.55)"
						/>
						<Text style={styles.fieldError}>{errors.name || ' '}</Text>

						<Text style={styles.label}>E-MAIL</Text>
						<TextInput
							style={[styles.input, errors.email ? styles.inputErrorBorder : null]}
							value={email}
							onChangeText={(text) => {
								setEmail(text);
								setErrors((prev) => ({ ...prev, email: '' }));
							}}
							autoCapitalize="none"
							keyboardType="email-address"
							placeholder="seu@email.com"
							placeholderTextColor="rgba(255,255,255,0.55)"
						/>
						<Text style={styles.fieldError}>{errors.email || ' '}</Text>

						{authError ? (
							<Text style={styles.authError}>{authError}</Text>
						) : null}

						<TouchableOpacity
							style={[styles.primaryButton, saving ? styles.primaryButtonDisabled : null]}
							onPress={handleSave}
							disabled={saving}
						>
							<Text style={styles.primaryButtonText}>
								{saving ? 'Salvando...' : 'Salvar alteracoes'}
							</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>

			<StatusBar style="light" />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: COLORS.primary,
	},

	keyboard: {
		flex: 1,
	},

	container: {
		flexGrow: 1,
		padding: 28,
		paddingTop: 30,
		paddingBottom: 50,
	},

	topBar: {
		marginBottom: 18,
	},

	backButton: {
		width: 44,
		height: 44,
		borderRadius: 999,
		backgroundColor: 'rgba(255,255,255,0.1)',
		alignItems: 'center',
		justifyContent: 'center',
	},

	title: {
		fontFamily: FONT.title,
		color: COLORS.lightNeutral,
		fontSize: 44,
		textTransform: 'uppercase',
	},

	subtitle: {
		fontFamily: FONT.body,
		color: COLORS.lightNeutral,
		opacity: 0.75,
		marginTop: 4,
	},

	photoWrapper: {
		width: 106,
		height: 106,
		borderRadius: 999,
		alignSelf: 'center',
		marginTop: 28,
		position: 'relative',
	},

	profilePhoto: {
		width: 106,
		height: 106,
		borderRadius: 999,
		borderWidth: 2,
		borderColor: COLORS.secondary,
	},

	photoPlaceholder: {
		width: 106,
		height: 106,
		borderRadius: 999,
		backgroundColor: 'rgba(255,255,255,0.08)',
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.24)',
		alignItems: 'center',
		justifyContent: 'center',
	},

	cameraButton: {
		position: 'absolute',
		right: 0,
		bottom: 2,
		width: 34,
		height: 34,
		borderRadius: 999,
		backgroundColor: COLORS.secondary,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 3,
		borderColor: COLORS.primary,
	},

	photoText: {
		fontFamily: FONT.bodyBold,
		color: COLORS.lightNeutral,
		textAlign: 'center',
		textTransform: 'uppercase',
		fontSize: 11,
		opacity: 0.75,
		marginTop: 12,
	},

	form: {
		marginTop: 26,
	},

	label: {
		fontFamily: FONT.bodyBold,
		color: COLORS.lightNeutral,
		fontSize: 12,
		letterSpacing: 0.4,
		opacity: 0.9,
		marginBottom: 6,
	},

	input: {
		borderWidth: 1,
		borderColor: COLORS.lightNeutral,
		borderRadius: 8,
		paddingHorizontal: 14,
		paddingVertical: 13,
		color: COLORS.lightNeutral,
		fontFamily: FONT.bodyBold,
		fontSize: 14,
	},

	inputErrorBorder: {
		borderColor: '#ff4d6d',
	},

	fieldError: {
		height: 20,
		color: '#ff4d6d',
		fontFamily: FONT.bodyBold,
		fontSize: 11,
		marginLeft: 4,
		marginTop: 2,
	},

	authError: {
		color: '#ff4d6d',
		fontFamily: FONT.bodyBold,
		fontSize: 12,
		textAlign: 'center',
		marginBottom: 8,
	},

	primaryButton: {
		backgroundColor: COLORS.lightNeutral,
		borderRadius: 99,
		paddingVertical: 10,
		alignItems: 'center',
		marginTop: 6,
	},

	primaryButtonDisabled: {
		opacity: 0.7,
	},

	primaryButtonText: {
		color: COLORS.primary,
		fontFamily: FONT.bodyBold,
		fontSize: 16,
		textTransform: 'uppercase',
	},
});
