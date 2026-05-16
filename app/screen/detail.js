import { useMemo, useState } from 'react';

import {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
	ScrollView,
} from 'react-native';

import {
	Ionicons,
	MaterialCommunityIcons,
} from '@expo/vector-icons';

import { useRouter, useLocalSearchParams } from 'expo-router';

import { COLORS, FONT } from '../../style/theme';
import { getCarModel, getComparisonSummary } from '../data/carModels';
import { useFavorites } from '../_layout';

export default function CompareDetailScreen() {
	const router = useRouter();
	const {
		isFavorite,
		setFavorite,
		isComparisonFavorite,
		toggleComparisonFavorite,
	} = useFavorites();

	const {
		firstCarId,
		firstCarBrand,
		firstCarName,
		firstCarImage,
		secondCarId,
		secondCarBrand,
		secondCarName,
		secondCarImage,
	} = useLocalSearchParams();

	const [expandedSection, setExpandedSection] =
		useState('performance');

	function toggleSection(section) {
		setExpandedSection((current) =>
			current === section ? null : section
		);
	}

	const firstCar = useMemo(() => {
		const car = getCarModel(firstCarId || '1');

		return {
			...car,
			brand: String(firstCarBrand || car.brand),
			name: String(firstCarName || car.name),
			image: String(firstCarImage || car.image),
		};
	}, [firstCarBrand, firstCarId, firstCarImage, firstCarName]);

	const secondCar = useMemo(() => {
		const car = getCarModel(secondCarId || '2');

		return {
			...car,
			brand: String(secondCarBrand || car.brand),
			name: String(secondCarName || car.name),
			image: String(secondCarImage || car.image),
		};
	}, [secondCarBrand, secondCarId, secondCarImage, secondCarName]);

	const areComparedCarsFavorite =
		isFavorite(firstCar.id) && isFavorite(secondCar.id);
	const isCurrentComparisonFavorite = isComparisonFavorite(
		firstCar.id,
		secondCar.id
	);

	function handleToggleComparisonFavorite() {
		toggleComparisonFavorite({
			firstCar,
			secondCar,
		});

		const nextFavoriteValue = !isCurrentComparisonFavorite;
		setFavorite(firstCar.id, nextFavoriteValue);
		setFavorite(secondCar.id, nextFavoriteValue);
	}

	const comparisonSummary = getComparisonSummary(firstCar.id, secondCar.id);

	const sections = firstCar.sections.map((section) => {
		const matchingSection =
			secondCar.sections.find((item) => item.id === section.id) || {
				items: [],
			};

		return {
			...section,
			otherItems: matchingSection.items,
		};
	});

	function getCarAdvantage(section) {
		const firstCount = section.items.length;
		const secondCount = section.otherItems.length;
		const diff = firstCount - secondCount;

		if (diff > 1) return { first: true, second: false, tied: false };
		if (diff < -1) return { first: false, second: true, tied: false };

		return { first: false, second: false, tied: true };
	}

	return (
		<ScrollView
			style={styles.safeArea}
			contentContainerStyle={styles.container}
			showsVerticalScrollIndicator={false}
		>
			<View style={styles.topBar}>
				<TouchableOpacity
					style={styles.iconButton}
					onPress={() => router.back()}
				>
					<Ionicons
						name="close-outline"
						size={28}
						color={COLORS.primary}
					/>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.iconButton}
					onPress={handleToggleComparisonFavorite}
				>
					<Ionicons
						name={isCurrentComparisonFavorite ? 'star' : 'star-outline'}
						size={24}
						color={COLORS.primary}
					/>
				</TouchableOpacity>
			</View>

			<Text style={styles.title}>Comparação detalhada</Text>

			<Text style={styles.subtitle}>
				Visualize diferenças de desempenho, tecnologia e eficiência entre os modelos.
			</Text>

			<View style={styles.hero}>
				<View style={styles.carSide}>
					<Image
						source={{ uri: firstCar.image }}
						style={styles.carImage}
					/>

					<Text style={styles.carName}>{firstCar.name}</Text>
				</View>

				<View style={styles.vsCircle}>
					<Text style={styles.vsText}>VS</Text>
				</View>

				<View style={styles.carSide}>
					<Image
						source={{ uri: secondCar.image }}
						style={styles.carImage}
					/>

					<Text style={styles.carName}>{secondCar.name}</Text>
				</View>
			</View>

			<View style={styles.summaryCard}>
				<View style={styles.summaryHeader}>
					<MaterialCommunityIcons
						name="radar"
						size={26}
						color={COLORS.secondary}
					/>

					<Text style={styles.summaryTitle}>Resumo inteligente</Text>
				</View>

				<Text style={styles.summaryText}>{comparisonSummary}</Text>
			</View>

			{sections.map((section) => {
				const isOpen = expandedSection === section.id;
				const advantage = getCarAdvantage(section);

				return (
					<View style={styles.section} key={section.id}>
						<TouchableOpacity
							style={styles.sectionHeader}
							onPress={() => toggleSection(section.id)}
						>
							<Text style={styles.sectionTitle}>
								{section.title}
							</Text>

							<Ionicons
								name={
									isOpen
										? 'chevron-up-outline'
										: 'chevron-down-outline'
								}
								size={22}
								color={COLORS.primary}
							/>
						</TouchableOpacity>

						{isOpen ? (
							<View style={styles.dualCards}>
								<View
									style={[
										styles.infoCard,
										advantage.first && styles.advantageCard,
										advantage.first && styles.firstCardAdvantage,
									]}
								>
									<View style={styles.cardHeader}>
										<Text style={styles.infoTitle}>
											{firstCar.name}
										</Text>

										{advantage.first ? (
											<View style={styles.badgeWinner}>
												<MaterialCommunityIcons
													name="crown"
													size={14}
													color={COLORS.lightNeutral}
												/>
											</View>
										) : null}
									</View>

									{section.items.map((item) => (
										<Text
											key={`${section.id}-left-${item}`}
											style={styles.infoText}
										>
											- {item}
										</Text>
									))}
								</View>

								<View
									style={[
										styles.infoCard,
										advantage.second && styles.advantageCard,
										advantage.second && styles.secondCardAdvantage,
									]}
								>
									<View style={styles.cardHeader}>
										<Text style={styles.infoTitle}>
											{secondCar.name}
										</Text>

										{advantage.second ? (
											<View style={styles.badgeWinner}>
												<MaterialCommunityIcons
													name="crown"
													size={14}
													color={COLORS.lightNeutral}
												/>
											</View>
										) : null}
									</View>

									{section.otherItems.map((item) => (
										<Text
											key={`${section.id}-right-${item}`}
											style={styles.infoText}
										>
											- {item}
										</Text>
									))}
								</View>
							</View>
						) : null}
					</View>
				);
			})}

			{/* <TouchableOpacity style={styles.compareButton}>
				<MaterialCommunityIcons
					name="source-branch-sync"
					size={20}
					color={COLORS.lightNeutral}
				/>

				<Text style={styles.compareButtonText}>
					Gerar relatório
				</Text>
			</TouchableOpacity> */}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: COLORS.lightNeutral,
	},

	container: {
		padding: 24,
		paddingTop: 64,
		paddingBottom: 120,
	},

	topBar: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 24,
	},

	iconButton: {
		width: 42,
		height: 42,
		borderRadius: 999,
		backgroundColor: 'rgba(0,0,0,0.06)',
		alignItems: 'center',
		justifyContent: 'center',
	},

	title: {
		fontFamily: FONT.title,
		fontSize: 42,
		color: COLORS.primary,
		textTransform: 'uppercase',
	},

	subtitle: {
		fontFamily: FONT.body,
		color: COLORS.darkGrey,
		opacity: 0.72,
		lineHeight: 22,
		marginTop: 10,
		marginBottom: 30,
	},

	hero: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 30,
	},

	carSide: {
		width: '40%',
		alignItems: 'center',
	},

	carImage: {
		width: 140,
		height: 90,
		resizeMode: 'contain',
	},

	carName: {
		fontFamily: FONT.bodyBold,
		color: COLORS.secondary,
		textTransform: 'uppercase',
		fontSize: 14,
		marginTop: 8,
	},

	vsCircle: {
		width: 52,
		height: 52,
		borderRadius: 999,
		backgroundColor: COLORS.secondary,
		alignItems: 'center',
		justifyContent: 'center',
	},

	vsText: {
		fontFamily: FONT.bodyBold,
		color: COLORS.lightNeutral,
		fontSize: 14,
	},

	summaryCard: {
		backgroundColor: COLORS.primary,
		borderRadius: 24,
		padding: 24,
		marginBottom: 34,
	},

	summaryHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
		marginBottom: 14,
	},

	summaryTitle: {
		fontFamily: FONT.bodyBold,
		color: COLORS.lightNeutral,
		textTransform: 'uppercase',
		fontSize: 16,
	},

	summaryText: {
		fontFamily: FONT.body,
		color: COLORS.lightNeutral,
		opacity: 0.82,
		lineHeight: 22,
	},

	section: {
		marginBottom: 18,
	},

	sectionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingBottom: 14,
		borderBottomWidth: 1,
		borderBottomColor: 'rgba(0,0,0,0.12)',
	},

	sectionTitle: {
		fontFamily: FONT.bodyBold,
		fontSize: 24,
		textTransform: 'uppercase',
		color: COLORS.primary,
	},

	dualCards: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 18,
	},

	infoCard: {
		width: '48%',
		backgroundColor: '#ECECEC',
		borderRadius: 18,
		padding: 18,
		minHeight: 130,
		borderLeftWidth: 3,
		borderLeftColor: '#ECECEC',
	},

	advantageCard: {
		backgroundColor: 'rgba(255, 193, 7, 0.08)',
	},

	firstCardAdvantage: {
		borderLeftColor: COLORS.secondary,
	},

	secondCardAdvantage: {
		borderLeftColor: COLORS.secondary,
	},

	cardHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 12,
	},

	badgeWinner: {
		backgroundColor: COLORS.secondary,
		borderRadius: 999,
		width: 24,
		height: 24,
		alignItems: 'center',
		justifyContent: 'center',
	},

	infoTitle: {
		fontFamily: FONT.bodyBold,
		color: COLORS.primary,
		textTransform: 'uppercase',
		fontSize: 13,
		marginBottom: 12,
	},

	infoText: {
		fontFamily: FONT.body,
		color: COLORS.primary,
		opacity: 0.75,
		lineHeight: 21,
		fontSize: 13,
	},

	compareButton: {
		marginTop: 28,
		backgroundColor: COLORS.secondary,
		borderRadius: 999,
		paddingVertical: 16,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		gap: 10,
	},

	compareButtonText: {
		fontFamily: FONT.bodyBold,
		color: COLORS.lightNeutral,
		textTransform: 'uppercase',
		fontSize: 14,
	},
});