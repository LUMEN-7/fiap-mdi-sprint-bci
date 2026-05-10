import { Image } from 'react-native';
import { useRouter } from 'expo-router';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, FONT } from '../../style/theme';
import { useAuth } from '../_layout';

export default function ProfileScreen() {
	const router = useRouter();
	const { signOut, currentUser } = useAuth();
	const displayName = currentUser?.name?.trim() || 'Usuario';
	const displayEmail = currentUser?.email || 'Sem e-mail';
	const profilePhoto = currentUser?.photo || null;

	const handleLogout = async () => {
		await signOut();
		router.replace('/auth/login');
	};

	const menuItems = [
		{
			id: '1',
			title: 'Redefinir Senha',
			subtitle: 'Altere sua senha de acesso',
			icon: 'lock-closed-outline',
			route: '/screen/password',
		},
	];

	return (
		<ScrollView
			style={styles.safeArea}
			contentContainerStyle={styles.container}
			showsVerticalScrollIndicator={false}
		>
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

			<View style={styles.header}>
				<View>
					<Text style={styles.title}>Olá, {displayName}</Text>

					<Text style={styles.subtitle}>
						Gerencie sua conta.
					</Text>
				</View>
			</View>

			<View style={styles.profileCard}>
				<View style={styles.avatarWrapper}>
					{profilePhoto ? (
						<Image
							source={{ uri: profilePhoto }}
							style={styles.avatar}
						/>
					) : (
						<Ionicons
							name="person-outline"
							size={36}
							color={COLORS.primary}
						/>
					)}
				</View>

				<View style={styles.profileInfo}>
					<Text style={styles.name}>{displayName}</Text>
					<Text style={styles.email}>{displayEmail}</Text>
				</View>

				<TouchableOpacity
					style={styles.cardEditButton}
					onPress={() => router.push('/screen/editProfile')}
				>
					<Ionicons
						name="pencil-outline"
						size={18}
						color={COLORS.lightNeutral}
					/>
				</TouchableOpacity>
			</View>

			<View style={styles.menu}>
				{menuItems.map((item) => (
					<TouchableOpacity
						key={item.id}
						style={styles.menuItem}
						onPress={() => router.push(item.route)}
					>
						<View style={styles.menuIcon}>
							<Ionicons
								name={item.icon}
								size={22}
								color={COLORS.lightNeutral}
							/>
						</View>

						<View style={styles.menuText}>
							<Text style={styles.menuTitle}>
								{item.title}
							</Text>

							<Text style={styles.menuSubtitle}>
								{item.subtitle}
							</Text>
						</View>

						<Ionicons
							name="chevron-forward"
							size={20}
							color="rgba(255,255,255,0.5)"
						/>
					</TouchableOpacity>
				))}
			</View>

			<TouchableOpacity
				style={styles.logoutButton}
				onPress={handleLogout}
			>
				<Ionicons
					name="log-out-outline"
					size={20}
					color="#ff4d6d"
				/>

				<Text style={styles.logoutText}>Sair da conta</Text>
			</TouchableOpacity>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: COLORS.primary,
	},

	container: {
		padding: 28,
		paddingTop: 70,
		paddingBottom: 120,
	},

	topBar: {
		marginBottom: 24,
	},

	backButton: {
		width: 44,
		height: 44,
		borderRadius: 999,
		backgroundColor: 'rgba(255,255,255,0.1)',
		alignItems: 'center',
		justifyContent: 'center',
	},

	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
	},

	title: {
		fontFamily: FONT.title,
		color: COLORS.lightNeutral,
		fontSize: 48,
		textTransform: 'uppercase',
	},

	subtitle: {
		fontFamily: FONT.body,
		color: COLORS.lightNeutral,
		opacity: 0.75,
		maxWidth: 260,
	},

	profileCard: {
		marginTop: 36,
		backgroundColor: '#010E1F',
		borderRadius: 8,
		padding: 20,
		paddingRight: 66,
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.24)',
		position: 'relative',
	},

	avatarWrapper: {
		width: 72,
		height: 72,
		borderRadius: 999,
		backgroundColor: COLORS.lightNeutral,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 16,
	},

	avatar: {
		width: 72,
		height: 72,
		borderRadius: 999,
		resizeMode: 'cover',
	},

	cardEditButton: {
		position: 'absolute',
		right: 18,
		top: 18,
		width: 38,
		height: 38,
		borderRadius: 999,
		backgroundColor: 'rgba(255,255,255,0.1)',
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.12)',
	},

	profileInfo: {
		flex: 1,
	},

	name: {
		fontFamily: FONT.bodyBold,
		color: COLORS.lightNeutral,
		fontSize: 18,
		textTransform: 'uppercase',
	},

	email: {
		fontFamily: FONT.body,
		color: COLORS.lightNeutral,
		opacity: 0.65,
		marginTop: 4,
	},

	menu: {
		gap: 12,
		marginTop: 40,
	},

	menuItem: {
		backgroundColor: '#010E1F',
		borderRadius: 8,
		padding: 16,
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: 'rgba(255, 255, 255, 0.24)',
	},

	menuIcon: {
		width: 44,
		height: 44,
		borderRadius: 999,
		backgroundColor: 'rgba(255,255,255,0.08)',
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 14,
	},

	menuText: {
		flex: 1,
	},

	menuTitle: {
		fontFamily: FONT.bodyBold,
		color: COLORS.lightNeutral,
		fontSize: 14,
		textTransform: 'uppercase',
	},

	menuSubtitle: {
		fontFamily: FONT.body,
		color: COLORS.lightNeutral,
		opacity: 0.6,
		fontSize: 12,
		marginTop: 3,
	},

	logoutButton: {
		marginTop: 150,
		borderRadius: 999,
		borderWidth: 1,
		borderColor: 'rgba(255,77,109,0.45)',
		paddingVertical: 13,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		gap: 8,
	},

	logoutText: {
		fontFamily: FONT.bodyBold,
		color: '#ff4d6d',
		textTransform: 'uppercase',
		fontSize: 13,
	},
});