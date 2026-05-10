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

const cars = [
	{
		id: '1',
		brand: 'Ford',
		name: 'Mustang 2026',
		image: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/mustang.png',
	},
	{
		id: '2',
		brand: 'Ford',
		name: 'Bronco Sport',
		image: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/bronco1.png',
	},
	{
		id: '3',
		brand: 'Ford',
		name: 'Maverick',
		image: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/carro.png',
	},
	{
		id: '4',
		brand: 'Ford',
		name: 'Expedition',
		image: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/expedtion.png',
	},
	{
		id: '5',
		brand: 'Ford',
		name: 'Bronco',
		image: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/bronco2.png',
	},
];

const lastSeenCars = [cars[0], cars[1], cars[2]];

function normalizeText(text) {
	return text
		.toLowerCase()
		.trim()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '');
}

function searchCars(searchText) {
	const normalizedSearch = normalizeText(searchText);

	if (!normalizedSearch) {
		return [];
	}

	const searchWords = normalizedSearch.split(/\s+/);

	return cars.filter((car) => {
		const searchableText = normalizeText(
			`${car.brand} ${car.name}`
		);

		const searchableWords =
			searchableText.split(/\s+/);

		return searchWords.every((word) =>
			searchableWords.some(
				(carWord) => carWord === word
			)
		);
	});
}

export default function SearchScreen() {
	const router = useRouter();

	const [search, setSearch] = useState('');
	const [favorites, setFavorites] = useState([]);

	const hasSearch = search.trim().length > 0;
	const filteredCars = searchCars(search);

	const dataToShow = hasSearch
		? filteredCars
		: lastSeenCars;

	function toggleFavorite(id) {
		if (favorites.includes(id)) {
			setFavorites(
				favorites.filter((item) => item !== id)
			);

			return;
		}

		setFavorites([...favorites, id]);
	}

	function goToInformation(car) {
		router.push({
			pathname: '/screen/information',
			params: {
				id: car.id,
				brand: car.brand,
				name: car.name,
				image: car.image,
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
						onPress={() =>
							toggleFavorite(item.id)
						}
					>
						<Ionicons
							name={
								favorites.includes(item.id)
									? 'star'
									: 'star-outline'
							}
							size={18}
							color={COLORS.primary}
						/>
					</TouchableOpacity>
				</View>

				<Image
					source={{ uri: item.image }}
					style={styles.carImage}
				/>

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
						onChangeText={setSearch}
						autoCapitalize="none"
					/>

					{hasSearch ? (
						<TouchableOpacity
							onPress={() => setSearch('')}
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
					ListHeaderComponent={
						!hasSearch ? (
							<>
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

								<Text style={styles.sectionTitle}>
									Últimos vistos
								</Text>
							</>
						) : null
					}
					ListEmptyComponent={
						hasSearch ? (
							<View style={styles.empty}>
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
							</View>
						) : null
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

	list: {
		paddingBottom: 140,
	},

	row: {
		justifyContent: 'space-between',
		marginBottom: 16,
	},

	card: {
		width: '48%',
		height: 190,
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
		height: 70,
		resizeMode: 'contain',
		marginTop: 6,
	},

	carName: {
		fontFamily: FONT.bodyBold,
		fontSize: 12,
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