import { useState } from 'react';
import { useRouter } from 'expo-router';
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';

import { COLORS, FONT } from '../../style/theme';

export default function NotesScreen() {
	const router = useRouter();
	const [note, setNote] = useState('');
	const [notes, setNotes] = useState([]);
	const [previewMode, setPreviewMode] = useState(false);

	function handleAddNote() {
		if (!note.trim()) return;

		const newNote = {
			id: Date.now().toString(),
			text: note.trim(),
			createdAt: new Date().toLocaleDateString('pt-BR'),
		};

		setNotes((prevNotes) => [newNote, ...prevNotes]);
		setNote('');
		setPreviewMode(false);
	}

	function handleDeleteNote(id) {
		setNotes((prevNotes) => prevNotes.filter((item) => item.id !== id));
	}

	return (
		<SafeAreaView style={styles.safeArea}>
			<KeyboardAvoidingView
				style={styles.keyboard}
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
				<ScrollView
					contentContainerStyle={styles.container}
					keyboardShouldPersistTaps="handled"
					showsVerticalScrollIndicator={false}
				>
					<View style={styles.header}>
						<Text style={styles.title}>Anotações</Text>
						<Text style={styles.subtitle}>
							Escreva e salve suas anotações usando Markdown.
						</Text>
					</View>

					<View style={styles.inputCard}>
						<View style={styles.cardHeader}>
							<Text style={styles.label}>NOVA ANOTAÇÃO</Text>

							<TouchableOpacity
								style={styles.previewButton}
								onPress={() => setPreviewMode(!previewMode)}
							>
								<Ionicons
									name={previewMode ? 'create-outline' : 'eye-outline'}
									size={18}
									color={COLORS.lightNeutral}
								/>
								<Text style={styles.previewButtonText}>
									{previewMode ? 'Editar' : 'Preview'}
								</Text>
							</TouchableOpacity>
						</View>

						{previewMode ? (
							<View style={styles.previewBox}>
								{note.trim() ? (
									<Markdown style={markdownStyles}>{note}</Markdown>
								) : (
									<Text style={styles.placeholderPreview}>
										Nada para visualizar ainda.
									</Text>
								)}
							</View>
						) : (
							<TextInput
								style={styles.textArea}
								value={note}
								onChangeText={setNote}
								placeholder={`Exemplo:\n# Título\n- item importante\n**texto em negrito**`}
								placeholderTextColor="rgba(255,255,255,0.55)"
								multiline
								textAlignVertical="top"
							/>
						)}

						<TouchableOpacity
							style={styles.primaryButton}
							onPress={handleAddNote}
						>
							<Ionicons
								name="save-outline"
								size={20}
								color={COLORS.primary}
							/>
							<Text style={styles.primaryButtonText}>
								Salvar anotação
							</Text>
						</TouchableOpacity>
					</View>

					<View style={styles.notesSection}>
						<Text style={styles.sectionTitle}>Minhas anotações</Text>

						{notes.length === 0 ? (
							<View style={styles.emptyCard}>
								<Ionicons
									name="document-text-outline"
									size={34}
									color="rgba(255,255,255,0.6)"
								/>
								<Text style={styles.emptyText}>
									Nenhuma anotação criada ainda.
								</Text>
							</View>
						) : (
							notes.map((item) => (
								<View key={item.id} style={styles.noteCard}>
									<View style={styles.noteHeader}>
										<Text style={styles.noteDate}>
											{item.createdAt}
										</Text>

										<TouchableOpacity
											onPress={() => handleDeleteNote(item.id)}
										>
											<Ionicons
												name="trash-outline"
												size={20}
												color="#ff4d6d"
											/>
										</TouchableOpacity>
									</View>

									<Markdown style={markdownStyles}>
										{item.text}
									</Markdown>
								</View>
							))
						)}
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: COLORS.primary,
	},

	keyboard: {
		flex: 1,
	},

	container: {
		flexGrow: 1,
		padding: 28,
		paddingBottom: 40,
	},

	topBar: {
		marginTop: 24,
		marginLeft: 28
	},

	header: {
		marginBottom: 28,
	},

	backButton: {
		width: 44,
		height: 44,
		borderRadius: 999,
		backgroundColor: 'rgba(255,255,255,0.1)',
		alignItems: 'center',
		justifyContent: 'center',
	},

	title: {
		fontFamily: FONT.title,
		color: COLORS.lightNeutral,
		fontSize: 44,
		textTransform: 'uppercase',
	},

	subtitle: {
		fontFamily: FONT.body,
		color: COLORS.lightNeutral,
		opacity: 0.75,
		marginTop: 4,
	},

	inputCard: {
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.18)',
		backgroundColor: 'rgba(255,255,255,0.08)',
		borderRadius: 18,
		padding: 18,
	},

	cardHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 10,
	},

	label: {
		fontFamily: FONT.bodyBold,
		color: COLORS.lightNeutral,
		fontSize: 12,
		letterSpacing: 0.5,
	},

	previewButton: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		backgroundColor: 'rgba(255,255,255,0.12)',
		paddingHorizontal: 12,
		paddingVertical: 7,
		borderRadius: 99,
	},

	previewButtonText: {
		fontFamily: FONT.bodyBold,
		color: COLORS.lightNeutral,
		fontSize: 12,
	},

	textArea: {
		minHeight: 160,
		borderWidth: 1,
		borderColor: COLORS.lightNeutral,
		borderRadius: 12,
		padding: 14,
		color: COLORS.lightNeutral,
		fontFamily: FONT.body,
		fontSize: 14,
		lineHeight: 20,
	},

	previewBox: {
		minHeight: 160,
		borderWidth: 1,
		borderColor: COLORS.lightNeutral,
		borderRadius: 12,
		padding: 14,
	},

	placeholderPreview: {
		color: 'rgba(255,255,255,0.55)',
		fontFamily: FONT.body,
		fontSize: 14,
	},

	primaryButton: {
		backgroundColor: COLORS.lightNeutral,
		borderRadius: 99,
		paddingVertical: 11,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		gap: 8,
		marginTop: 14,
	},

	primaryButtonText: {
		color: COLORS.primary,
		fontFamily: FONT.bodyBold,
		fontSize: 15,
		textTransform: 'uppercase',
	},

	notesSection: {
		marginTop: 30,
	},

	sectionTitle: {
		fontFamily: FONT.bodyBold,
		color: COLORS.lightNeutral,
		fontSize: 18,
		marginBottom: 14,
	},

	emptyCard: {
		borderWidth: 1,
		borderStyle: 'dashed',
		borderColor: 'rgba(255,255,255,0.25)',
		borderRadius: 16,
		padding: 28,
		alignItems: 'center',
		gap: 10,
	},

	emptyText: {
		fontFamily: FONT.body,
		color: COLORS.lightNeutral,
		opacity: 0.7,
		textAlign: 'center',
	},

	noteCard: {
		backgroundColor: 'rgba(255,255,255,0.09)',
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.14)',
		borderRadius: 16,
		padding: 16,
		marginBottom: 12,
	},

	noteHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 10,
	},

	noteDate: {
		fontFamily: FONT.bodyBold,
		color: COLORS.secondary,
		fontSize: 12,
	},
});

const markdownStyles = {
	body: {
		color: COLORS.lightNeutral,
		fontFamily: FONT.body,
		fontSize: 14,
		lineHeight: 21,
	},

	heading1: {
		color: COLORS.lightNeutral,
		fontFamily: FONT.bodyBold,
		fontSize: 24,
		marginBottom: 8,
	},

	heading2: {
		color: COLORS.lightNeutral,
		fontFamily: FONT.bodyBold,
		fontSize: 20,
		marginBottom: 8,
	},

	strong: {
		color: COLORS.lightNeutral,
		fontFamily: FONT.bodyBold,
	},

	bullet_list: {
		marginBottom: 8,
	},

	ordered_list: {
		marginBottom: 8,
	},

	code_inline: {
		backgroundColor: 'rgba(255,255,255,0.12)',
		color: COLORS.secondary,
		borderRadius: 6,
		paddingHorizontal: 6,
	},

	fence: {
		backgroundColor: 'rgba(255,255,255,0.12)',
		color: COLORS.lightNeutral,
		borderRadius: 10,
		padding: 10,
	},

	blockquote: {
		borderLeftWidth: 4,
		borderLeftColor: COLORS.secondary,
		paddingLeft: 10,
		opacity: 0.9,
	},
};