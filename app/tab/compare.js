import { useState } from 'react';

import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Image,
	ScrollView,
	TextInput,
	KeyboardAvoidingView,
	Platform,
} from 'react-native';

import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, FONT } from '../../style/theme';
import { interpretarBuscaVeiculo } from '../../services/llamaApi';

import {
	isVin,
	fetchAutoDevVehicleByVin,
	resolveVehicleSearchToPhotos,
} from '../../services/autoDevApi';

function getSpecsFromVehicle(vehicle) {
	return {
		engine: String(
			vehicle?.engine ||
				vehicle?.resumo_rapido?.motor ||
				'N/D'
		),

		power: String(
			vehicle?.resumo_rapido?.potencia ||
				vehicle?.power ||
				'N/D'
		),

		type: String(
			vehicle?.body ||
				vehicle?.resumo_rapido?.tipo ||
				'N/D'
		),
	};
}

export default function CompareSelectScreen() {
	const router = useRouter();

	const {
		firstCarId,
		firstCarBrand,
		firstCarName,
		firstCarImage,
	} = useLocalSearchParams();

	const initialFirstCar = firstCarId
		? {
				id: String(firstCarId),
				brand: String(firstCarBrand),
				name: String(firstCarName),
				image: String(firstCarImage),
		  }
		: null;

	const [firstCar, setFirstCar] =
		useState(initialFirstCar);

	const [secondCar, setSecondCar] =
		useState(null);

	const [activeSlot, setActiveSlot] =
		useState(
			initialFirstCar ? 'second' : 'first'
		);

	const [search, setSearch] = useState('');
	const [loading, setLoading] =
		useState(false);

	const [results, setResults] = useState(
		[]
	);

	const [searched, setSearched] =
		useState(false);

	function handleSearchChange(text) {
		setSearch(text);
		setResults([]);
		setSearched(false);
	}

	async function handleSearchSubmit() {
		const raw = search.trim();

		if (!raw) {
			setResults([]);
			setSearched(false);
			return;
		}

		setLoading(true);
		setSearched(true);

		try {
			if (isVin(raw)) {
				const {
					vehicle,
					retailPhotos,
				} =
					await fetchAutoDevVehicleByVin(
						raw
					);

				const resolvedVehicle =
					vehicle?.vehicle || vehicle;

				const vehicleName = [
					resolvedVehicle?.year ||
						vehicle?.year,

					resolvedVehicle?.make ||
						vehicle?.make,

					resolvedVehicle?.model ||
						vehicle?.model,

					resolvedVehicle?.trim ||
						vehicle?.trim,
				]
					.filter(Boolean)
					.join(' ')
					.trim();

				setResults([
					{
						id: raw,
						vin: raw,

						brand:
							resolvedVehicle?.make ||
							vehicle?.make ||
							'N/D',

						name: vehicleName || raw,

						image:
							retailPhotos?.[0] || '',

						photoGallery:
							retailPhotos || [],

						rawFicha: vehicle,

						...getSpecsFromVehicle(
							vehicle
						),
					},
				]);

				return;
			}

			const parsed =
				await interpretarBuscaVeiculo(
					raw
				);

			const resolved =
				await resolveVehicleSearchToPhotos(
					parsed
				);

			setResults(
				resolved.map((car) => ({
					id: car.vin,
					vin: car.vin,

					brand:
						car.marca ||
						parsed.marca ||
						'N/D',

					name: [
						car.modelo,
						car.versao,
						car.ano,
					]
						.filter(Boolean)
						.join(' ')
						.trim(),

					image: car.imagem || '',

					photoGallery:
						car.galeria || [],

					rawFicha: car.vehicle,

					...getSpecsFromVehicle(
						car.vehicle
					),
				}))
			);
		} catch (error) {
			console.warn(
				'Erro na busca:',
				error.message || error
			);

			setResults([]);
		} finally {
			setLoading(false);
		}
	}

	function selectCar(car) {
		if (activeSlot === 'first') {
			setFirstCar(car);

			if (!secondCar) {
				setActiveSlot('second');
			}

			return;
		}

		setSecondCar(car);
	}

	function removeCar(slot) {
		if (slot === 'first') {
			setFirstCar(null);
			setActiveSlot('first');
			return;
		}

		setSecondCar(null);
		setActiveSlot('second');
	}

	function handleCompare() {
		if (!firstCar || !secondCar)
			return;

		router.push({
			pathname: '/screen/detail',

			params: {
				firstCarId: firstCar.id,
				firstCarBrand:
					firstCar.brand,

				firstCarName:
					firstCar.name,

				firstCarImage:
					firstCar.image,

				secondCarId:
					secondCar.id,

				secondCarBrand:
					secondCar.brand,

				secondCarName:
					secondCar.name,

				secondCarImage:
					secondCar.image,
			},
		});
	}

	const canCompare =
		firstCar && secondCar;

	return (
		<KeyboardAvoidingView
			style={styles.safeArea}
			behavior={
				Platform.OS === 'ios'
					? 'padding'
					: 'height'
			}
		>
			<ScrollView
				contentContainerStyle={
					styles.container
				}
				showsVerticalScrollIndicator={
					false
				}
				keyboardShouldPersistTaps="handled"
			>
				<Text style={styles.title}>
					Comparar
				</Text>

				<Text style={styles.subtitle}>
					Pesquise dois modelos
					para comparar desempenho,
					consumo e diferenciais.
				</Text>

				<View style={styles.slots}>
					<SelectedSlot
						label="Modelo 1"
						car={firstCar}
						active={
							activeSlot === 'first'
						}
						onPress={() =>
							setActiveSlot('first')
						}
						onRemove={() =>
							removeCar('first')
						}
					/>

					<View
						style={styles.vsCircle}
					>
						<Text style={styles.vs}>
							X
						</Text>
					</View>

					<SelectedSlot
						label="Modelo 2"
						car={secondCar}
						active={
							activeSlot ===
							'second'
						}
						onPress={() =>
							setActiveSlot(
								'second'
							)
						}
						onRemove={() =>
							removeCar(
								'second'
							)
						}
					/>
				</View>

				<Text
					style={styles.sectionTitle}
				>
					Buscar para{' '}
					{activeSlot === 'first'
						? 'modelo 1'
						: 'modelo 2'}
				</Text>

				<View
					style={styles.searchBox}
				>
					<Ionicons
						name="search-outline"
						size={22}
						color={
							COLORS.primary
						}
					/>

					<TextInput
						style={styles.input}
						placeholder="Ex: Ford Mustang 2024"
						placeholderTextColor="rgba(0,0,0,0.45)"
						value={search}
						onChangeText={
							handleSearchChange
						}
						onSubmitEditing={
							handleSearchSubmit
						}
						autoCapitalize="none"
						returnKeyType="search"
					/>

					{search ? (
						<TouchableOpacity
							onPress={() => {
								setSearch('');
								setResults([]);
								setSearched(
									false
								);
								setLoading(
									false
								);
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

				{loading ? (
					<View
						style={styles.emptyBox}
					>
						<Ionicons
							name="search-outline"
							size={42}
							color={
								COLORS.primary
							}
						/>

						<Text
							style={
								styles.emptyTitle
							}
						>
							Buscando...
						</Text>
					</View>
				) : null}

				{searched &&
				!loading &&
				results.length === 0 ? (
					<View
						style={styles.emptyBox}
					>
						<Ionicons
							name="car-sport-outline"
							size={38}
							color={
								COLORS.primary
							}
						/>

						<Text
							style={
								styles.emptyTitle
							}
						>
							Nenhum modelo
							encontrado
						</Text>

						<Text
							style={
								styles.emptyText
							}
						>
							Tente pesquisar
							com marca,
							modelo e ano.
						</Text>
					</View>
				) : null}

				{results.length > 0 ? (
					<View
						style={
							styles.resultList
						}
					>
						{results.map((car) => {
							const selected =
								firstCar?.id ===
									car.id ||
								secondCar?.id ===
									car.id;

							return (
								<TouchableOpacity
									key={car.id}
									style={[
										styles.resultItem,
										selected &&
											styles.resultItemSelected,
									]}
									onPress={() =>
										selectCar(
											car
										)
									}
								>
									<View
										style={
											styles.resultImageWrapper
										}
									>
										{car.image ? (
											<Image
												source={{
													uri: car.image,
												}}
												style={
													styles.resultImage
												}
												resizeMode="contain"
											/>
										) : (
											<Ionicons
												name="car-sport-outline"
												size={
													34
												}
												color={
													COLORS.primary
												}
											/>
										)}
									</View>

									<View
										style={
											styles.resultInfo
										}
									>
										<Text
											style={
												styles.resultName
											}
											numberOfLines={
												1
											}
										>
											{
												car.name
											}
										</Text>

										<Text
											style={
												styles.resultBrand
											}
											numberOfLines={
												1
											}
										>
											{
												car.brand
											}
										</Text>
									</View>

									<View
										style={[
											styles.addButton,
											selected &&
												styles.addButtonSelected,
										]}
									>
										<Ionicons
											name={
												selected
													? 'checkmark'
													: 'add'
											}
											size={
												25
											}
											color={
												selected
													? COLORS.lightNeutral
													: COLORS.primary
											}
										/>
									</View>
								</TouchableOpacity>
							);
						})}
					</View>
				) : null}

				<TouchableOpacity
					style={[
						styles.compareButton,
						!canCompare &&
							styles.compareButtonDisabled,
					]}
					onPress={handleCompare}
					disabled={!canCompare}
				>
					<Text
						style={
							styles.compareButtonText
						}
					>
						Comparar
					</Text>
				</TouchableOpacity>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

function SelectedSlot({
	label,
	car,
	active,
	onPress,
	onRemove,
}) {
	return (
		<TouchableOpacity
			style={[
				styles.slotCard,
				active &&
					styles.slotCardActive,
			]}
			onPress={onPress}
		>
			{car ? (
				<>
					<View
						style={
							styles.slotImageWrapper
						}
					>
						{car.image ? (
							<Image
								source={{
									uri: car.image,
								}}
								style={
									styles.slotImage
								}
								resizeMode="contain"
							/>
						) : (
							<Ionicons
								name="car-sport-outline"
								size={30}
								color={
									COLORS.primary
								}
							/>
						)}
					</View>

					<View
						style={styles.slotInfo}
					>
						<Text
							style={
								styles.slotLabel
							}
						>
							{label}
						</Text>

						<Text
							style={
								styles.slotName
							}
							numberOfLines={1}
						>
							{car.name}
						</Text>
					</View>

					<TouchableOpacity
						style={
							styles.removeButton
						}
						onPress={onRemove}
					>
						<Ionicons
							name="close-outline"
							size={18}
							color={
								COLORS.lightNeutral
							}
						/>
					</TouchableOpacity>
				</>
			) : (
				<>
					<Ionicons
						name="car-sport-outline"
						size={24}
						color={
							COLORS.primary
						}
					/>

					<Text
						style={
							styles.emptySlotText
						}
					>
						{label}
					</Text>
				</>
			)}
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor:
			COLORS.lightNeutral,
	},

	container: {
		flexGrow: 1,
		padding: 28,
		paddingTop: 70,
		paddingBottom: 120,
	},

	title: {
		fontFamily: FONT.title,
		fontSize: 48,
		color: COLORS.primary,
		textTransform: 'uppercase',
	},

	subtitle: {
		fontFamily: FONT.body,
		color: COLORS.darkGrey,
		opacity: 0.75,
		lineHeight: 21,
		marginTop: 10,
		marginBottom: 26,
	},

	slots: {
		gap: 12,
		marginBottom: 28,
	},

	slotCard: {
		minHeight: 78,
		borderRadius: 18,
		borderWidth: 1,
		borderColor:
			'rgba(0,0,0,0.14)',
		backgroundColor:
			COLORS.lightNeutral,
		padding: 12,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
	},

	slotCardActive: {
		borderColor: COLORS.secondary,
		backgroundColor:
			'rgba(5,98,210,0.08)',
	},

	slotImageWrapper: {
		width: 58,
		height: 58,
		borderRadius: 999,
		backgroundColor:
			'rgba(0,0,0,0.04)',
		alignItems: 'center',
		justifyContent: 'center',
		overflow: 'hidden',
	},

	slotImage: {
		width: 56,
		height: 56,
	},

	slotInfo: {
		flex: 1,
	},

	slotLabel: {
		fontFamily: FONT.body,
		color: COLORS.darkGrey,
		opacity: 0.6,
		fontSize: 11,
		textTransform: 'uppercase',
	},

	slotName: {
		fontFamily: FONT.bodyBold,
		color: COLORS.primary,
		fontSize: 15,
		textTransform: 'uppercase',
		marginTop: 2,
	},

	emptySlotText: {
		fontFamily: FONT.bodyBold,
		color: COLORS.primary,
		textTransform: 'uppercase',
		fontSize: 13,
		opacity: 0.7,
	},

	removeButton: {
		width: 30,
		height: 30,
		borderRadius: 999,
		backgroundColor:
			COLORS.primary,
		alignItems: 'center',
		justifyContent: 'center',
	},

	vsCircle: {
		alignSelf: 'center',
		width: 34,
		height: 34,
		borderRadius: 999,
		backgroundColor:
			COLORS.primary,
		alignItems: 'center',
		justifyContent: 'center',
	},

	vs: {
		fontFamily: FONT.bodyBold,
		color: COLORS.lightNeutral,
		fontSize: 16,
	},

	sectionTitle: {
		fontFamily: FONT.bodyBold,
		color: COLORS.primary,
		textTransform: 'uppercase',
		letterSpacing: 1.5,
		fontSize: 12,
		marginBottom: 12,
	},

	searchBox: {
		borderWidth: 1,
		borderColor:
			'rgba(0,0,0,0.35)',
		borderRadius: 12,
		paddingHorizontal: 14,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
		marginBottom: 18,
	},

	input: {
		flex: 1,
		paddingVertical: 14,
		fontFamily: FONT.bodyBold,
		color: COLORS.primary,
	},

	resultList: {
		gap: 12,
	},

	resultItem: {
		backgroundColor: '#D9D9D9',
		borderRadius: 12,
		padding: 12,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 14,
		borderWidth: 1,
		borderColor:
			'rgba(0,0,0,0.08)',
	},

	resultItemSelected: {
		backgroundColor:
			'rgba(5,98,210,0.14)',
		borderColor: COLORS.secondary,
	},

	resultImageWrapper: {
		width: 58,
		height: 58,
		borderRadius: 999,
		backgroundColor:
			COLORS.lightNeutral,
		alignItems: 'center',
		justifyContent: 'center',
		overflow: 'hidden',
	},

	resultImage: {
		width: 56,
		height: 56,
	},

	resultInfo: {
		flex: 1,
	},

	resultName: {
		fontFamily: FONT.bodyBold,
		color: COLORS.primary,
		fontSize: 15,
		textTransform: 'uppercase',
	},

	resultBrand: {
		fontFamily: FONT.body,
		color: COLORS.darkGrey,
		opacity: 0.75,
		fontSize: 12,
		marginTop: 2,
		textTransform: 'uppercase',
	},

	addButton: {
		width: 42,
		height: 42,
		borderRadius: 999,
		borderWidth: 2,
		borderColor:
			COLORS.primary,
		alignItems: 'center',
		justifyContent: 'center',
	},

	addButtonSelected: {
		backgroundColor:
			COLORS.secondary,
		borderColor: COLORS.secondary,
	},

	emptyBox: {
		alignItems: 'center',
		justifyContent: 'center',
		padding: 30,
		borderWidth: 1,
		borderColor:
			'rgba(0,0,0,0.08)',
		borderRadius: 22,
		backgroundColor:
			'rgba(0,0,0,0.03)',
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

	compareButton: {
		marginTop: 32,
		backgroundColor:
			COLORS.secondary,
		borderRadius: 999,
		paddingVertical: 15,
		alignItems: 'center',
	},

	compareButtonDisabled: {
		opacity: 0.35,
	},

	compareButtonText: {
		fontFamily: FONT.bodyBold,
		color: COLORS.lightNeutral,
		textTransform: 'uppercase',
		fontSize: 16,
	},
});