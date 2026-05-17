import { useRef, useState, useEffect } from 'react';
import {
	Animated,
	Dimensions,
	Image,
	PanResponder,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { COLORS, FONT } from '../../style/theme';
import { getFichaTecnica } from '../../services/llamaApi';
import { useFavorites, useRecentViews } from '../_layout';
import { fetchAutoDevVehicleByVin } from '../../services/autoDevApi';

const { height, width } = Dimensions.get('window');

const COLLAPSED_TOP = height * 0.47;
const EXPANDED_TOP = height * 0.08;

function formatLabel(text) {
	return text
		.replace(/_/g, ' ')
		.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatSectionItems(section) {
	if (!section) return [];

	const result = [];

	Object.entries(section).forEach(([key, value]) => {
		if (Array.isArray(value)) {
			value.forEach((item) => {
				result.push(`${formatLabel(key)}: ${item}`);
			});
		} else {
			result.push(`${formatLabel(key)}: ${value}`);
		}
	});

	return result;
}

export default function InformationScreen() {
	const router = useRouter();
	const params = useLocalSearchParams();
	const { isFavorite, toggleFavorite } = useFavorites();
	const { addRecentView } = useRecentViews();

	const id = String(params.id || '');
	const brand = String(params.brand || '');
	const name = String(params.name || '');
	const image = String(params.image || '');
	const photoGalleryParam = params.photoGallery ? String(params.photoGallery) : '';

	const [imageUrl, setImageUrl] = useState(
		image && image !== 'Não disponível' ? image : ''
	);
	const [photoGallery, setPhotoGallery] = useState([]);
	const [userSelectedImage, setUserSelectedImage] = useState(false);

	const currentCarId = id;
	const isCurrentCarFavorite = isFavorite(currentCarId);

	const [expanded, setExpanded] = useState(false);
	const [openSection, setOpenSection] = useState(null);
	const [loadingFicha, setLoadingFicha] = useState(false);
	const [showFullDescription, setShowFullDescription] = useState(false);

	const [modelData, setModelData] = useState({
		specs: [],
		sections: [],
		raw: null,
	});

	async function loadFicha() {
		const marca = brand.trim();
		const modelo = name.trim();

		if (!marca || !modelo) return;

		setLoadingFicha(true);

		try {
			const ficha = await getFichaTecnica(marca, modelo);

			if (
				ficha?.imagem_sugerida &&
				ficha.imagem_sugerida !== 'Não disponível' &&
				String(ficha.imagem_sugerida).startsWith('http')
			) {
				setImageUrl(String(ficha.imagem_sugerida).trim());
			}

			setModelData({
				specs: [
					{
						icon: 'engine',
						label: 'Motor',
						value: ficha?.resumo_rapido?.motor || 'N/D',
					},
					{
						icon: 'horse',
						label: 'Potência',
						value: ficha?.resumo_rapido?.potencia || 'N/D',
					},
					{
						icon: 'shape-outline',
						label: 'Tipo',
						value: ficha?.resumo_rapido?.tipo || 'N/D',
					},
					{
						icon: 'gas-station',
						label: 'Consumo',
						value: ficha?.resumo_rapido?.consumo || 'N/D',
					},
				],

				sections: [
					{
						id: 'performance',
						title: 'Performance',
						items: formatSectionItems(ficha?.performance),
					},
					{
						id: 'consumo',
						title: 'Consumo',
						items: formatSectionItems(ficha?.consumo),
					},
					{
						id: 'seguranca',
						title: 'Segurança',
						items: formatSectionItems(ficha?.seguranca),
					},
					{
						id: 'tecnologia',
						title: 'Tecnologia',
						items: formatSectionItems(ficha?.tecnologia),
					},
					{
						id: 'conforto',
						title: 'Conforto',
						items: formatSectionItems(ficha?.conforto),
					},
				],

				raw: ficha,
			});

			setShowFullDescription(false);
		} catch (err) {
			console.warn('Erro ao carregar ficha:', err.message || err);
		} finally {
			setLoadingFicha(false);
		}
	}

	useEffect(() => {
		// parse photoGallery param if provided (stringified JSON)
		if (photoGalleryParam) {
			try {
				const parsed = JSON.parse(photoGalleryParam);
				if (Array.isArray(parsed) && parsed.length > 0) {
					// Normalize and dedupe while preserving original URLs (remove query/hash for uniqueness)
					const seen = new Set();
					const uniqueGallery = [];
					for (const rawUrl of parsed.map((u) => String(u || '').trim()).filter(Boolean)) {
						let canonical;
						try {
							const tmp = new URL(rawUrl);
							canonical = `${tmp.origin}${tmp.pathname}`;
						} catch (e) {
							canonical = rawUrl.split(/[?#]/)[0];
						}
						if (seen.has(canonical)) continue;
						seen.add(canonical);
						uniqueGallery.push(rawUrl);
					}
					setPhotoGallery(uniqueGallery);
					if (!userSelectedImage && uniqueGallery.length > 0) {
						setImageUrl(uniqueGallery[0]);
					}
				}
			} catch (e) {
				// ignore parse errors
			}
		}

		// If we didn't receive a gallery but we have a VIN, attempt to fetch photos
		async function ensureGalleryFromVin() {
			if ((!photoGalleryParam || photoGallery.length === 0) && params.vin) {
				try {
					const vin = String(params.vin || '').trim();
					if (vin) {
						const { retailPhotos } = await fetchAutoDevVehicleByVin(vin);
						// Normalize/dedupe retailPhotos similarly
						const seen = new Set();
						const uniqueGallery = [];
						for (const rawUrl of (retailPhotos || []).map((u) => String(u || '').trim()).filter(Boolean)) {
							let canonical;
							try {
								const tmp = new URL(rawUrl);
								canonical = `${tmp.origin}${tmp.pathname}`;
							} catch (e) {
								canonical = rawUrl.split(/[?#]/)[0];
							}
							if (seen.has(canonical)) continue;
							seen.add(canonical);
							uniqueGallery.push(rawUrl);
						}
						if (uniqueGallery.length > 0) {
							setPhotoGallery(uniqueGallery);
							if (!userSelectedImage) {
								setImageUrl(uniqueGallery[0]);
							}
						}
					}
				} catch (e) {
					// ignore
				}
			}
		}

		ensureGalleryFromVin();
		loadFicha();
	}, [brand, name]);

	useEffect(() => {
		if (!id || !brand || !name) return;

		addRecentView({
			id,
			brand,
			name,
			image: imageUrl,
		});
	}, [id, brand, name, imageUrl]);


	const translateY = useRef(new Animated.Value(COLLAPSED_TOP)).current;

	const panResponder = useRef(
		PanResponder.create({
			onMoveShouldSetPanResponder: (_, gesture) => {
				return Math.abs(gesture.dy) > 8;
			},

			onPanResponderMove: (_, gesture) => {
				const nextPosition = expanded
					? EXPANDED_TOP + gesture.dy
					: COLLAPSED_TOP + gesture.dy;

				if (
					nextPosition >= EXPANDED_TOP &&
					nextPosition <= COLLAPSED_TOP
				) {
					translateY.setValue(nextPosition);
				}
			},

			onPanResponderRelease: (_, gesture) => {
				if (gesture.dy < -60) {
					openSheet();
					return;
				}

				if (gesture.dy > 60) {
					closeSheet();
					return;
				}

				expanded ? openSheet() : closeSheet();
			},
		})
	).current;

	function openSheet() {
		setExpanded(true);

		Animated.spring(translateY, {
			toValue: EXPANDED_TOP,
			useNativeDriver: false,
			bounciness: 4,
		}).start();
	}

	function closeSheet() {
		setExpanded(false);
		setOpenSection(null);

		Animated.spring(translateY, {
			toValue: COLLAPSED_TOP,
			useNativeDriver: false,
			bounciness: 4,
		}).start();
	}

	function toggleSection(sectionId) {
		setOpenSection((current) =>
			current === sectionId ? null : sectionId
		);
	}

	function toggleDescription() {
		setShowFullDescription((current) => !current);
	}

	const shortDescription =
		modelData.raw?.resumo ||
		'Este veículo combina presença, tecnologia e proposta clara para uso urbano e rodoviário.';

	const fullDescription =
		modelData.raw?.descricao_detalhada ||
		'Desempenho, presença e tecnologia se encontram em um modelo projetado para ir além da comparação.';

	return (
		<View style={styles.container}>
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
					onPress={() =>
						toggleFavorite({
							id: currentCarId,
							brand,
							name,
							image: imageUrl,
							photoGallery,
							engine: modelData.raw?.resumo_rapido?.motor || 'N/D',
							power: modelData.raw?.resumo_rapido?.potencia || 'N/D',
							type: modelData.raw?.resumo_rapido?.tipo || 'N/D',
						})
					}
				>
					<Ionicons
						name={isCurrentCarFavorite ? 'star' : 'star-outline'}
						size={24}
						color={COLORS.primary}
					/>
				</TouchableOpacity>
			</View>

			{imageUrl ? (
				<Image
					source={{ uri: imageUrl }}
					style={styles.carImage}
					resizeMode="contain"
				/>
			) : (
				<View style={styles.imageFallback}>
					<Ionicons
						name="car-sport-outline"
						size={90}
						color={COLORS.primary}
					/>
				</View>
			)}

			<Animated.View
				style={[
					styles.sheet,
					{
						top: translateY,
					},
				]}
			>
				<View style={styles.dragArea} {...panResponder.panHandlers}>
					<View style={styles.handle} />
				</View>

				<ScrollView
					showsVerticalScrollIndicator={false}
					scrollEnabled={expanded}
					contentContainerStyle={styles.sheetContent}
				>
					<Text style={styles.brand}>{brand}</Text>
					<Text style={styles.title}>{name}</Text>

					{photoGallery && photoGallery.length > 0 ? (
						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}
							style={styles.thumbnailRow}
							contentContainerStyle={{ gap: 10 }}
						>
							{photoGallery.map((url, idx) => (
								<TouchableOpacity
									key={String(url) + idx}
										onPress={() => {
											setImageUrl(url);
											setUserSelectedImage(true);
										}}
								>
									<Image
										source={{ uri: url }}
										style={styles.thumbnail}
										resizeMode="cover"
									/>
								</TouchableOpacity>
							))}
						</ScrollView>
					) : null}

					<View style={styles.descriptionBlock}>
						<Text style={styles.description}>{shortDescription}</Text>

						{showFullDescription ? (
							<Text style={styles.descriptionLong}>
								{fullDescription}
							</Text>
						) : null}

						<TouchableOpacity onPress={toggleDescription}>
							<Text style={styles.readMore}>
								{showFullDescription ? 'Mostrar menos' : 'Leia mais'}
							</Text>
						</TouchableOpacity>
					</View>

					{loadingFicha ? (
						<Text style={styles.loadingText}>
							Carregando ficha técnica...
						</Text>
					) : null}

					<View style={styles.specsRow}>
						{modelData.specs.map((item) => (
							<View key={item.label} style={styles.specItem}>
								<View style={styles.specIcon}>
									<MaterialCommunityIcons
										name={item.icon}
										size={28}
										color={COLORS.lightNeutral}
									/>
								</View>

								<Text style={styles.specLabel}>{item.label}</Text>

								<Text style={styles.specValue}>{item.value}</Text>
							</View>
						))}
					</View>

					{!expanded ? (
						<View style={styles.dragInfo}>
							<Ionicons
								name="chevron-up-outline"
								size={26}
								color="rgba(255,255,255,0.65)"
							/>

							<Text style={styles.dragText}>
								Arraste para cima para saber mais
							</Text>
						</View>
					) : (
						<View style={styles.moreContent}>
							{modelData.sections.map((section) => {
								const isOpen = openSection === section.id;

								return (
									<View
										key={section.id}
										style={styles.sectionBlock}
									>
										<TouchableOpacity
											style={styles.infoRow}
											onPress={() =>
												toggleSection(section.id)
											}
										>
											<Text style={styles.infoTitle}>
												{section.title}
											</Text>

											<Ionicons
												name={
													isOpen
														? 'chevron-up-outline'
														: 'chevron-down-outline'
												}
												size={20}
												color={COLORS.lightNeutral}
											/>
										</TouchableOpacity>

										{isOpen ? (
											<View style={styles.sectionContent}>
												{section.items.length > 0 ? (
													section.items.map(
														(item, index) => (
															<View
																key={index}
																style={
																	styles.sectionItem
																}
															>
																<View
																	style={
																		styles.bullet
																	}
																/>

																<Text
																	style={
																		styles.sectionText
																	}
																>
																	{item}
																</Text>
															</View>
														)
													)
												) : (
													<Text style={styles.sectionText}>
														Não disponível
													</Text>
												)}
											</View>
										) : null}
									</View>
								);
							})}

							<TouchableOpacity
								style={styles.compareButton}
								onPress={() => {
									router.push({
										pathname: '/tab/compare',
										params: {
											firstCarId: id,
											firstCarBrand: brand,
											firstCarName: name,
											firstCarImage: imageUrl,
										},
									});
								}}
							>
								<Text style={styles.compareButtonText}>
									Comparar
								</Text>
							</TouchableOpacity>
						</View>
					)}
				</ScrollView>
			</Animated.View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.lightNeutral,
		overflow: 'hidden',
	},

	topBar: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 24,
		paddingTop: 48,
		paddingHorizontal: 24,
	},

	iconButton: {
		width: 42,
		height: 42,
		borderRadius: 999,
		backgroundColor: 'rgba(0,0,0,0.06)',
		alignItems: 'center',
		justifyContent: 'center',
	},

	carImage: {
		position: 'absolute',
		top: height * 0.12,
		alignSelf: 'center',
		width: width * 0.95,
		height: height * 0.32,
	},

	imageFallback: {
		position: 'absolute',
		top: height * 0.16,
		alignSelf: 'center',
		width: width * 0.95,
		height: height * 0.32,
		alignItems: 'center',
		justifyContent: 'center',
	},

	sheet: {
		position: 'absolute',
		left: 0,
		right: 0,
		height: height,
		backgroundColor: '#00142E',
		borderTopLeftRadius: 28,
		borderTopRightRadius: 28,
		overflow: 'hidden',
	},

	dragArea: {
		paddingTop: 28,
		paddingBottom: 12,
		alignItems: 'center',
	},

	handle: {
		width: 122,
		height: 3,
		borderRadius: 999,
		backgroundColor: COLORS.lightNeutral,
	},

	sheetContent: {
		paddingHorizontal: 28,
		paddingBottom: 160,
	},

	brand: {
		fontFamily: FONT.bodyBold,
		color: COLORS.lightNeutral,
		textTransform: 'uppercase',
		fontSize: 13,
		marginTop: 20,
		marginBottom: 4,
	},

	title: {
		fontFamily: FONT.title,
		color: COLORS.lightNeutral,
		textTransform: 'uppercase',
		fontSize: 36,
	},

	description: {
		fontFamily: FONT.body,
		color: COLORS.lightNeutral,
		opacity: 0.85,
		lineHeight: 19,
		marginTop: 6,
		maxWidth: 330,
	},

	descriptionBlock: {
		marginTop: 6,
	},

	descriptionLong: {
		fontFamily: FONT.body,
		color: COLORS.lightNeutral,
		opacity: 0.72,
		lineHeight: 19,
		marginTop: 10,
		maxWidth: 330,
	},

	readMore: {
		fontFamily: FONT.bodyBold,
		color: COLORS.lightNeutral,
		opacity: 1,
		marginTop: 8,
	},

	loadingText: {
		fontFamily: FONT.bodyBold,
		color: COLORS.secondary,
		fontSize: 12,
		marginTop: 14,
	},

	specsRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 28,
	},

	specItem: {
		alignItems: 'center',
		width: '23%',
	},

	specIcon: {
		width: 54,
		height: 54,
		borderRadius: 999,
		backgroundColor: '#000D21',
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 10,
	},

	specLabel: {
		fontFamily: FONT.body,
		color: COLORS.lightNeutral,
		opacity: 0.65,
		fontSize: 10,
		textTransform: 'uppercase',
		textAlign: 'center',
	},

	specValue: {
		fontFamily: FONT.bodyBold,
		color: COLORS.lightNeutral,
		fontSize: 11,
		marginTop: 5,
		textAlign: 'center',
	},

	dragInfo: {
		alignItems: 'center',
		marginTop: 24,
	},

	dragText: {
		fontFamily: FONT.bodyBold,
		color: COLORS.lightNeutral,
		opacity: 0.45,
		textTransform: 'uppercase',
		fontSize: 10,
		marginTop: 12,
	},

	moreContent: {
		marginTop: 34,
	},

	sectionBlock: {
		borderBottomWidth: 1,
		borderBottomColor: 'rgba(255,255,255,0.18)',
	},

	infoRow: {
		paddingVertical: 18,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},

	infoTitle: {
		fontFamily: FONT.bodyBold,
		color: COLORS.lightNeutral,
		textTransform: 'uppercase',
		fontSize: 18,
	},

	sectionContent: {
		paddingBottom: 18,
		gap: 10,
	},

	sectionItem: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		gap: 10,
	},

	bullet: {
		width: 6,
		height: 6,
		borderRadius: 999,
		backgroundColor: COLORS.secondary,
		marginTop: 7,
	},

	sectionText: {
		flex: 1,
		fontFamily: FONT.body,
		color: COLORS.lightNeutral,
		opacity: 0.72,
		lineHeight: 20,
		fontSize: 13,
	},

	compareButton: {
		marginTop: 34,
		backgroundColor: COLORS.lightNeutral,
		borderRadius: 999,
		paddingVertical: 14,
		alignItems: 'center',
	},

	compareButtonText: {
		fontFamily: FONT.bodyBold,
		color: COLORS.primary,
		textTransform: 'uppercase',
		fontSize: 18,
	},

	thumbnailRow: {
		marginTop: 12,
		marginBottom: 8,
		paddingLeft: 2,
	},

	thumbnail: {
		width: 110,
		height: 66,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.12)',
	},
});