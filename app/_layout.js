import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import { Anton_400Regular } from '@expo-google-fonts/anton';
import { TitilliumWeb_400Regular, TitilliumWeb_700Bold } from '@expo-google-fonts/titillium-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../style/theme';

const AuthContext = createContext(null);

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

	useEffect(() => {
		// Carregar estado de autenticação ao abrir o app
		const loadAuthState = async () => {
			try {
				const userSession = await AsyncStorage.getItem('userSession');
				if (userSession) {
					setIsAuthenticated(true);
				}
			} catch (error) {
				console.error('Erro ao carregar sessão:', error);
			} finally {
				setIsLoading(false);
			}
		};

		loadAuthState();
	}, []);

	const signIn = async (userData) => {
		try {
			await AsyncStorage.setItem('userSession', JSON.stringify(userData || {}));
			setIsAuthenticated(true);
		} catch (error) {
			console.error('Erro ao salvar sessão:', error);
		}
	};

	const signOut = async () => {
		try {
			await AsyncStorage.removeItem('userSession');
			setIsAuthenticated(false);
		} catch (error) {
			console.error('Erro ao fazer logout:', error);
		}
	};

	const value = useMemo(
		() => ({
			isAuthenticated,
			isLoading,
			signIn,
			signOut,
		}),
		[isAuthenticated, isLoading]
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
