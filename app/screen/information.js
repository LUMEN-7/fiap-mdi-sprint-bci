import { useRef, useState } from 'react';
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

import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { COLORS, FONT } from '../../style/theme';

const { height, width } = Dimensions.get('window');

const COLLAPSED_TOP = height * 0.47;
const EXPANDED_TOP = height * 0.08;

export default function InformationScreen() {
	const router = useRouter();

	const [expanded, setExpanded] = useState(false);
	const [openSection, setOpenSection] = useState(null);

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

	function toggleSection(id) {
		setOpenSection((current) => (current === id ? null : id));
	}

	const specs = [
		{
			id: '1',
			label: 'Motor',
			value: '2.3L Turbo',
			icon: 'engine-outline',
		},
		{
			id: '2',
			label: 'Potência',
			value: '315 cv',
			icon: 'horse-variant-fast',
		},
		{
			id: '3',
			label: 'Tipo',
			value: 'Combustão',
			icon: 'shape-outline',
		},
		{
			id: '4',
			label: 'Consumo',
			value: '11 km/L',
			icon: 'gas-station-outline',
		},
	];

	const sections = [
		{
			id: 'performance',
			title: 'Performance',
			items: [
				'Motor 2.3L EcoBoost Turbo',
				'Potência estimada de 315 cv',
				'Câmbio automático de alta resposta',
				'Direção esportiva com controle preciso',
			],
		},
		{
			id: 'consumo',
			title: 'Consumo',
			items: [
				'Média estimada de 11 km/L',
				'Otimização para uso urbano e rodoviário',
				'Indicador de eficiência em tempo real',
				'Modo de condução econômico disponível',
			],
		},
		{
			id: 'seguranca',
			title: 'Segurança',
			items: [
				'Assistente de permanência em faixa',
				'Alerta de colisão frontal',
				'Controle eletrônico de estabilidade',
				'Sistema de frenagem assistida',
			],
		},
		{
			id: 'tecnologia',
			title: 'Tecnologia',
			items: [
				'Central multimídia com conectividade',
				'Painel digital configurável',
				'Compatibilidade com smartphone',
				'Sistemas inteligentes de assistência',
			],
		},
		{
			id: 'conforto',
			title: 'Conforto',
			items: [
				'Bancos com acabamento premium',
				'Climatização automática',
				'Interior com foco em ergonomia',
				'Experiência de direção refinada',
			],
		},
	];

	return (
		<View style={styles.container}>
			<View style={styles.topActions}>
				<TouchableOpacity onPress={() => router.back()}>
					<Ionicons
						name="close-outline"
						size={42}
						color="rgba(0,0,0,0.55)"
					/>
				</TouchableOpacity>

				<TouchableOpacity>
					<Ionicons
						name="star-outline"
						size={34}
						color="rgba(0,0,0,0.55)"
					/>
				</TouchableOpacity>
			</View>

			<Image
				source={{
					uri: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/mustang.png',
				}}
				style={styles.carImage}
			/>

			<Animated.View
				style={[
					styles.sheet,
					{
						top: translateY,
					},
				]}
			>
				<View
					style={styles.dragArea}
					{...panResponder.panHandlers}
				>
					<View style={styles.handle} />
				</View>

				<ScrollView
					showsVerticalScrollIndicator={false}
					scrollEnabled={expanded}
					contentContainerStyle={styles.sheetContent}
				>
					<Text style={styles.brand}>Ford</Text>

					<Text style={styles.title}>Mustang 2026</Text>

					<Text style={styles.description}>
						Desempenho, presença e tecnologia se encontram em um modelo
						projetado para ir além da comparação.
						<Text style={styles.readMore}> Leia mais</Text>
					</Text>

					<View style={styles.specsRow}>
						{specs.map((item) => (
							<View key={item.id} style={styles.specItem}>
								<View style={styles.specIcon}>
									<MaterialCommunityIcons
										name={item.icon}
										size={28}
										color={COLORS.lightNeutral}
									/>
								</View>

								<Text style={styles.specLabel}>
									{item.label}
								</Text>

								<Text style={styles.specValue}>
									{item.value}
								</Text>
							</View>
						))}
					</View>

					{!expanded ? (
						<View style={styles.dragInfo}>
							<Text style={styles.dots}>...</Text>

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
							{sections.map((section) => {
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
												{section.items.map((item) => (
													<View
														key={item}
														style={styles.sectionItem}
													>
														<View style={styles.bullet} />

														<Text style={styles.sectionText}>
															{item}
														</Text>
													</View>
												))}
											</View>
										) : null}
									</View>
								);
							})}

							<TouchableOpacity style={styles.compareButton}>
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

	topActions: {
		position: 'absolute',
		top: 42,
		left: 28,
		right: 28,
		zIndex: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},

	carImage: {
		position: 'absolute',
		top: height * 0.16,
		alignSelf: 'center',
		width: width * 0.95,
		height: height * 0.32,
		resizeMode: 'contain',
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

	readMore: {
		fontFamily: FONT.bodyBold,
		color: COLORS.lightNeutral,
		opacity: 1,
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
		marginTop: 34,
	},

	dots: {
		color: 'rgba(255,255,255,0.55)',
		fontFamily: FONT.bodyBold,
		fontSize: 18,
		marginBottom: 8,
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
});