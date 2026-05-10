import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { COLORS, FONT } from '../../style/theme';

export default function CompareScreen() {
	return (
		<ScrollView contentContainerStyle={styles.container}>
			<Text style={styles.kicker}>Tab</Text>
			<Text style={styles.title}>Comparar</Text>
			<Text style={styles.subtitle}>Compare itens depois de fazer login.</Text>
			<View style={styles.panel}>
				<Text style={styles.panelTitle}>Comparação</Text>
				<Text style={styles.panelText}>Estruture aqui a lógica de diferença entre modelos.</Text>
			</View>
			<StatusBar style="light" />
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		padding: 24,
		backgroundColor: COLORS.primary,
		justifyContent: 'center',
	},
	kicker: {
		color: COLORS.secondary,
		fontFamily: FONT.bodyBold,
		letterSpacing: 3,
		textTransform: 'uppercase',
		marginBottom: 8,
	},
	title: {
		color: COLORS.lightNeutral,
		fontFamily: FONT.title,
		fontSize: 38,
		marginBottom: 10,
	},
	subtitle: {
		color: COLORS.lightNeutral,
		fontFamily: FONT.body,
		opacity: 0.8,
		lineHeight: 22,
	},
	panel: {
		marginTop: 24,
		backgroundColor: 'rgba(255,255,255,0.06)',
		borderRadius: 20,
		padding: 20,
	},
	panelTitle: {
		color: COLORS.lightNeutral,
		fontFamily: FONT.bodyBold,
		fontSize: 18,
		marginBottom: 6,
	},
	panelText: {
		color: COLORS.lightNeutral,
		fontFamily: FONT.body,
		opacity: 0.8,
		lineHeight: 22,
	},
});
