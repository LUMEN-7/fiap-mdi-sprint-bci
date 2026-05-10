import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import { Anton_400Regular } from '@expo-google-fonts/anton';
import { TitilliumWeb_400Regular, TitilliumWeb_700Bold } from '@expo-google-fonts/titillium-web';
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

	const value = useMemo(
		() => ({
			isAuthenticated,
			signIn: () => setIsAuthenticated(true),
			signOut: () => setIsAuthenticated(false),
		}),
		[isAuthenticated]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function RouteGuard() {
	const { isAuthenticated } = useAuth();
	const segments = useSegments();
	const router = useRouter();

	useEffect(() => {
		const isAuthRoute = segments[0] === 'auth';

		if (!isAuthenticated && !isAuthRoute) {
			router.replace('/auth/login');
			return;
		}

		if (isAuthenticated && isAuthRoute) {
			router.replace('/');
		}
	}, [isAuthenticated, router, segments]);

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
