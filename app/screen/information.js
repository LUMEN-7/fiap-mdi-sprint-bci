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

import { useLocalSearchParams } from 'expo-router';

const { height, width } = Dimensions.get('window');

const COLLAPSED_TOP = height * 0.47;
const EXPANDED_TOP = height * 0.08;

const MODEL_DATA = {
	'1': {
		specs: [
			{ id: 'motor', label: 'Motor', value: '5.0L V8', icon: 'engine-outline' },
			{ id: 'potencia', label: 'Potência', value: '488 cv', icon: 'horse-variant-fast' },
			{ id: 'tipo', label: 'Tipo', value: 'Esportivo', icon: 'shape-outline' },
			{ id: 'consumo', label: 'Consumo', value: '7.8 km/L', icon: 'gas-station-outline' },
		],
		sections: [
			{
				id: 'performance',
				title: 'Performance',
				items: [
					'Entrega agressiva de potência para acelerações fortes',
					'Acerto esportivo de suspensão e direção',
					'Câmbio automático pensado para resposta rápida',
					'Comportamento voltado para estrada e pista',
				],
			},
			{
				id: 'consumo',
				title: 'Consumo',
				items: [
					'Consumo compatível com uso misto e condução esportiva',
					'Gerenciamento eletrônico de eficiência',
					'Métricas em tempo real no painel digital',
					'Perfil de condução adaptável ao motorista',
				],
			},
			{
				id: 'seguranca',
				title: 'Segurança',
				items: [
					'Pacote de assistência à condução com múltiplos alertas',
					'Controle avançado de estabilidade',
					'Assistente de frenagem e tração',
					'Mais confiança em manobras de alta velocidade',
				],
			},
			{
				id: 'tecnologia',
				title: 'Tecnologia',
				items: [
					'Central com foco em conectividade e entretenimento',
					'Painel digital configurável',
					'Integração com smartphone e comandos rápidos',
					'Recursos de assistência inteligente ao volante',
				],
			},
			{
				id: 'conforto',
				title: 'Conforto',
				items: [
					'Cabine com pegada premium esportiva',
					'Bancos com acabamento refinado',
					'Climatização automática eficiente',
					'Experiência mais silenciosa e estável em viagem',
				],
			},
		],
	},
	'2': {
		specs: [
			{ id: 'motor', label: 'Motor', value: '2.3L EcoBoost', icon: 'engine-outline' },
			{ id: 'potencia', label: 'Potência', value: '300 cv', icon: 'horse-variant-fast' },
			{ id: 'tipo', label: 'Tipo', value: 'SUV', icon: 'shape-outline' },
			{ id: 'consumo', label: 'Consumo', value: '9.6 km/L', icon: 'gas-station-outline' },
		],
		sections: [
			{
				id: 'performance',
				title: 'Performance',
				items: [
					'Desempenho equilibrado para cidade e estrada',
					'Tração e resposta adaptadas ao uso off-road',
					'Suspensão preparada para diferentes terrenos',
					'Condução robusta com boa dirigibilidade',
				],
			},
			{
				id: 'consumo',
				title: 'Consumo',
				items: [
					'Média pensada para um SUV de maior porte',
					'Modo de condução para eficiência em deslocamentos',
					'Monitoramento de consumo em tempo real',
					'Verificação inteligente de autonomia',
				],
			},
			{
				id: 'seguranca',
				title: 'Segurança',
				items: [
					'Pacote de assistência para trilhas e estrada',
					'Controle de estabilidade e tração aprimorado',
					'Alertas de manobra e ponto cego',
					'Projetado para maior controle em trajetos exigentes',
				],
			},
			{
				id: 'tecnologia',
				title: 'Tecnologia',
				items: [
					'Tela com foco em navegação e conectividade',
					'Sistema multimídia com resposta rápida',
					'Integração fácil com o celular',
					'Recursos inteligentes para apoio ao motorista',
				],
			},
			{
				id: 'conforto',
				title: 'Conforto',
				items: [
					'Cabine espaçosa com posição elevada',
					'Acabamento voltado ao uso aventureiro premium',
					'Climatização eficiente para longos trajetos',
					'Conforto pensado para quem viaja com frequência',
				],
			},
		],
	},
	'3': {
		specs: [
			{ id: 'motor', label: 'Motor', value: '2.0L Turbo', icon: 'engine-outline' },
			{ id: 'potencia', label: 'Potência', value: '250 cv', icon: 'horse-variant-fast' },
			{ id: 'tipo', label: 'Tipo', value: 'Picape', icon: 'shape-outline' },
			{ id: 'consumo', label: 'Consumo', value: '12 km/L', icon: 'gas-station-outline' },
		],
		sections: [
			{
				id: 'performance',
				title: 'Performance',
				items: [
					'Conjunto voltado para uso urbano e estrada',
					'Resposta rápida com foco em versatilidade',
					'Bom equilíbrio entre carga e dirigibilidade',
					'Condução confortável mesmo com uso misto',
				],
			},
			{
				id: 'consumo',
				title: 'Consumo',
				items: [
					'Eficiência pensada para rotina de trabalho e lazer',
					'Gerenciamento de combustível mais inteligente',
					'Indicadores para condução econômica',
					'Autonomia favorável para uso diário',
				],
			},
			{
				id: 'seguranca',
				title: 'Segurança',
				items: [
					'Assistentes para frenagem e estabilidade',
					'Sensores de apoio em manobras',
					'Boa visibilidade e controle de cabine',
					'Sistema pensado para uso diário seguro',
				],
			},
			{
				id: 'tecnologia',
				title: 'Tecnologia',
				items: [
					'Sistema conectado com recursos práticos',
					'Tela com leitura rápida de informações',
					'Integração com smartphone e mapas',
					'Tecnologia útil para trabalho e lazer',
				],
			},
			{
				id: 'conforto',
				title: 'Conforto',
				items: [
					'Cabine confortável para uso prolongado',
					'Bancos com foco em ergonomia',
					'Acabamento funcional e moderno',
					'Boa acomodação para ocupantes e carga',
				],
			},
		],
	},
	'4': {
		specs: [
			{ id: 'motor', label: 'Motor', value: '3.0L V6', icon: 'engine-outline' },
			{ id: 'potencia', label: 'Potência', value: '400 cv', icon: 'horse-variant-fast' },
			{ id: 'tipo', label: 'Tipo', value: 'SUV grande', icon: 'shape-outline' },
			{ id: 'consumo', label: 'Consumo', value: '8.5 km/L', icon: 'gas-station-outline' },
		],
		sections: [
			{
				id: 'performance',
				title: 'Performance',
				items: [
					'Força para viajar com segurança e presença',
					'Resposta consistente mesmo em veículo maior',
					'Conjunto ideal para família e longas distâncias',
					'Direção estável para diferentes cenários de uso',
				],
			},
			{
				id: 'consumo',
				title: 'Consumo',
				items: [
					'Consumo compatível com porte e proposta do modelo',
					'Otimização eletrônica para viagem',
					'Informações de consumo visíveis ao condutor',
					'Gestão eficiente para deslocamentos maiores',
				],
			},
			{
				id: 'seguranca',
				title: 'Segurança',
				items: [
					'Pacote completo de assistência e proteção',
					'Sistemas eletrônicos de estabilidade e frenagem',
					'Bom nível de visibilidade e controle',
					'Soluções para trajetos urbanos e rodoviários',
				],
			},
			{
				id: 'tecnologia',
				title: 'Tecnologia',
				items: [
					'Sistema multimídia completo',
					'Painel moderno com múltiplas informações',
					'Conectividade para toda a família',
					'Recursos de assistência de alto nível',
				],
			},
			{
				id: 'conforto',
				title: 'Conforto',
				items: [
					'Cabine ampla e confortável',
					'Acabamento premium para longas viagens',
					'Climatização e ergonomia de destaque',
					'Proposta pensada para conforto familiar',
				],
			},
		],
	},
};

const DEFAULT_MODEL_DATA = MODEL_DATA['1'];

function getModelData(modelId) {
	return MODEL_DATA[String(modelId)] || DEFAULT_MODEL_DATA;
}

export default function InformationScreen() {
	const router = useRouter();

	const [expanded, setExpanded] = useState(false);
	const [openSection, setOpenSection] = useState(null);

	const { id, brand, name, image } = useLocalSearchParams();
	const modelData = getModelData(id);

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

				<TouchableOpacity style={styles.iconButton}>
					<Ionicons
						name="star-outline"
						size={24}
						color={COLORS.primary}
					/>
				</TouchableOpacity>
			</View>

			<Image
				source={{ uri: image }}
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
					<Text style={styles.brand}>{brand}</Text>
					<Text style={styles.title}>{name}</Text>

					<Text style={styles.description}>
						Desempenho, presença e tecnologia se encontram em um modelo
						projetado para ir além da comparação.
						<Text style={styles.readMore}> Leia mais</Text>
					</Text>

					<View style={styles.specsRow}>
						{modelData.specs.map((item) => (
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

							<TouchableOpacity
								style={styles.compareButton}
								onPress={() => {
									router.push({
										pathname: '/tab/compare',
										params: {
											firstCarId: String(id),
											firstCarBrand: String(brand),
											firstCarName: String(name),
											firstCarImage: String(image),
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
		paddingHorizontal: 24
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
});