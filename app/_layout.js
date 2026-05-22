import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import { Anton_400Regular } from '@expo-google-fonts/anton';
import { TitilliumWeb_400Regular, TitilliumWeb_700Bold } from '@expo-google-fonts/titillium-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../style/theme';


const AuthContext = createContext(null);
const FavoritesContext = createContext(null);
const RecentViewsContext = createContext(null);
const SESSION_STORAGE_KEY = 'userSession';
const USERS_STORAGE_KEY = 'users';
const FAVORITES_STORAGE_BASE = 'favoriteCarIds';
const FAVORITE_CARS_STORAGE_BASE = 'favoriteCarRecords';
const FAVORITE_COMPARISONS_STORAGE_BASE = 'favoriteComparisons';
const RECENT_VIEWS_STORAGE_BASE = 'recentViewedCars';

function makeUserKey(base, email) {
	const id = String((email || 'global')).trim().toLowerCase();
	return `${base}:${id}`;
}

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

export function useFavorites() {
	const context = useContext(FavoritesContext);

	if (!context) {
		throw new Error('useFavorites must be used within FavoritesProvider');
	}

	return context;
}

export function useRecentViews() {
	const context = useContext(RecentViewsContext);

	if (!context) {
		throw new Error('useRecentViews must be used within RecentViewsProvider');
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

	const updateProfile = async ({
		name,
		email,
		photo,
		currentPassword,
		newPassword,
	}) => {
		if (!currentUser?.email) {
			throw new Error('Nenhum usuario autenticado.');
		}

		const nextName = String(name ?? currentUser.name ?? '').trim();
		const nextEmail = normalizeEmail(email ?? currentUser.email ?? '');
		const nextPhoto = photo === undefined ? currentUser.photo || null : photo || null;

		if (!nextEmail) {
			throw new Error('E-mail invalido.');
		}

		const users = await loadUsers();
		const existingUser = users.find(
			(user) => user.email === currentUser.email
		);

		if (!existingUser) {
			throw new Error('Usuario nao encontrado.');
		}

		const emailInUseByAnotherUser = users.some(
			(user) =>
				user.email === nextEmail &&
				user.email !== currentUser.email
		);

		if (emailInUseByAnotherUser) {
			throw new Error('Este e-mail ja esta em uso.');
		}

		const wantsPasswordChange = String(newPassword || '').trim().length > 0;

		if (wantsPasswordChange) {
			if (existingUser.password !== String(currentPassword || '')) {
				throw new Error('Senha atual incorreta.');
			}

			if (String(newPassword).trim().length < 6) {
				throw new Error('A nova senha precisa ter no minimo 6 caracteres.');
			}
		}

		const updatedUser = {
			...currentUser,
			name: nextName,
			email: nextEmail,
			photo: nextPhoto,
			password: wantsPasswordChange
				? String(newPassword).trim()
				: existingUser.password,
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

function FavoritesProvider({ children }) {
	const [favoriteIds, setFavoriteIds] = useState([]);
	const [favoriteCars, setFavoriteCars] = useState([]);
	const [favoriteComparisons, setFavoriteComparisons] = useState([]);
	const [isFavoritesLoading, setIsFavoritesLoading] = useState(true);

	const { currentUser } = useAuth();


	useEffect(() => {
		const loadFavorites = async () => {
			setIsFavoritesLoading(true);
			try {
				const baseKey = makeUserKey(FAVORITES_STORAGE_BASE, currentUser?.email);
				const baseCarsKey = makeUserKey(FAVORITE_CARS_STORAGE_BASE, currentUser?.email);
				const baseComparisonsKey = makeUserKey(FAVORITE_COMPARISONS_STORAGE_BASE, currentUser?.email);

				const favoritesRaw = await AsyncStorage.getItem(baseKey);
				const favoriteCarsRaw = await AsyncStorage.getItem(baseCarsKey);
				const parsedFavorites = favoritesRaw ? JSON.parse(favoritesRaw) : [];
				const parsedFavoriteCars = favoriteCarsRaw ? JSON.parse(favoriteCarsRaw) : [];
				const comparisonsRaw = await AsyncStorage.getItem(baseComparisonsKey);
				const parsedComparisons = comparisonsRaw ? JSON.parse(comparisonsRaw) : [];

				if (Array.isArray(parsedFavorites)) {
					setFavoriteIds(parsedFavorites.map((id) => String(id)));
				} else {
					setFavoriteIds([]);
				}

				if (Array.isArray(parsedFavoriteCars)) {
					setFavoriteCars(
						parsedFavoriteCars
							.filter((car) => car && car.id)
							.map((car) => ({
								id: String(car.id),
								brand: String(car.brand || ''),
								name: String(car.name || ''),
								image: String(car.image || ''),
								engine: String(car.engine || ''),
								power: String(car.power || ''),
								type: String(car.type || ''),
								photoGallery: Array.isArray(car.photoGallery) ? car.photoGallery : [],
							}))
					);
				} else {
					setFavoriteCars([]);
				}

				if (Array.isArray(parsedComparisons)) {
					setFavoriteComparisons(parsedComparisons);
				} else {
					setFavoriteComparisons([]);
				}
			} catch {
				setFavoriteIds([]);
				setFavoriteCars([]);
				setFavoriteComparisons([]);
			} finally {
				setIsFavoritesLoading(false);
			}
		};

		loadFavorites();
	}, [currentUser?.email]);

	const updateFavorites = (updater) => {
		const key = makeUserKey(FAVORITES_STORAGE_BASE, currentUser?.email);
		setFavoriteIds((currentFavorites) => {
			const nextFavorites = updater(currentFavorites);
			void AsyncStorage.setItem(key, JSON.stringify(nextFavorites));
			return nextFavorites;
		});
	};

	const updateFavoriteCars = (updater) => {
		const key = makeUserKey(FAVORITE_CARS_STORAGE_BASE, currentUser?.email);
		setFavoriteCars((currentFavoriteCars) => {
			const nextFavoriteCars = updater(currentFavoriteCars);
			void AsyncStorage.setItem(key, JSON.stringify(nextFavoriteCars));
			return nextFavoriteCars;
		});
	};

	const updateFavoriteComparisons = (updater) => {
		const key = makeUserKey(FAVORITE_COMPARISONS_STORAGE_BASE, currentUser?.email);
		setFavoriteComparisons((currentComparisons) => {
			const nextComparisons = updater(currentComparisons);
			void AsyncStorage.setItem(key, JSON.stringify(nextComparisons));
			return nextComparisons;
		});
	};

	const resolveFavoriteCar = (idOrCar) => {
		if (idOrCar && typeof idOrCar === 'object') {
			const rawFicha = idOrCar.rawFicha || {};
			const resumoRapido = rawFicha?.resumo_rapido || {};
			return {
				id: String(idOrCar.id),
				brand: String(idOrCar.brand || ''),
				name: String(idOrCar.name || ''),
				image: String(idOrCar.image || ''),
				engine: String(idOrCar.engine || resumoRapido.motor || ''),
				power: String(idOrCar.power || resumoRapido.potencia || ''),
				type: String(idOrCar.type || resumoRapido.tipo || ''),
				photoGallery: Array.isArray(idOrCar.photoGallery)
					? idOrCar.photoGallery.filter(Boolean)
					: [],
			};
		}

		const normalizedId = String(idOrCar || '');
		return {
			id: normalizedId,
			brand: '',
			name: 'Modelo salvo',
			image: '',
			engine: '',
			power: '',
			type: '',
			photoGallery: [],
		};
	};

	const toggleFavorite = (idOrCar) => {
		const normalizedId = String(
			idOrCar && typeof idOrCar === 'object' ? idOrCar.id : idOrCar
		);
		const favoriteRecord = resolveFavoriteCar(idOrCar);

		updateFavorites((currentFavorites) => {
			if (currentFavorites.includes(normalizedId)) {
				updateFavoriteCars((currentFavoriteCars) =>
					currentFavoriteCars.filter((car) => String(car.id) !== normalizedId)
				);
				return currentFavorites.filter((item) => item !== normalizedId);
			}

			updateFavoriteCars((currentFavoriteCars) => {
				const nextFavoriteCars = [
					favoriteRecord,
					...currentFavoriteCars.filter((car) => String(car.id) !== normalizedId),
				];
				return nextFavoriteCars;
			});

			return [...currentFavorites, normalizedId];
		});
	};

	const setFavorite = (id, shouldFavorite) => {
		const normalizedId = String(id);

		updateFavorites((currentFavorites) => {
			const alreadyFavorite = currentFavorites.includes(normalizedId);

			if (shouldFavorite && !alreadyFavorite) {
				updateFavoriteCars((currentFavoriteCars) => {
					const resolved = resolveFavoriteCar(id);
					return [
						resolved,
						...currentFavoriteCars.filter((car) => String(car.id) !== normalizedId),
					];
				});
				return [...currentFavorites, normalizedId];
			}

			if (!shouldFavorite && alreadyFavorite) {
				updateFavoriteCars((currentFavoriteCars) =>
					currentFavoriteCars.filter((car) => String(car.id) !== normalizedId)
				);
				return currentFavorites.filter((item) => item !== normalizedId);
			}

			return currentFavorites;
		});
	};

	function normalizeComparison(firstCarId, secondCarId) {
		const firstId = String(firstCarId);
		const secondId = String(secondCarId);
		return [firstId, secondId].sort();
	}

	function getComparisonId(firstCarId, secondCarId) {
		const [leftId, rightId] = normalizeComparison(firstCarId, secondCarId);
		return `${leftId}__${rightId}`;
	}

	const isComparisonFavorite = (firstCarId, secondCarId) => {
		const comparisonId = getComparisonId(firstCarId, secondCarId);
		return favoriteComparisons.some((comparison) => comparison.id === comparisonId);
	};

	const toggleComparisonFavorite = ({ firstCar, secondCar }) => {
		const comparisonId = getComparisonId(firstCar.id, secondCar.id);

		updateFavoriteComparisons((currentComparisons) => {
			const exists = currentComparisons.some((comparison) => comparison.id === comparisonId);

			if (exists) {
				return currentComparisons.filter((comparison) => comparison.id !== comparisonId);
			}

			return [
				{
					id: comparisonId,
					firstCar: {
						id: String(firstCar.id),
						name: String(firstCar.name),
						brand: String(firstCar.brand),
						image: String(firstCar.image),
					},
					secondCar: {
						id: String(secondCar.id),
						name: String(secondCar.name),
						brand: String(secondCar.brand),
						image: String(secondCar.image),
					},
					createdAt: new Date().toLocaleDateString('pt-BR'),
				},
				...currentComparisons,
			];
		});
	};

	const isFavorite = (id) => favoriteIds.includes(String(id));

	const value = useMemo(
		() => ({
			favoriteIds,
			favoriteCars,
			favoriteComparisons,
			isFavoritesLoading,
			toggleFavorite,
			setFavorite,
			isFavorite,
			toggleComparisonFavorite,
			isComparisonFavorite,
		}),
		[favoriteCars, favoriteComparisons, favoriteIds, isFavoritesLoading]
	);

	return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

function RecentViewsProvider({ children }) {
	const [recentViews, setRecentViews] = useState([]);
	const [isRecentViewsLoading, setIsRecentViewsLoading] = useState(true);

	const { currentUser } = useAuth();

	useEffect(() => {
		const loadRecentViews = async () => {
			setIsRecentViewsLoading(true);
			try {
				const key = makeUserKey(RECENT_VIEWS_STORAGE_BASE, currentUser?.email);
				const recentRaw = await AsyncStorage.getItem(key);
				const parsedRecent = recentRaw ? JSON.parse(recentRaw) : [];

				if (Array.isArray(parsedRecent)) {
					setRecentViews(parsedRecent.slice(0, 10));
				} else {
					setRecentViews([]);
				}
			} catch {
				setRecentViews([]);
			} finally {
				setIsRecentViewsLoading(false);
			}
		};

		loadRecentViews();
	}, [currentUser?.email]);

	const addRecentView = (car) => {
		if (!car?.id) return;

		const normalizedCar = {
			id: String(car.id),
			brand: String(car.brand || ''),
			name: String(car.name || ''),
			image: String(car.image || ''),
			visitedAt: new Date().toISOString(),
		};

		setRecentViews((currentViews) => {
			const nextViews = [
				normalizedCar,
				...currentViews.filter((item) => String(item.id) !== normalizedCar.id),
			].slice(0, 10);

			const key = makeUserKey(RECENT_VIEWS_STORAGE_BASE, currentUser?.email);
			void AsyncStorage.setItem(key, JSON.stringify(nextViews));

			return nextViews;
		});
	};

	const clearRecentViews = () => {
		setRecentViews([]);
		const key = makeUserKey(RECENT_VIEWS_STORAGE_BASE, currentUser?.email);
		void AsyncStorage.removeItem(key);
	};

	const value = useMemo(
		() => ({
			recentViews,
			isRecentViewsLoading,
			addRecentView,
			clearRecentViews,
		}),
		[recentViews, isRecentViewsLoading]
	);

	return <RecentViewsContext.Provider value={value}>{children}</RecentViewsContext.Provider>;
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
		return null;
	}

	return (
		<AuthProvider>
			<FavoritesProvider>
				<RecentViewsProvider>
					<RouteGuard />
				</RecentViewsProvider>
			</FavoritesProvider>
		</AuthProvider>
	);
}
