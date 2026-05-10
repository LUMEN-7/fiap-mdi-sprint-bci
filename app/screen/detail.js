import { useState } from 'react';

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

import { useRouter } from 'expo-router';

import { COLORS, FONT } from '../../style/theme';

export default function CompareDetailScreen() {
	const router = useRouter();

	const [expandedSection, setExpandedSection] =
		useState('performance');

	function toggleSection(section) {
		setExpandedSection((current) =>
			current === section ? null : section
		);
	}

	const firstCar = {
		name: 'Mustang',
		image:
			'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/mustang.png',

		stats: {
			potencia: '315 cv',
			torque: '475 Nm',
			aceleracao: '4.3s',
			consumo: '11 km/L',
			seguranca: 'Ford CoPilot360',
			tecnologia: 'SYNC 4 + painel digital',
			conforto: 'Interior premium esportivo',
		},
	};

	const secondCar = {
		name: 'Bronco',
		image:
			'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/bronco1.png',

		stats: {
			potencia: '330 cv',
			torque: '563 Nm',
			aceleracao: '5.1s',
			consumo: '9 km/L',
			seguranca: 'Assistência Off-Road',
			tecnologia: 'Tela SYNC integrada',
			conforto: 'Suspensão reforçada',
		},
	};

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

				<TouchableOpacity style={styles.iconButton}>
					<Ionicons
						name="star-outline"
						size={24}
						color={COLORS.primary}
					/>
				</TouchableOpacity>
			</View>

			<Text style={styles.title}>
				Comparação detalhada
			</Text>

			<Text style={styles.subtitle}>
				Visualize diferenças de desempenho,
				tecnologia e eficiência entre os modelos.
			</Text>

			<View style={styles.hero}>
				<View style={styles.carSide}>
					<Image
						source={{ uri: firstCar.image }}
						style={styles.carImage}
					/>

					<Text style={styles.carName}>
						{firstCar.name}
					</Text>
				</View>

				<View style={styles.vsCircle}>
					<Text style={styles.vsText}>VS</Text>
				</View>

				<View style={styles.carSide}>
					<Image
						source={{ uri: secondCar.image }}
						style={styles.carImage}
					/>

					<Text style={styles.carName}>
						{secondCar.name}
					</Text>
				</View>
			</View>

			<View style={styles.summaryCard}>
				<View style={styles.summaryHeader}>
					<MaterialCommunityIcons
						name="radar"
						size={26}
						color={COLORS.secondary}
					/>

					<Text style={styles.summaryTitle}>
						Resumo inteligente
					</Text>
				</View>

				<Text style={styles.summaryText}>
					O Bronco apresenta maior torque e foco
					em desempenho off-road, enquanto o
					Mustang entrega aceleração superior e
					uma experiência mais esportiva.
				</Text>
			</View>

			<View style={styles.section}>
				<TouchableOpacity
					style={styles.sectionHeader}
					onPress={() => toggleSection('performance')}
				>
					<Text style={styles.sectionTitle}>
						Performance
					</Text>

					<Ionicons
						name={
							expandedSection === 'performance'
								? 'chevron-up-outline'
								: 'chevron-down-outline'
						}
						size={22}
						color={COLORS.primary}
					/>
				</TouchableOpacity>

				{expandedSection === 'performance' ? (
					<View style={styles.compareContent}>
						<View style={styles.row}>
							<Text style={styles.metric}>
								Potência
							</Text>

							<View style={styles.valueRow}>
								<View style={styles.valueCard}>
									<Text style={styles.valueText}>
										{firstCar.stats.potencia}
									</Text>
								</View>

								<View style={styles.valueCard}>
									<Text style={styles.valueText}>
										{secondCar.stats.potencia}
									</Text>
								</View>
							</View>
						</View>

						<View style={styles.row}>
							<Text style={styles.metric}>
								Torque
							</Text>

							<View style={styles.valueRow}>
								<View style={styles.valueCard}>
									<Text style={styles.valueText}>
										{firstCar.stats.torque}
									</Text>
								</View>

								<View style={styles.valueCard}>
									<Text style={styles.valueText}>
										{secondCar.stats.torque}
									</Text>
								</View>
							</View>
						</View>

						<View style={styles.row}>
							<Text style={styles.metric}>
								Aceleração
							</Text>

							<View style={styles.valueRow}>
								<View style={styles.valueCard}>
									<Text style={styles.valueText}>
										{firstCar.stats.aceleracao}
									</Text>
								</View>

								<View style={styles.valueCard}>
									<Text style={styles.valueText}>
										{secondCar.stats.aceleracao}
									</Text>
								</View>
							</View>
						</View>
					</View>
				) : null}
			</View>

			<View style={styles.section}>
				<TouchableOpacity
					style={styles.sectionHeader}
					onPress={() => toggleSection('consumo')}
				>
					<Text style={styles.sectionTitle}>
						Consumo
					</Text>

					<Ionicons
						name={
							expandedSection === 'consumo'
								? 'chevron-up-outline'
								: 'chevron-down-outline'
						}
						size={22}
						color={COLORS.primary}
					/>
				</TouchableOpacity>

				{expandedSection === 'consumo' ? (
					<View style={styles.compareContent}>
						<View style={styles.row}>
							<Text style={styles.metric}>
								Eficiência
							</Text>

							<View style={styles.valueRow}>
								<View style={styles.valueCard}>
									<Text style={styles.valueText}>
										{firstCar.stats.consumo}
									</Text>
								</View>

								<View style={styles.valueCard}>
									<Text style={styles.valueText}>
										{secondCar.stats.consumo}
									</Text>
								</View>
							</View>
						</View>
					</View>
				) : null}
			</View>

			<View style={styles.section}>
				<TouchableOpacity
					style={styles.sectionHeader}
					onPress={() => toggleSection('seguranca')}
				>
					<Text style={styles.sectionTitle}>
						Segurança
					</Text>

					<Ionicons
						name={
							expandedSection === 'seguranca'
								? 'chevron-up-outline'
								: 'chevron-down-outline'
						}
						size={22}
						color={COLORS.primary}
					/>
				</TouchableOpacity>

				{expandedSection === 'seguranca' ? (
					<View style={styles.dualCards}>
						<View style={styles.infoCard}>
							<Text style={styles.infoTitle}>
								{firstCar.name}
							</Text>

							<Text style={styles.infoText}>
								{firstCar.stats.seguranca}
							</Text>
						</View>

						<View style={styles.infoCard}>
							<Text style={styles.infoTitle}>
								{secondCar.name}
							</Text>

							<Text style={styles.infoText}>
								{secondCar.stats.seguranca}
							</Text>
						</View>
					</View>
				) : null}
			</View>

			<View style={styles.section}>
				<TouchableOpacity
					style={styles.sectionHeader}
					onPress={() => toggleSection('tecnologia')}
				>
					<Text style={styles.sectionTitle}>
						Tecnologia
					</Text>

					<Ionicons
						name={
							expandedSection === 'tecnologia'
								? 'chevron-up-outline'
								: 'chevron-down-outline'
						}
						size={22}
						color={COLORS.primary}
					/>
				</TouchableOpacity>

				{expandedSection === 'tecnologia' ? (
					<View style={styles.dualCards}>
						<View style={styles.infoCard}>
							<Text style={styles.infoTitle}>
								{firstCar.name}
							</Text>

							<Text style={styles.infoText}>
								{firstCar.stats.tecnologia}
							</Text>
						</View>

						<View style={styles.infoCard}>
							<Text style={styles.infoTitle}>
								{secondCar.name}
							</Text>

							<Text style={styles.infoText}>
								{secondCar.stats.tecnologia}
							</Text>
						</View>
					</View>
				) : null}
			</View>

			<View style={styles.section}>
				<TouchableOpacity
					style={styles.sectionHeader}
					onPress={() => toggleSection('conforto')}
				>
					<Text style={styles.sectionTitle}>
						Conforto
					</Text>

					<Ionicons
						name={
							expandedSection === 'conforto'
								? 'chevron-up-outline'
								: 'chevron-down-outline'
						}
						size={22}
						color={COLORS.primary}
					/>
				</TouchableOpacity>

				{expandedSection === 'conforto' ? (
					<View style={styles.dualCards}>
						<View style={styles.infoCard}>
							<Text style={styles.infoTitle}>
								{firstCar.name}
							</Text>

							<Text style={styles.infoText}>
								{firstCar.stats.conforto}
							</Text>
						</View>

						<View style={styles.infoCard}>
							<Text style={styles.infoTitle}>
								{secondCar.name}
							</Text>

							<Text style={styles.infoText}>
								{secondCar.stats.conforto}
							</Text>
						</View>
					</View>
				) : null}
			</View>

			<TouchableOpacity style={styles.compareButton}>
				<MaterialCommunityIcons
					name="source-branch-sync"
					size={20}
					color={COLORS.lightNeutral}
				/>

				<Text style={styles.compareButtonText}>
					Gerar relatório
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

	compareContent: {
		marginTop: 18,
		gap: 18,
	},

	row: {
		gap: 12,
	},

	metric: {
		fontFamily: FONT.bodyBold,
		color: COLORS.secondary,
		textTransform: 'uppercase',
		fontSize: 12,
	},

	valueRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},

	valueCard: {
		width: '48%',
		height: 58,
		borderRadius: 16,
		backgroundColor: '#E8E8E8',
		alignItems: 'center',
		justifyContent: 'center',
	},

	valueText: {
		fontFamily: FONT.bodyBold,
		color: COLORS.primary,
		fontSize: 14,
		textTransform: 'uppercase',
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