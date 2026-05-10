import { useRouter } from 'expo-router';

import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { COLORS, FONT } from '../../style/theme';

export default function ComingSoonScreen() {
	const router = useRouter();

	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<View style={styles.iconWrapper}>
					<Ionicons
						name="construct-outline"
						size={42}
						color={COLORS.secondary}
					/>
				</View>

				<Text style={styles.title}>
					Em desenvolvimento
				</Text>

				<Text style={styles.subtitle}>
					Estamos construindo essa funcionalidade
					para entregar uma experiência ainda
					melhor para você.
				</Text>

				<Text style={styles.description}>
					Novidades estão chegando em breve.
					Continue explorando o app e acompanhe
					as próximas atualizações.
				</Text>

				<TouchableOpacity
					style={styles.button}
					onPress={() => router.back()}
				>
					<Ionicons
						name="arrow-back-outline"
						size={18}
						color={COLORS.lightNeutral}
					/>

					<Text style={styles.buttonText}>
						Voltar
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.primary,
		padding: 28,
		justifyContent: 'center',
	},

	content: {
		alignItems: 'center',
	},

	iconWrapper: {
		width: 90,
		height: 90,
		borderRadius: 999,

		backgroundColor: 'rgba(255,255,255,0.08)',

		alignItems: 'center',
		justifyContent: 'center',

		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.08)',
	},

	title: {
		marginTop: 28,

		fontFamily: FONT.title,
		fontSize: 42,

		textTransform: 'uppercase',

		color: COLORS.lightNeutral,

		textAlign: 'center',
	},

	subtitle: {
		marginTop: 18,

		fontFamily: FONT.bodyBold,
		fontSize: 16,

		color: COLORS.lightNeutral,

		textAlign: 'center',

		maxWidth: 290,

		lineHeight: 24,
	},

	description: {
		marginTop: 12,

		fontFamily: FONT.body,
		fontSize: 14,

		color: COLORS.lightNeutral,

		opacity: 0.7,

		textAlign: 'center',

		maxWidth: 310,

		lineHeight: 22,
	},

	button: {
		marginTop: 42,

		backgroundColor: COLORS.secondary,

		borderRadius: 999,

		paddingVertical: 14,
		paddingHorizontal: 24,

		flexDirection: 'row',
		alignItems: 'center',

		gap: 8,
	},

	buttonText: {
		fontFamily: FONT.bodyBold,

		color: COLORS.lightNeutral,

		textTransform: 'uppercase',

		fontSize: 12,
	},
});