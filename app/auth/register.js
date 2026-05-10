import { useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

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

	const animation = useRef(
		new Animated.Value(value ? 1 : 0)
	).current;

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
					outputRange: [
						'rgba(255,255,255,0.7)',
						COLORS.secondary,
					],
			  }),
	};

	return (
		<View style={styles.inputWrapper}>
			<View
				style={[
					styles.inputContainer,

					focused &&
						styles.inputContainerFocused,

					error &&
						styles.inputContainerError,
				]}
			>
				<Animated.Text
					style={[
						styles.label,
						labelStyle,
					]}
				>
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

			{error ? (
				<Text style={styles.inputError}>
					{error}
				</Text>
			) : null}
		</View>
	);
}

export default function RegisterScreen() {
	const router = useRouter();

	const { signIn } = useAuth();

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const [errors, setErrors] = useState({
		name: '',
		email: '',
		password: '',
	});

	const handleRegister = () => {
		const newErrors = {
			name: '',
			email: '',
			password: '',
		};

		if (name.trim().length < 3) {
			newErrors.name =
				'Nome muito curto.';
		}

		if (!isValidEmail(email)) {
			newErrors.email =
				'E-mail inválido.';
		}

		if (password.trim().length < 6) {
			newErrors.password =
				'Mínimo de 6 caracteres.';
		}

		setErrors(newErrors);

		if (
			newErrors.name ||
			newErrors.email ||
			newErrors.password
		) {
			return;
		}

		signIn();

		router.replace('/tab/search');
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<KeyboardAvoidingView
				style={styles.container}
				behavior={
					Platform.OS === 'ios'
						? 'padding'
						: undefined
				}
			>
				<View style={styles.card}>
					<Text style={styles.title}>
						Criar conta
					</Text>

					<Text style={styles.subtitle}>
						Cadastre um usuário válido
						para liberar o acesso.
					</Text>

					<View style={styles.form}>
						<FloatingInput
							label="NOME"
							value={name}
							onChangeText={(text) => {
								setName(text);

								setErrors(
									(prev) => ({
										...prev,
										name: '',
									})
								);
							}}
							error={errors.name}
						/>

						<FloatingInput
							label="E-MAIL"
							value={email}
							onChangeText={(text) => {
								setEmail(text);

								setErrors(
									(prev) => ({
										...prev,
										email: '',
									})
								);
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

								setErrors(
									(prev) => ({
										...prev,
										password: '',
									})
								);
							}}
							secureTextEntry
							error={errors.password}
						/>

						<TouchableOpacity
							style={
								styles.primaryButton
							}
							onPress={
								handleRegister
							}
						>
							<Text
								style={
									styles.primaryButtonText
								}
							>
								Cadastrar e entrar
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={() =>
								router.back()
							}
						>
							<Text style={styles.link}>
								Voltar para login
							</Text>
						</TouchableOpacity>
					</View>
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
	},

	form: {
		marginTop: 32,
		gap: 20,
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

	inputError: {
		color: '#ff4d6d',

		fontFamily: FONT.bodyBold,

		fontSize: 11,

		marginTop: 6,
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

	link: {
		color: COLORS.lightNeutral,

		fontFamily: FONT.bodyBold,

		textAlign: 'center',

		opacity: 0.85,

		textTransform: 'uppercase',
	},
});