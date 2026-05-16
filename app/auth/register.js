import { useRef, useState } from 'react';
import { Image } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

import {
	Animated,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
	ScrollView,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../_layout';
import { COLORS, FONT } from '../../style/theme';

function isValidEmail(email) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function FloatingInput({
	label,
	value,
	onChangeText,
	secureTextEntry,
	keyboardType,
	autoCapitalize,
	error,
}) {
	const [focused, setFocused] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const animation = useRef(new Animated.Value(value ? 1 : 0)).current;

	function handleFocus() {
		setFocused(true);

		Animated.timing(animation, {
			toValue: 1,
			duration: 180,
			useNativeDriver: false,
		}).start();
	}

	function handleBlur() {
		setFocused(false);

		if (!value) {
			Animated.timing(animation, {
				toValue: 0,
				duration: 180,
				useNativeDriver: false,
			}).start();
		}
	}

	const labelStyle = {
		top: animation.interpolate({
			inputRange: [0, 1],
			outputRange: [15, -9],
		}),
		fontSize: animation.interpolate({
			inputRange: [0, 1],
			outputRange: [14, 11],
		}),
		color: error
			? '#ff4d6d'
			: animation.interpolate({
					inputRange: [0, 1],
					outputRange: ['rgba(255,255,255,0.7)', COLORS.secondary],
			  }),
	};

	return (
		<View style={styles.inputWrapper}>
			<View
				style={[
					styles.inputContainer,
					focused && styles.inputContainerFocused,
					error && styles.inputContainerError,
				]}
			>
				<Animated.Text style={[styles.label, labelStyle]}>
					{label}
				</Animated.Text>

				<TextInput
					style={[
						styles.input,
						secureTextEntry && styles.passwordInput,
					]}
					value={value}
					onChangeText={onChangeText}
					onFocus={handleFocus}
					onBlur={handleBlur}
					secureTextEntry={secureTextEntry && !showPassword}
					keyboardType={keyboardType}
					autoCapitalize={autoCapitalize}
				/>

				{secureTextEntry ? (
					<TouchableOpacity
						style={styles.eyeButton}
						onPress={() => setShowPassword(!showPassword)}
					>
						<Ionicons
							name={showPassword ? 'eye-off-outline' : 'eye-outline'}
							size={22}
							color="rgba(255,255,255,0.7)"
						/>
					</TouchableOpacity>
				) : null}
			</View>

			<View style={styles.errorContainer}>
				<Text style={styles.inputError}>{error || ' '}</Text>
			</View>
		</View>
	);
}

export default function RegisterScreen() {
	const router = useRouter();
	const { signUp } = useAuth();

	const [photo, setPhoto] = useState(null);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const [errors, setErrors] = useState({
		name: '',
		email: '',
		password: '',
	});
	const [authError, setAuthError] = useState('');

	async function handlePickImage() {
		const permission =
			await ImagePicker.requestMediaLibraryPermissionsAsync();

		if (!permission.granted) {
			alert('Permita o acesso à galeria para escolher uma foto.');
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

	const handleRegister = async () => {
		setAuthError('');

		const newErrors = {
			name: '',
			email: '',
			password: '',
		};

		if (name.trim().length < 3) {
			newErrors.name = 'Nome muito curto.';
		}

		if (!isValidEmail(email)) {
			newErrors.email = 'E-mail inválido.';
		}

		if (password.trim().length < 6) {
			newErrors.password = 'Mínimo de 6 caracteres.';
		}

		setErrors(newErrors);

		if (newErrors.name || newErrors.email || newErrors.password) {
			return;
		}

		try {
			await signUp({
				name,
				email,
				password,
				photo,
			});

			router.replace('/tab/search');
		} catch (error) {
			setAuthError(error.message || 'Nao foi possivel criar a conta.');
		}
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<KeyboardAvoidingView
				style={styles.keyboard}
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			>
				<ScrollView
					contentContainerStyle={styles.container}
					showsVerticalScrollIndicator={false}
				>
					<View style={styles.card}>
						<Text style={styles.title}>Criar conta</Text>

						<Text style={styles.subtitle}>
							Cadastre um usuário válido para liberar o acesso.
						</Text>

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

						<Text style={styles.photoText}>
							Adicionar foto de perfil
						</Text>

						<View style={styles.form}>
							<FloatingInput
								label="NOME"
								value={name}
								onChangeText={(text) => {
									setName(text);
									setErrors((prev) => ({
										...prev,
										name: '',
									}));
								}}
								error={errors.name}
							/>

							<FloatingInput
								label="E-MAIL"
								value={email}
								onChangeText={(text) => {
									setEmail(text);
									setErrors((prev) => ({
										...prev,
										email: '',
									}));
								}}
								autoCapitalize="none"
								keyboardType="email-address"
								error={errors.email}
							/>

							<FloatingInput
								label="SENHA"
								value={password}
								onChangeText={(text) => {
									setPassword(text);
									setErrors((prev) => ({
										...prev,
										password: '',
									}));
								}}
								secureTextEntry
								error={errors.password}
							/>

							<TouchableOpacity
								style={styles.primaryButton}
								onPress={handleRegister}
							>
								<Text style={styles.primaryButtonText}>
									Cadastrar e entrar
								</Text>
							</TouchableOpacity>

							{authError ? (
								<Text style={styles.authError}>{authError}</Text>
							) : null}

							<TouchableOpacity onPress={() => router.back()}>
								<Text style={styles.link}>
									Voltar para login
								</Text>
							</TouchableOpacity>
						</View>
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
		padding: 36,
		justifyContent: 'center',
	},

	title: {
		fontFamily: FONT.title,
		color: COLORS.lightNeutral,
		fontSize: 46,
		textTransform: 'uppercase',
	},

	subtitle: {
		fontFamily: FONT.body,
		color: COLORS.lightNeutral,
		opacity: 0.8,
		marginTop: 4,
	},

	photoWrapper: {
		width: 106,
		height: 106,
		borderRadius: 999,
		alignSelf: 'center',
		marginTop: 34,
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
		marginTop: 30,
		gap: 6,
	},

	inputWrapper: {
		width: '100%',
	},

	inputContainer: {
		position: 'relative',
		borderWidth: 1,
		borderColor: COLORS.lightNeutral,
		borderRadius: 8,
	},

	inputContainerFocused: {
		borderColor: COLORS.secondary,
	},

	inputContainerError: {
		borderColor: '#ff4d6d',
	},

	label: {
		position: 'absolute',
		left: 14,
		backgroundColor: COLORS.primary,
		paddingHorizontal: 5,
		fontFamily: FONT.bodyBold,
		zIndex: 2,
	},

	input: {
		color: COLORS.lightNeutral,
		paddingHorizontal: 16,
		paddingVertical: 15,
		fontFamily: FONT.body,
		fontSize: 14,
	},

	passwordInput: {
		paddingRight: 54,
	},

	eyeButton: {
		position: 'absolute',
		right: 16,
		top: 0,
		bottom: 0,
		justifyContent: 'center',
		alignItems: 'center',
	},

	errorContainer: {
		height: 20,
		justifyContent: 'center',
	},

	inputError: {
		color: '#ff4d6d',
		fontFamily: FONT.bodyBold,
		fontSize: 11,
		marginLeft: 4,
	},

	primaryButton: {
		backgroundColor: COLORS.lightNeutral,
		borderRadius: 99,
		paddingVertical: 8,
		alignItems: 'center',
		marginTop: 8,
	},

	primaryButtonText: {
		color: COLORS.primary,
		fontFamily: FONT.bodyBold,
		fontSize: 16,
		textTransform: 'uppercase',
	},

	authError: {
		marginTop: 10,
		color: '#ff4d6d',
		fontFamily: FONT.bodyBold,
		fontSize: 12,
		textAlign: 'center',
	},

	link: {
		color: COLORS.lightNeutral,
		fontFamily: FONT.bodyBold,
		textAlign: 'center',
		opacity: 0.85,
		textTransform: 'uppercase',
		marginTop: 20,
	},
});