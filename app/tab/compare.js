import { useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Image,
	ScrollView,
} from 'react-native';

import { useRouter, useLocalSearchParams } from 'expo-router';
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
		name: 'Bronco',
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
];

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
				id: firstCarId,
				brand: firstCarBrand,
				name: firstCarName,
				image: firstCarImage,
		  }
		: null;

	const [firstCar, setFirstCar] = useState(initialFirstCar);
	const [secondCar, setSecondCar] = useState(null);
	const [activeSlot, setActiveSlot] = useState(
		initialFirstCar ? 'second' : 'first'
	);

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
		if (!firstCar || !secondCar) return;

		router.push({
			pathname: '/screen/detail',
			params: {
				firstCarId: firstCar.id,
				firstCarBrand: firstCar.brand,
				firstCarName: firstCar.name,
				firstCarImage: firstCar.image,

				secondCarId: secondCar.id,
				secondCarBrand: secondCar.brand,
				secondCarName: secondCar.name,
				secondCarImage: secondCar.image,
			},
		});
	}

	const canCompare = firstCar && secondCar;

	return (
		<ScrollView
			style={styles.safeArea}
			contentContainerStyle={styles.container}
			showsVerticalScrollIndicator={false}
		>
			<Text style={styles.title}>Comparar</Text>

			<Text style={styles.subtitle}>
				Selecione dois modelos para analisar desempenho, consumo e
				diferenciais lado a lado.
			</Text>

			<View style={styles.slots}>
				<TouchableOpacity
					style={[
						styles.slotCard,
						activeSlot === 'first' && styles.slotCardActive,
					]}
					onPress={() => setActiveSlot('first')}
				>
					{firstCar ? (
						<>
							<TouchableOpacity
								style={styles.removeButton}
								onPress={() => removeCar('first')}
							>
								<Ionicons
									name="close-outline"
									size={18}
									color={COLORS.lightNeutral}
								/>
							</TouchableOpacity>

							<Image
								source={{ uri: firstCar.image }}
								style={styles.selectedImage}
							/>

							<Text style={styles.selectedName}>
								{firstCar.name}
							</Text>
						</>
					) : (
						<>
							<Ionicons
								name="car-sport-outline"
								size={34}
								color="rgba(0,0,0,0.45)"
							/>

							<Text style={styles.slotText}>
								Selecione o primeiro modelo
							</Text>
						</>
					)}
				</TouchableOpacity>

				<Text style={styles.vs}>VS</Text>

				<TouchableOpacity
					style={[
						styles.slotCard,
						activeSlot === 'second' && styles.slotCardActive,
					]}
					onPress={() => setActiveSlot('second')}
				>
					{secondCar ? (
						<>
							<TouchableOpacity
								style={styles.removeButton}
								onPress={() => removeCar('second')}
							>
								<Ionicons
									name="close-outline"
									size={18}
									color={COLORS.lightNeutral}
								/>
							</TouchableOpacity>

							<Image
								source={{ uri: secondCar.image }}
								style={styles.selectedImage}
							/>

							<Text style={styles.selectedName}>
								{secondCar.name}
							</Text>
						</>
					) : (
						<>
							<Ionicons
								name="car-sport-outline"
								size={34}
								color="rgba(0,0,0,0.45)"
							/>

							<Text style={styles.slotText}>
								Selecione o segundo modelo
							</Text>
						</>
					)}
				</TouchableOpacity>
			</View>

			<Text style={styles.sectionTitle}>Escolha um modelo</Text>

			<View style={styles.carGrid}>
				{cars.map((car) => {
					const selected =
						firstCar?.id === car.id || secondCar?.id === car.id;

					return (
						<TouchableOpacity
							key={car.id}
							style={[
								styles.carOption,
								selected && styles.carOptionSelected,
							]}
							onPress={() => selectCar(car)}
						>
							<Image
								source={{ uri: car.image }}
								style={styles.carOptionImage}
							/>

							<Text style={styles.carOptionName}>
								{car.name}
							</Text>

							{selected ? (
								<View style={styles.selectedBadge}>
									<Ionicons
										name="checkmark"
										size={16}
										color={COLORS.lightNeutral}
									/>
								</View>
							) : null}
						</TouchableOpacity>
					);
				})}
			</View>

			<TouchableOpacity
				style={[
					styles.compareButton,
					!canCompare && styles.compareButtonDisabled,
				]}
				onPress={handleCompare}
				disabled={!canCompare}
			>
				<Text style={styles.compareButtonText}>
					Comparar
				</Text>
			</TouchableOpacity>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: COLORS.lightNeutral,
	},

	container: {
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
		marginBottom: 30,
	},

	slots: {
		alignItems: 'center',
	},

	slotCard: {
		width: '100%',
		height: 160,
		borderRadius: 16,
		borderWidth: 1,
		borderStyle: 'dashed',
		borderColor: 'rgba(0,0,0,0.35)',
		backgroundColor: 'rgba(255,255,255,0.25)',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 16,
	},

	slotCardActive: {
		borderStyle: 'solid',
		borderColor: COLORS.secondary,
		backgroundColor: 'rgba(5,98,210,0.08)',
	},

	slotText: {
		marginTop: 12,
		fontFamily: FONT.bodyBold,
		color: COLORS.darkGrey,
		textTransform: 'uppercase',
		fontSize: 12,
		textAlign: 'center',
		opacity: 0.75,
	},

	vs: {
		fontFamily: FONT.bodyBold,
		color: COLORS.secondary,
		fontSize: 18,
		marginVertical: 14,
	},

	selectedImage: {
		width: '78%',
		height: 92,
		resizeMode: 'contain',
	},

	selectedName: {
		fontFamily: FONT.bodyBold,
		color: COLORS.primary,
		textTransform: 'uppercase',
		fontSize: 14,
		marginTop: 8,
	},

	removeButton: {
		position: 'absolute',
		top: 12,
		right: 12,
		width: 28,
		height: 28,
		borderRadius: 999,
		backgroundColor: COLORS.primary,
		alignItems: 'center',
		justifyContent: 'center',
		zIndex: 2,
	},

	sectionTitle: {
		fontFamily: FONT.bodyBold,
		color: COLORS.primary,
		textTransform: 'uppercase',
		letterSpacing: 2,
		fontSize: 13,
		marginTop: 34,
		marginBottom: 14,
	},

	carGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		gap: 12,
	},

	carOption: {
		width: '48%',
		minHeight: 138,
		borderRadius: 14,
		borderWidth: 1,
		borderColor: 'rgba(0,0,0,0.18)',
		backgroundColor: '#ECECEC',
		padding: 12,
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative',
	},

	carOptionSelected: {
		borderColor: COLORS.secondary,
		backgroundColor: 'rgba(5,98,210,0.12)',
	},

	carOptionImage: {
		width: '100%',
		height: 74,
		resizeMode: 'contain',
	},

	carOptionName: {
		fontFamily: FONT.bodyBold,
		color: COLORS.primary,
		textTransform: 'uppercase',
		fontSize: 12,
		textAlign: 'center',
		marginTop: 8,
	},

	selectedBadge: {
		position: 'absolute',
		top: 10,
		right: 10,
		width: 24,
		height: 24,
		borderRadius: 999,
		backgroundColor: COLORS.secondary,
		alignItems: 'center',
		justifyContent: 'center',
	},

	compareButton: {
		marginTop: 36,
		backgroundColor: COLORS.secondary,
		borderRadius: 999,
		paddingVertical: 15,
		alignItems: 'center',
	},

	compareButtonDisabled: {
		opacity: 0.4,
	},

	compareButtonText: {
		fontFamily: FONT.bodyBold,
		color: COLORS.lightNeutral,
		textTransform: 'uppercase',
		fontSize: 16,
	},
});