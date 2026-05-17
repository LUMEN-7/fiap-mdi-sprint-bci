import { useState } from 'react';

import {
	View,
	Text,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	FlatList,
	Image,
} from 'react-native';

import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, FONT } from '../../style/theme';
import { useFavorites, useRecentViews } from '../_layout';
import { getFichaTecnica, interpretarBuscaVeiculo } from '../../services/llamaApi';
import {
	fetchAutoDevVehicleByVin,
	isVin,
	resolveVehicleSearchToPhotos,
} from '../../services/autoDevApi';

// Data is fetched from the API via `getFichaTecnica`.
// No local mock data.

function normalizeText(text) {
	return text
		.toLowerCase()
		.trim()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '');
}

function searchCars(searchText) {
	// Keep existing normalization utility but searching will be done
	// via API when the user submits the query.
	return [];
}

function getSpecsFromFicha(ficha) {
	return {
		engine: String(ficha?.resumo_rapido?.motor || ficha?.engine || 'N/D'),
		power: String(ficha?.resumo_rapido?.potencia || ficha?.power || 'N/D'),
		type: String(ficha?.resumo_rapido?.tipo || ficha?.type || 'N/D'),
	};
}

export default function SearchScreen() {
	const router = useRouter();
	const { isFavorite, toggleFavorite } = useFavorites();
	const { recentViews } = useRecentViews();

	const [search, setSearch] = useState('');
	const [loading, setLoading] = useState(false);
	const [results, setResults] = useState([]);

	const hasSearch = search.trim().length > 0;
	const dataToShow = hasSearch ? results : [];
	const recentViewedCars = recentViews.slice(0, 10);

	function handleSearchChange(text) {
		setSearch(text);
		setResults([]);
		setLoading(false);
	}

	async function handleSearchSubmit() {
		const raw = search.trim();
		if (!raw) return setResults([]);

		setLoading(true);
		try {
			if (isVin(raw)) {
				const { vehicle, retailPhotos } = await fetchAutoDevVehicleByVin(raw);
				const resolvedVehicle = vehicle?.vehicle || vehicle;
				const vehicleLabel = [
					resolvedVehicle?.year || vehicle?.year,
					resolvedVehicle?.make || vehicle?.make,
					resolvedVehicle?.model || vehicle?.model,
					resolvedVehicle?.trim || vehicle?.trim,
				]
					.filter(Boolean)
					.join(' ')
					.trim();

				const photoCards = (retailPhotos || []).slice(0, 12).map((photoUrl, index) => ({
					id: `${raw}-${index}`,
					vin: raw,
					brand: resolvedVehicle?.make || vehicle?.make,
					name: vehicleLabel || raw,
					image: photoUrl,
					rawFicha: vehicle,
					photoGallery: retailPhotos || [],
					...getSpecsFromFicha(vehicle),
				}));

				setResults(
					photoCards.length > 0
						? photoCards
						: [
							{
								id: raw,
								vin: raw,
								brand: resolvedVehicle?.make || vehicle?.make,
								name: vehicleLabel || raw,
								image: '',
								rawFicha: vehicle,
								photoGallery: retailPhotos || [],
								...getSpecsFromFicha(vehicle),
							},
						]
				);

				return;
			}

			const parsed = await interpretarBuscaVeiculo(raw);
			const resolved = await resolveVehicleSearchToPhotos(parsed);

			if (resolved.length > 0) {
				setResults(
					resolved.map((car) => ({
						id: car.vin,
						vin: car.vin,
						brand: car.marca || parsed.marca,
						name: [car.modelo, car.versao, car.ano]
							.filter(Boolean)
							.join(' ')
							.trim(),
						image: car.imagem,
						rawFicha: car.vehicle,
						photoGallery: car.galeria,
						...getSpecsFromFicha(car.vehicle),
					}))
				);
				return;
			}

			// Fallback: keep the previous summary flow when the VIN-based lookup does not resolve.
			const [brand, ...rest] = raw.split(/\s+/);
			const model = rest.join(' ');
			const ficha = await getFichaTecnica(brand, model || brand);

			const imageUrl =
				ficha?.imagem_sugerida &&
				ficha.imagem_sugerida !== 'Não disponível' &&
				String(ficha.imagem_sugerida).startsWith('http')
					? String(ficha.imagem_sugerida).trim()
					: '';

			setResults([
				{
					id: `${ficha.marca}-${ficha.modelo}-${ficha.versao || ''}`,
					brand: ficha.marca,
					name: `${ficha.modelo} ${ficha.versao || ''}`.trim(),
					image: imageUrl,
					rawFicha: ficha,
					...getSpecsFromFicha(ficha),
				},
			]);
		} catch (err) {
			console.warn('Erro na busca:', err.message || err);
			setResults([]);
		} finally {
			setLoading(false);
		}
	}

	function goToInformation(car) {
		router.push({
			pathname: '/screen/information',
			params: {
				id: car.id,
				brand: car.brand,
				name: car.name,
				image: car.image,
				vin: car.vin || car.id,
				photoGallery: car.photoGallery ? JSON.stringify(car.photoGallery) : undefined,
			},
		});
	}
	function renderCarCard({ item }) {
		return (
			<View style={styles.card}>
				<View style={styles.cardHeader}>
					<Text style={styles.brand}>
						{item.brand}
					</Text>

					<TouchableOpacity
						onPress={() => toggleFavorite(item)}
					>
						<Ionicons
							name={
								isFavorite(item.id)
									? 'star'
									: 'star-outline'
							}
							size={18}
							color={COLORS.primary}
						/>
					</TouchableOpacity>
				</View>

				{item.image ? (
					<Image
						source={{ uri: item.image }}
						style={styles.carImage}
						resizeMode="contain"
						onError={(error) => {
							console.log('Erro ao carregar imagem:', item.image, error.nativeEvent);
						}}
					/>
				) : (
					<View style={styles.carImageFallback}>
						<Ionicons
							name="car-sport-outline"
							size={44}
							color={COLORS.primary}
						/>
					</View>
				)}

				<Text style={styles.carName}>
					{item.name}
				</Text>

				<TouchableOpacity
					style={styles.button}
					onPress={() =>
						goToInformation(item)
					}
				>
					<Text style={styles.buttonText}>
						Saiba mais
					</Text>
				</TouchableOpacity>
			</View>
		);
	}

	function renderRecentItem(car) {
		return (
			<TouchableOpacity
				key={car.id}
				style={styles.recentCard}
				onPress={() => goToInformation(car)}
			>
				{car.image ? (
					<Image
						source={{ uri: car.image }}
						style={styles.recentImage}
						resizeMode="contain"
					/>
				) : (
					<View style={styles.recentImageFallback}>
						<Ionicons
							name="car-sport-outline"
							size={32}
							color={COLORS.primary}
						/>
					</View>
				)}

				<Text style={styles.recentBrand}>{car.brand}</Text>
				<Text style={styles.recentName} numberOfLines={2}>
					{car.name}
				</Text>
			</TouchableOpacity>
		);
	}

	return (
		<View style={styles.safeArea}>
			<View style={styles.container}>
				<Text style={styles.title}>
					Encontre o modelo
				</Text>

				<Text style={styles.subtitle}>
					Pesquise pela marca ou modelo
					para comparar diferenciais
					com mais facilidade.
				</Text>

				<View style={styles.searchBox}>
					<Ionicons
						name="search-outline"
						size={22}
						color={COLORS.primary}
					/>

					<TextInput
						style={styles.input}
						placeholder="Ex: Ford Mustang"
						placeholderTextColor="rgba(0,0,0,0.45)"
						value={search}
						onChangeText={handleSearchChange}
						onSubmitEditing={handleSearchSubmit}
						autoCapitalize="none"
					/>

					{hasSearch ? (
						<TouchableOpacity
							onPress={() => {
								setSearch('');
								setResults([]);
								setLoading(false);
							}}
						>
							<Ionicons
								name="close-circle"
								size={22}
								color="rgba(0,0,0,0.45)"
							/>
						</TouchableOpacity>
					) : null}
				</View>

				<FlatList
					data={dataToShow}
					keyExtractor={(item) => item.id}
					numColumns={2}
					columnWrapperStyle={styles.row}
					contentContainerStyle={styles.list}
					showsVerticalScrollIndicator={false}
					renderItem={renderCarCard}
					ListFooterComponent={
						!hasSearch && recentViewedCars.length > 0 ? (
							<View style={styles.recentSection}>
								<View style={styles.recentSectionHeader}>
									<Text style={styles.sectionTitle}>Últimos vistos</Text>
									<Text style={styles.recentSectionCount}>
										{recentViewedCars.length} itens
									</Text>
								</View>

								<FlatList
									horizontal
									data={recentViewedCars}
									keyExtractor={(item) => item.id}
									renderItem={({ item }) => renderRecentItem(item)}
									showsHorizontalScrollIndicator={false}
									contentContainerStyle={styles.recentList}
									ItemSeparatorComponent={() => <View style={styles.recentSeparator} />}
								/>
							</View>
						) : null
					}
					ListEmptyComponent={
						hasSearch ? (
							<View style={styles.empty}>
								{loading ? (
									<Text style={styles.emptyTitle}>Buscando...</Text>
								) : (
									<>
										<Ionicons
											name="car-sport-outline"
											size={42}
											color={COLORS.primary}
										/>

										<Text style={styles.emptyTitle}>
											Modelo não encontrado
										</Text>

										<Text style={styles.emptyText}>
											Confira se a marca ou o
											modelo foram digitados
											corretamente.
										</Text>
									</>
								)}
							</View>
						) : (
							<View style={styles.emptyStart}>
								<Ionicons
									name="search-outline"
									size={42}
									color={COLORS.primary}
								/>

								<Text style={styles.emptyTitle}>
									Pesquise um modelo
								</Text>

								<Text style={styles.emptyText}>
									Digite uma marca ou modelo
									para visualizar os
									resultados.
								</Text>
							</View>
						)
					}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: COLORS.lightNeutral,
	},

	container: {
		flex: 1,
		padding: 24,
		paddingTop: 70,
	},

	title: {
		fontFamily: FONT.title,
		fontSize: 46,
		textTransform: 'uppercase',
		color: COLORS.primary,
	},

	subtitle: {
		fontFamily: FONT.body,
		color: COLORS.darkGrey,
		opacity: 0.75,
		marginTop: 6,
		marginBottom: 24,
	},

	searchBox: {
		borderWidth: 1,
		borderColor: 'rgba(0,0,0,0.35)',
		borderRadius: 12,
		paddingHorizontal: 14,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
		marginBottom: 24,
	},

	input: {
		flex: 1,
		paddingVertical: 14,
		fontFamily: FONT.bodyBold,
		color: COLORS.primary,
	},

	sectionTitle: {
		fontFamily: FONT.bodyBold,
		fontSize: 13,
		color: COLORS.primary,
		textTransform: 'uppercase',
		letterSpacing: 2,
		marginTop: 30,
		marginBottom: 16,
	},

	recentSection: {
		marginBottom: 18,
	},

	recentSectionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 12,
	},

	recentSectionCount: {
		fontFamily: FONT.body,
		fontSize: 11,
		color: COLORS.darkGrey,
		opacity: 0.75,
	},

	recentList: {
		paddingRight: 8,
	},

	recentSeparator: {
		width: 12,
	},

	recentCard: {
		width: 148,
		padding: 12,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: 'rgba(0,0,0,0.12)',
		backgroundColor: COLORS.lightNeutral,
	},

	recentImage: {
		width: '100%',
		height: 78,
		marginBottom: 8,
	},

	recentImageFallback: {
		width: '100%',
		height: 78,
		marginBottom: 8,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(0,0,0,0.04)',
		borderRadius: 10,
	},

	recentBrand: {
		fontFamily: FONT.bodyBold,
		fontSize: 10,
		color: COLORS.primary,
		textTransform: 'uppercase',
	},

	recentName: {
		fontFamily: FONT.bodyBold,
		fontSize: 12,
		color: COLORS.primary,
		marginTop: 4,
		textTransform: 'uppercase',
	},

	list: {
		paddingBottom: 140,
	},

	row: {
		justifyContent: 'space-between',
		marginBottom: 16,
	},

	card: {
		width: '48%',
		minHeight: 200,
		borderWidth: 1,
		borderColor: 'rgba(0,0,0,0.15)',
		borderRadius: 16,
		padding: 12,
		backgroundColor: COLORS.lightNeutral,
	},

	cardHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},

	brand: {
		fontFamily: FONT.bodyBold,
		fontSize: 11,
		color: COLORS.primary,
		textTransform: 'uppercase',
	},

	carImage: {
		width: '100%',
		height: 90,
		marginTop: 6,
	},

	carImageFallback: {
		width: '100%',
		height: 90,
		marginTop: 6,
		alignItems: 'center',
		justifyContent: 'center',
	},

	carName: {
		fontFamily: FONT.bodyBold,
		fontSize: 10,
		color: COLORS.primary,
		textTransform: 'uppercase',
		marginTop: 8,
	},

	button: {
		backgroundColor: COLORS.primary,
		borderRadius: 999,
		paddingVertical: 7,
		alignItems: 'center',
		marginTop: 10,
	},

	buttonText: {
		fontFamily: FONT.bodyBold,
		fontSize: 10,
		color: COLORS.lightNeutral,
		textTransform: 'uppercase',
	},

	emptyStart: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 34,
		borderWidth: 1,
		borderColor: 'rgba(0,0,0,0.08)',
		borderRadius: 22,
		backgroundColor: 'rgba(0,0,0,0.03)',
	},

	empty: {
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 80,
		paddingHorizontal: 20,
	},

	emptyTitle: {
		fontFamily: FONT.bodyBold,
		color: COLORS.primary,
		textTransform: 'uppercase',
		marginTop: 14,
		fontSize: 15,
		textAlign: 'center',
	},

	emptyText: {
		fontFamily: FONT.body,
		color: COLORS.darkGrey,
		opacity: 0.7,
		marginTop: 6,
		textAlign: 'center',
		lineHeight: 20,
	},
});