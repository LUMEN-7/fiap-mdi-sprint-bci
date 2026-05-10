import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import { Anton_400Regular } from '@expo-google-fonts/anton';
import { TitilliumWeb_400Regular, TitilliumWeb_700Bold } from '@expo-google-fonts/titillium-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../style/theme';

const AuthContext = createContext(null);
const SESSION_STORAGE_KEY = 'userSession';
const USERS_STORAGE_KEY = 'users';

function normalizeEmail(email) {
	return String(email || '').trim().toLowerCase();
}

async function loadUsers() {
	try {
		const usersRaw = await AsyncStorage.getItem(USERS_STORAGE_KEY);
		const parsedUsers = usersRaw ? JSON.parse(usersRaw) : [];

		if (Array.isArray(parsedUsers)) {
			return parsedUsers;
		}

		return [];
	} catch {
		return [];
	}
}

async function saveUsers(users) {
	await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function useAuth() {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error('useAuth must be used within AuthProvider');
	}

	return context;
}

function AuthProvider({ children }) {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [currentUser, setCurrentUser] = useState(null);

	useEffect(() => {
		// Carregar sessão e usuário atual ao abrir o app
		const loadAuthState = async () => {
			try {
				const userSessionRaw = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
				if (!userSessionRaw) {
					setIsAuthenticated(false);
					setCurrentUser(null);
					return;
				}

				const session = JSON.parse(userSessionRaw);
				const users = await loadUsers();
				const loggedUser = users.find((user) => user.email === session.email);

				if (loggedUser) {
					setIsAuthenticated(true);
					setCurrentUser(loggedUser);
				} else if (session?.email && session?.password) {
					const migratedUser = {
						name: String(session?.name || '').trim(),
						email: normalizeEmail(session.email),
						password: String(session.password),
						photo: session?.photo || null,
					};

					await saveUsers([...users, migratedUser]);
					await AsyncStorage.setItem(
						SESSION_STORAGE_KEY,
						JSON.stringify({ email: migratedUser.email })
					);

					setIsAuthenticated(true);
					setCurrentUser(migratedUser);
				} else {
					await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
					setIsAuthenticated(false);
					setCurrentUser(null);
				}
			} catch (error) {
				console.error('Erro ao carregar sessão:', error);
				setIsAuthenticated(false);
				setCurrentUser(null);
			} finally {
				setIsLoading(false);
			}
		};

		loadAuthState();
	}, []);

	const signUp = async (userData) => {
		const formattedEmail = normalizeEmail(userData?.email);

		if (!formattedEmail) {
			throw new Error('E-mail inválido.');
		}

		const users = await loadUsers();
		const userAlreadyExists = users.some((user) => user.email === formattedEmail);

		if (userAlreadyExists) {
			throw new Error('Este e-mail já está cadastrado.');
		}

		const createdUser = {
			name: String(userData?.name || '').trim(),
			email: formattedEmail,
			password: String(userData?.password || ''),
			photo: userData?.photo || null,
		};

		await saveUsers([...users, createdUser]);
		await AsyncStorage.setItem(
			SESSION_STORAGE_KEY,
			JSON.stringify({ email: createdUser.email })
		);

		setCurrentUser(createdUser);
		setIsAuthenticated(true);
	};

	const signIn = async ({ email, password }) => {
		try {
			const formattedEmail = normalizeEmail(email);
			const users = await loadUsers();
			const existingUser = users.find((user) => user.email === formattedEmail);

			if (!existingUser || existingUser.password !== String(password || '')) {
				throw new Error('E-mail ou senha incorretos.');
			}

			await AsyncStorage.setItem(
				SESSION_STORAGE_KEY,
				JSON.stringify({ email: existingUser.email })
			);

			setCurrentUser(existingUser);
			setIsAuthenticated(true);
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			}

			throw new Error('Não foi possível entrar na conta.');
		}
	};

	const signOut = async () => {
		try {
			await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
			setIsAuthenticated(false);
			setCurrentUser(null);
		} catch (error) {
			console.error('Erro ao fazer logout:', error);
		}
	};

	const updateProfile = async ({ name, email, photo }) => {
		if (!currentUser?.email) {
			throw new Error('Nenhum usuario autenticado.');
		}

		const formattedEmail = normalizeEmail(email);

		if (!formattedEmail) {
			throw new Error('E-mail invalido.');
		}

		const users = await loadUsers();
		const emailInUseByAnotherUser = users.some(
			(user) =>
				user.email === formattedEmail &&
				user.email !== currentUser.email
		);

		if (emailInUseByAnotherUser) {
			throw new Error('Este e-mail ja esta em uso.');
		}

		const updatedUser = {
			...currentUser,
			name: String(name || '').trim(),
			email: formattedEmail,
			photo: photo || null,
		};

		const updatedUsers = users.map((user) =>
			user.email === currentUser.email ? updatedUser : user
		);

		await saveUsers(updatedUsers);
		await AsyncStorage.setItem(
			SESSION_STORAGE_KEY,
			JSON.stringify({ email: updatedUser.email })
		);

		setCurrentUser(updatedUser);
	};

	const value = useMemo(
		() => ({
			isAuthenticated,
			isLoading,
			currentUser,
			signUp,
			signIn,
			signOut,
			updateProfile,
		}),
		[currentUser, isAuthenticated, isLoading]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function RouteGuard() {
	const { isAuthenticated, isLoading } = useAuth();
	const segments = useSegments();
	const router = useRouter();

	useEffect(() => {
		// Aguardar carregamento do estado de autenticação
		if (isLoading) return;

		const isAuthRoute = segments[0] === 'auth';

		if (!isAuthenticated && !isAuthRoute) {
			router.replace('/auth/login');
			return;
		}

		if (isAuthenticated && isAuthRoute) {
			router.replace('/');
		}
	}, [isAuthenticated, isLoading, router, segments]);

	return (
		<Stack initialRouteName="auth/login" screenOptions={{ headerShown: false }}>
			<Stack.Screen name="auth/login" />
			<Stack.Screen name="auth/register" />
			<Stack.Screen name="index" />
			<Stack.Screen name="tab" />
			<Stack.Screen name="screen" />
		</Stack>
	);
}

export default function RootLayout() {
	const [fontsLoaded] = useFonts({
		Anton_400Regular,
		TitilliumWeb_400Regular,
		TitilliumWeb_700Bold,
	});

	if (!fontsLoaded) {
		return (
			<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary }}>
				<ActivityIndicator color={COLORS.lightNeutral} />
			</View>
		);
	}

	return (
		<AuthProvider>
			<RouteGuard />
		</AuthProvider>
	);
}
