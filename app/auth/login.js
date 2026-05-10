import { useRef, useState } from 'react';
import { Image } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
	Animated,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';

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
			outputRange: [17, -9],
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
					style={styles.input}
					value={value}
					onChangeText={onChangeText}
					onFocus={handleFocus}
					onBlur={handleBlur}
					secureTextEntry={secureTextEntry}
					keyboardType={keyboardType}
					autoCapitalize={autoCapitalize}
				/>
			</View>

			{error ? <Text style={styles.inputError}>{error}</Text> : null}
		</View>
	);
}

export default function LoginScreen() {
	const router = useRouter();
	const { signIn } = useAuth();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const [errors, setErrors] = useState({
		email: '',
		password: '',
	});

	const handleLogin = async () => {
		const newErrors = {
			email: '',
			password: '',
		};

		if (!isValidEmail(email)) {
			newErrors.email = 'E-mail não existe ou está inválido.';
		}

		if (password.trim().length < 6) {
			newErrors.password = 'Senha incorreta.';
		}

		setErrors(newErrors);

		if (newErrors.email || newErrors.password) {
			return;
		}

		// Salvar dados da sessão no AsyncStorage
		await signIn({
			email,
			password,
		});

		router.replace('/tab/search');
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<KeyboardAvoidingView
				style={styles.container}
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}
			>
				<View style={styles.logo}>
					<Image
						source={{
							uri: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/logo.png',
						}}
						style={styles.logoImage}
					/>
				</View>

				<View style={styles.card}>
					<Text style={styles.title}>Login</Text>

					<Text style={styles.subtitle}>
						Preencha as informações para continuar.
					</Text>

					<View style={styles.form}>
						<FloatingInput
							label="E-MAIL"
							value={email}
							onChangeText={(text) => {
								setEmail(text);
								setErrors((prev) => ({ ...prev, email: '' }));
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
								setErrors((prev) => ({ ...prev, password: '' }));
							}}
							secureTextEntry
							error={errors.password}
						/>

						<Text style={styles.password}>
							Esqueceu a senha? Recupere aqui!
						</Text>
					</View>

					<TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
						<Text style={styles.primaryButtonText}>Entrar</Text>
					</TouchableOpacity>

					<TouchableOpacity onPress={() => router.push('/auth/register')}>
						<Text style={styles.link}>Criar conta</Text>
					</TouchableOpacity>
				</View>
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

	container: {
		flex: 1,
		padding: 36,
	},

	logo: {
		justifyContent: 'flex-start',
		alignSelf: 'center',
		paddingVertical: 80,
	},

	logoImage: {
		width: 180,
		height: 64,
	},

	title: {
		fontFamily: FONT.title,
		color: COLORS.lightNeutral,
		fontSize: 48,
		textTransform: 'uppercase',
	},

	subtitle: {
		fontFamily: FONT.body,
		color: COLORS.lightNeutral,
		opacity: 0.8,
	},

	form: {
		marginTop: 40,
		gap: 18,
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
		paddingVertical: 16,
		fontFamily: FONT.bodyBold,
		fontSize: 14,
	},

	inputError: {
		color: '#ff4d6d',
		fontFamily: FONT.bodyBold,
		fontSize: 11,
		marginTop: 6,
		marginLeft: 4,
	},

	password: {
		marginTop: 2,
		color: '#ffffff',
		fontFamily: FONT.body,
		opacity: 0.8,
	},

	primaryButton: {
		backgroundColor: COLORS.lightNeutral,
		borderRadius: 99,
		paddingVertical: 8,
		alignItems: 'center',
		marginTop: 40,
	},

	primaryButtonText: {
		color: COLORS.primary,
		fontFamily: FONT.bodyBold,
		fontSize: 18,
		textTransform: 'uppercase',
	},

	link: {
		color: COLORS.lightNeutral,
		fontFamily: FONT.bodyBold,
		textAlign: 'center',
		opacity: 0.85,
		marginTop: 20,
		textTransform: 'uppercase',
	},
});