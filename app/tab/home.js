import { useEffect, useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
	Dimensions,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { COLORS, FONT } from '../../style/theme';
import { useAuth } from '../_layout';

const { width, height } = Dimensions.get('window');

const cars = [
	{
		id: '1',
		image: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/bronco1.png',
		widthRatio: 1.25,
		heightRatio: 0.55,
		rightRatio: -0.42,
		
	},
	{
		id: '2',
		image: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/mustang.png',
		widthRatio: 1.22,
		heightRatio: 0.48,
		rightRatio: -0.45,
		
	},
	{
		id: '3',
		image: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/carro.png',
		widthRatio: 1.22,
		heightRatio: 0.50,
		rightRatio: -0.42,
		
	},
	{
		id: '4',
		image: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/expedtion.png',
		widthRatio: 1.22,
		heightRatio: 0.52,
		rightRatio: -0.38,
		
	},
	{
		id: '5',
		image: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/bronco2.png',
		widthRatio: 1.18,
		heightRatio: 0.55,
		rightRatio: -0.40,
		
	},
];

export default function Home() {
	const router = useRouter();
	const { currentUser } = useAuth();

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
	const displayName = currentUser?.name?.trim() || 'Usuario';

	function getGreetingByHour() {
		const hour = new Date().getHours();

		if (hour < 12) {
			return 'Bom dia';
		}

		if (hour < 18) {
			return 'Boa tarde';
		}

		return 'Boa noite';
	}

	const actions = [
		{
			label: 'Perfil',
			icon: 'person-circle-outline',
			route: '../screen/profile',
		},
		{
			label: 'Salvos',
			icon: 'bookmark-outline',
			route: '../screen/saved',
		},
		{
			label: 'Notificações',
			icon: 'notifications-outline',
			route: '../screen/notifications',
		},
		{
			label: 'Anotações',
			icon: 'document-text-outline',
			route: '../screen/notes',
		},
	];

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.greeting}>
					{getGreetingByHour()}, {displayName}
				</Text>

				<Text style={styles.subtitle}>
					Built Beyond Comparison é mais do que um conceito, é o compromisso de transformar inovação, estratégia e criatividade em experiências que mantêm a Ford sempre além de qualquer comparação. E você, está pronto para levar a Ford além da comparação?
				</Text>
			</View>

			<View style={styles.hero}>
				<Image
					source={{ uri: currentCar.image }}
					style={[
						styles.carImage,
						{
							width: width * currentCar.widthRatio,
							height: height * currentCar.heightRatio,
							right: width * currentCar.rightRatio,
							bottom: height * currentCar.bottomRatio,
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

							<Text style={styles.actionText}>
								{action.label}
							</Text>
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
		paddingTop: 100,
		overflow: 'hidden',
	},

	header: {
		zIndex: 3,
	},

	greeting: {
		fontFamily: FONT.title,
		fontSize: 48,
		textTransform: 'uppercase',
		color: COLORS.primary,
		marginLeft: 32,
	},

	subtitle: {
		fontFamily: FONT.body,
		color: COLORS.darkGrey,
		opacity: 0.7,
		marginLeft: 32,
		fontSize: 12,
		textAlign: 'justify',
		maxWidth: 300,
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
		zIndex: 1,
	},

	overlay: {
		position: 'absolute',
		width: '100%',
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
		width: 150,
	},

	actionText: {
		fontFamily: FONT.bodyBold,
		color: COLORS.lightNeutral,
		textTransform: 'uppercase',
		fontSize: 12,
	},
});