import { useEffect, useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { COLORS, FONT } from '../../style/theme';

const cars = [
	{
		id: '1',
		image: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/bronco1.png',
		width: 570,
		height: 544,
		right: -220,
		bottom: 120,
	},
	{
		id: '2',
		image: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/mustang.png',
		width: 558,
		height: 419,
		right: -250,
		bottom: 120,
	},
	{
		id: '3',
		image: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/carro.png',
		width: 556,
		height: 466,
		right: -230,
		bottom: 120,
	},
	{
		id: '4',
		image: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/expedtion.png',
		width: 555,
		height: 491,
		right: -200,
		bottom: 120,
	},
	{
		id: '5',
		image: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/bronco2.png',
		width: 510,
		height: 553,
		right: -220,
		bottom: 120,
	},
];

export default function Home() {
	const router = useRouter();

	const [currentIndex, setCurrentIndex] = useState(0);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentIndex((prevIndex) =>
				prevIndex === cars.length - 1 ? 0 : prevIndex + 1
			);
		}, 3000);

		return () => clearInterval(interval);
	}, []);

	const currentCar = cars[currentIndex];

	const actions = [
		{
			label: 'Perfil',
			icon: 'person-circle-outline',
			route: '/profile',
		},
		{
			label: 'Salvos',
			icon: 'bookmark-outline',
			route: '/saved',
		},
		{
			label: 'Notificações',
			icon: 'notifications-outline',
			route: '/notifications',
		},
		{
			label: 'Anotações',
			icon: 'document-text-outline',
			route: '/notes',
		},
	];

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.greeting}>Olá User</Text>

				<Text style={styles.subtitle}>
					Comprove com apenas um clique que você está além da comparação
				</Text>
			</View>

			<View style={styles.hero}>
				<Image
					source={{ uri: currentCar.image }}
					style={[
						styles.carImage,
						{
							width: currentCar.width,
							height: currentCar.height,
							right: currentCar.right,
							bottom: currentCar.bottom,
						},
					]}
				/>

				<View style={styles.overlay} />
			</View>

			<View style={styles.fabContainer}>
				{open &&
					actions.map((action) => (
						<TouchableOpacity
							key={action.label}
							style={styles.actionButton}
							onPress={() => router.push(action.route)}
						>
							<Ionicons
								name={action.icon}
								size={20}
								color={COLORS.lightNeutral}
							/>
							<Text style={styles.actionText}>{action.label}</Text>

						</TouchableOpacity>
					))}

				<TouchableOpacity
					style={styles.fab}
					onPress={() => setOpen(!open)}
				>
					<Ionicons
						name={open ? 'close' : 'add'}
						size={30}
						color={COLORS.lightNeutral}
					/>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.lightNeutral,
		paddingTop: 90,
		overflow: 'hidden',
	},

	header: {
		zIndex: 3,
	},

	greeting: {
		fontFamily: FONT.title,
		fontSize: 42,
		textTransform: 'uppercase',
		color: COLORS.primary,
		marginLeft: 28,
	},

	subtitle: {
		fontFamily: FONT.body,
		color: COLORS.darkGrey,
		opacity: 0.7,
		marginTop: 12,
		marginLeft: 28,
		maxWidth: 260,
	},

	hero: {
		flex: 1,
		justifyContent: 'flex-end',
		overflow: 'hidden',
	},

	carImage: {
		position: 'absolute',
		resizeMode: 'contain',
		opacity: 0.98,
		transform: [{ scale: 1.05 }],
		zIndex: 1,
	},

	overlay: {
		position: 'absolute',
		width: '100%',
		height: 220,
		bottom: 0,
		zIndex: 2,
	},

	fabContainer: {
		position: 'absolute',
		left: 24,
		bottom: 50,
		alignItems: 'flex-start',
		zIndex: 5,
	},

	fab: {
		width: 60,
		height: 60,
		borderRadius: 999,
		backgroundColor: COLORS.primary,
		alignItems: 'center',
		justifyContent: 'center',
		elevation: 5,
	},

	actionButton: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
		backgroundColor: COLORS.primary,
		borderRadius: 999,
		paddingVertical: 12,
		paddingHorizontal: 18,
		marginBottom: 12,
		width: 150
	},

	actionText: {
		fontFamily: FONT.bodyBold,
		color: COLORS.lightNeutral,
		textTransform: 'uppercase',
		fontSize: 12,
	},
});