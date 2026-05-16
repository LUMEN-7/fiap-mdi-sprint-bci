import { useMemo, useState } from 'react';
import {
	Image,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { COLORS, FONT } from '../../style/theme';
import { useFavorites } from '../_layout';
import { getCarModel } from '../data/carModels';

export default function SavedScreen() {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState('models');
	const { favoriteIds, toggleFavorite, favoriteComparisons } = useFavorites();

	const savedModels = useMemo(
		() =>
			favoriteIds.map((id) => {
				const car = getCarModel(id);
				const specsByLabel = Object.fromEntries(
					car.specs.map((spec) => [spec.label, spec.value])
				);

				return {
					id: car.id,
					name: car.name,
					brand: car.brand,
					image: car.image,
					engine: specsByLabel.Motor || '-',
					power: specsByLabel.Potencia || '-',
					type: specsByLabel.Tipo || '-',
				};
			}),
		[favoriteIds]
	);

	function handleOpenDetails(car) {
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

	function handleOpenComparison(comparison) {
		router.push({
			pathname: '/screen/detail',
			params: {
				firstCarId: comparison.firstCar.id,
				firstCarBrand: comparison.firstCar.brand,
				firstCarName: comparison.firstCar.name,
				firstCarImage: comparison.firstCar.image,
				secondCarId: comparison.secondCar.id,
				secondCarBrand: comparison.secondCar.brand,
				secondCarName: comparison.secondCar.name,
				secondCarImage: comparison.secondCar.image,
			},
		});
	}

	return (
		<SafeAreaView style={styles.safeArea}>
			<ScrollView
				contentContainerStyle={styles.container}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.header}>
					<View style={styles.topBar}>
						<TouchableOpacity
							style={styles.backButton}
							onPress={() => router.back()}
						>
							<Ionicons
								name="chevron-back"
								size={28}
								color={COLORS.lightNeutral}
							/>
						</TouchableOpacity>
					</View>
					<Text style={styles.title}>Salvos</Text>
					<Text style={styles.subtitle}>
						Acesse seus modelos e comparações favoritas.
					</Text>
				</View>

				<View style={styles.tabs}>
					<TouchableOpacity
						style={[
							styles.tabButton,
							activeTab === 'models' && styles.tabButtonActive,
						]}
						onPress={() => setActiveTab('models')}
					>
						<Ionicons
							name="car-sport-outline"
							size={18}
							color={
								activeTab === 'models'
									? COLORS.primary
									: COLORS.lightNeutral
							}
						/>

						<Text
							style={[
								styles.tabButtonText,
								activeTab === 'models' &&
									styles.tabButtonTextActive,
							]}
						>
							Modelos
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={[
							styles.tabButton,
							activeTab === 'comparisons' && styles.tabButtonActive,
						]}
						onPress={() => setActiveTab('comparisons')}
					>
						<Ionicons
							name="git-compare-outline"
							size={18}
							color={
								activeTab === 'comparisons'
									? COLORS.primary
									: COLORS.lightNeutral
							}
						/>

						<Text
							style={[
								styles.tabButtonText,
								activeTab === 'comparisons' &&
									styles.tabButtonTextActive,
							]}
						>
							Comparações
						</Text>
					</TouchableOpacity>
				</View>

				{activeTab === 'models' ? (
					<View style={styles.list}>
						{savedModels.length === 0 ? (
							<EmptyState
								icon="bookmark-outline"
								title="Nenhum modelo salvo"
								text="Quando você salvar um modelo, ele aparecerá aqui."
							/>
						) : (
							savedModels.map((car) => (
								<View key={car.id} style={styles.modelCard}>
									<Image
										source={{ uri: car.image }}
										style={styles.carImage}
										resizeMode="contain"
									/>

									<View style={styles.cardContent}>
										<View style={styles.cardHeader}>
											<View>
												<Text style={styles.carName}>
													{car.name}
												</Text>
												<Text style={styles.carBrand}>
													{car.brand}
												</Text>
											</View>

											<TouchableOpacity
												style={styles.bookmarkButton}
												onPress={() => toggleFavorite(car.id)}
											>
												<Ionicons
													name="star"
													size={22}
													color={COLORS.secondary}
												/>
											</TouchableOpacity>
										</View>

										<View style={styles.infoGrid}>
											<View style={styles.infoItem}>
												<Text style={styles.infoLabel}>
													Motor
												</Text>
												<Text style={styles.infoValue}>
													{car.engine}
												</Text>
											</View>

											<View style={styles.infoItem}>
												<Text style={styles.infoLabel}>
													Potência
												</Text>
												<Text style={styles.infoValue}>
													{car.power}
												</Text>
											</View>

											<View style={styles.infoItem}>
												<Text style={styles.infoLabel}>
													Tipo
												</Text>
												<Text style={styles.infoValue}>
													{car.type}
												</Text>
											</View>
										</View>

										<TouchableOpacity
											style={styles.detailsButton}
											onPress={() => handleOpenDetails(car)}
										>
											<Text style={styles.detailsButtonText}>
												Ver detalhes
											</Text>
											<Ionicons
												name="arrow-forward"
												size={18}
												color={COLORS.primary}
											/>
										</TouchableOpacity>
									</View>
								</View>
							))
						)}
					</View>
				) : (
					<View style={styles.list}>
						{favoriteComparisons.length === 0 ? (
							<EmptyState
								icon="git-compare-outline"
								title="Nenhuma comparação salva"
								text="Quando você salvar uma comparação, ela aparecerá aqui."
							/>
						) : (
							favoriteComparisons.map((comparison) => (
								<View key={comparison.id} style={styles.comparisonCard}>
									<View style={styles.comparisonImages}>
										<View style={styles.comparisonCarBox}>
											<Image
												source={{
													uri: comparison.firstCar.image,
												}}
												style={styles.comparisonCarImage}
												resizeMode="contain"
											/>
											<Text style={styles.comparisonCarName}>
												{comparison.firstCar.name}
											</Text>
											<Text style={styles.comparisonCarBrand}>
												{comparison.firstCar.brand}
											</Text>
										</View>

										<View style={styles.versusCircle}>
											<Text style={styles.versusText}>X</Text>
										</View>

										<View style={styles.comparisonCarBox}>
											<Image
												source={{
													uri: comparison.secondCar.image,
												}}
												style={styles.comparisonCarImage}
												resizeMode="contain"
											/>
											<Text style={styles.comparisonCarName}>
												{comparison.secondCar.name}
											</Text>
											<Text style={styles.comparisonCarBrand}>
												{comparison.secondCar.brand}
											</Text>
										</View>
									</View>

									<View style={styles.comparisonFooter}>
										<Text style={styles.comparisonDate}>
											Salvo em {comparison.createdAt}
										</Text>

										<TouchableOpacity
											style={styles.compareButton}
											onPress={() =>
												handleOpenComparison(comparison)
											}
										>
											<Text style={styles.compareButtonText}>
												Abrir
											</Text>
											<Ionicons
												name="arrow-forward"
												size={17}
												color={COLORS.primary}
											/>
										</TouchableOpacity>
									</View>
								</View>
							))
						)}
					</View>
				)}
			</ScrollView>
		</SafeAreaView>
	);
}

function EmptyState({ icon, title, text }) {
	return (
		<View style={styles.emptyCard}>
			<Ionicons
				name={icon}
				size={42}
				color="rgba(255,255,255,0.6)"
			/>
			<Text style={styles.emptyTitle}>{title}</Text>
			<Text style={styles.emptyText}>{text}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: COLORS.primary,
	},

	container: {
		flexGrow: 1,
		padding: 28,
		paddingBottom: 40,
	},

	topBar: {
		marginVertical: 24,
	},

	header: {
		marginBottom: 22,
	},

	backButton: {
		width: 44,
		height: 44,
		borderRadius: 999,
		backgroundColor: 'rgba(255,255,255,0.1)',
		alignItems: 'center',
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
		opacity: 0.75,
		marginTop: 4,
	},

	tabs: {
		flexDirection: 'row',
		backgroundColor: 'rgba(255,255,255,0.08)',
		borderRadius: 999,
		padding: 5,
		marginBottom: 24,
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.12)',
	},

	tabButton: {
		flex: 1,
		paddingVertical: 10,
		borderRadius: 999,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		gap: 7,
	},

	tabButtonActive: {
		backgroundColor: COLORS.lightNeutral,
	},

	tabButtonText: {
		fontFamily: FONT.bodyBold,
		color: COLORS.lightNeutral,
		fontSize: 13,
		textTransform: 'uppercase',
	},

	tabButtonTextActive: {
		color: COLORS.primary,
	},

	list: {
		gap: 16,
	},

	modelCard: {
		backgroundColor: 'rgba(255,255,255,0.08)',
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.16)',
		borderRadius: 20,
		overflow: 'hidden',
	},

	carImage: {
		width: '100%',
		height: 150,
		backgroundColor: 'rgba(255,255,255,0.05)',
	},

	cardContent: {
		padding: 18,
	},

	cardHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: 18,
	},

	carName: {
		fontFamily: FONT.bodyBold,
		color: COLORS.lightNeutral,
		fontSize: 22,
	},

	carBrand: {
		fontFamily: FONT.body,
		color: COLORS.lightNeutral,
		opacity: 0.65,
		marginTop: 2,
	},

	bookmarkButton: {
		width: 42,
		height: 42,
		borderRadius: 999,
		backgroundColor: 'rgba(255,255,255,0.1)',
		alignItems: 'center',
		justifyContent: 'center',
	},

	infoGrid: {
		flexDirection: 'row',
		gap: 10,
		marginBottom: 18,
	},

	infoItem: {
		flex: 1,
		backgroundColor: 'rgba(255,255,255,0.08)',
		borderRadius: 12,
		padding: 10,
	},

	infoLabel: {
		fontFamily: FONT.body,
		color: COLORS.lightNeutral,
		opacity: 0.6,
		fontSize: 11,
	},

	infoValue: {
		fontFamily: FONT.bodyBold,
		color: COLORS.lightNeutral,
		fontSize: 13,
		marginTop: 4,
	},

	detailsButton: {
		backgroundColor: COLORS.lightNeutral,
		borderRadius: 99,
		paddingVertical: 10,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		gap: 8,
	},

	detailsButtonText: {
		fontFamily: FONT.bodyBold,
		color: COLORS.primary,
		fontSize: 14,
		textTransform: 'uppercase',
	},

	comparisonCard: {
		backgroundColor: 'rgba(255,255,255,0.08)',
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.16)',
		borderRadius: 20,
		padding: 16,
	},

	comparisonImages: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
	},

	comparisonCarBox: {
		flex: 1,
		backgroundColor: 'rgba(255,255,255,0.06)',
		borderRadius: 16,
		padding: 10,
		alignItems: 'center',
		minHeight: 150,
		justifyContent: 'center',
	},

	comparisonCarImage: {
		width: '100%',
		height: 82,
		marginBottom: 8,
	},

	comparisonCarName: {
		fontFamily: FONT.bodyBold,
		color: COLORS.lightNeutral,
		fontSize: 13,
		textAlign: 'center',
	},

	comparisonCarBrand: {
		fontFamily: FONT.body,
		color: COLORS.lightNeutral,
		opacity: 0.6,
		fontSize: 11,
		marginTop: 2,
	},

	versusCircle: {
		width: 34,
		height: 34,
		borderRadius: 999,
		backgroundColor: COLORS.lightNeutral,
		alignItems: 'center',
		justifyContent: 'center',
	},

	versusText: {
		fontFamily: FONT.bodyBold,
		color: COLORS.primary,
		fontSize: 16,
	},

	comparisonFooter: {
		borderTopWidth: 1,
		borderTopColor: 'rgba(255,255,255,0.12)',
		marginTop: 14,
		paddingTop: 14,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},

	comparisonDate: {
		fontFamily: FONT.body,
		color: COLORS.lightNeutral,
		opacity: 0.65,
		fontSize: 12,
	},

	compareButton: {
		backgroundColor: COLORS.lightNeutral,
		borderRadius: 999,
		paddingVertical: 8,
		paddingHorizontal: 16,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
	},

	compareButtonText: {
		fontFamily: FONT.bodyBold,
		color: COLORS.primary,
		fontSize: 13,
		textTransform: 'uppercase',
	},

	emptyCard: {
		flex: 1,
		borderWidth: 1,
		borderStyle: 'dashed',
		borderColor: 'rgba(255,255,255,0.24)',
		borderRadius: 20,
		padding: 30,
		alignItems: 'center',
		justifyContent: 'center',
		minHeight: 360,
	},

	emptyTitle: {
		fontFamily: FONT.bodyBold,
		color: COLORS.lightNeutral,
		fontSize: 18,
		marginTop: 14,
	},

	emptyText: {
		fontFamily: FONT.body,
		color: COLORS.lightNeutral,
		opacity: 0.65,
		textAlign: 'center',
		marginTop: 6,
		lineHeight: 20,
	},
});