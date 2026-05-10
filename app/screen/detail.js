import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { COLORS, FONT } from '../../style/theme';

export default function DetailScreen() {
	return (
		<ScrollView contentContainerStyle={styles.container}>
			<Text style={styles.kicker}>Tab</Text>
			<Text style={styles.title}>Detalhes</Text>
			<Text style={styles.subtitle}>Veja informações específicas do item selecionado.</Text>
			<View style={styles.panel}>
				<Text style={styles.panelTitle}>Resumo</Text>
				<Text style={styles.panelText}>Esta é uma tela protegida e disponível somente após autenticação.</Text>
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