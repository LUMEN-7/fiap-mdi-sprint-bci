const CAR_MODELS = {
	'1': {
		id: '1',
		brand: 'Ford',
		name: 'Mustang',
		image: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/mustang.png',
		summary: 'O Mustang entrega aceleracao superior e um comportamento mais esportivo para estrada e pista.',
		specs: [
			{ id: 'motor', label: 'Motor', value: '5.0L V8', icon: 'engine-outline' },
			{ id: 'potencia', label: 'Potencia', value: '488 cv', icon: 'horse-variant-fast' },
			{ id: 'tipo', label: 'Tipo', value: 'Esportivo', icon: 'shape-outline' },
			{ id: 'consumo', label: 'Consumo', value: '7.8 km/L', icon: 'gas-station-outline' },
		],
		sections: [
			{ id: 'performance', title: 'Performance', items: ['Entrega agressiva de potencia para aceleracoes fortes', 'Acerto esportivo de suspensao e direcao', 'Cambio automatico pensado para resposta rapida', 'Comportamento voltado para estrada e pista'] },
			{ id: 'consumo', title: 'Consumo', items: ['Consumo compativel com uso misto e condução esportiva', 'Gerenciamento eletronico de eficiencia', 'Metricas em tempo real no painel digital', 'Perfil de condução adaptavel ao motorista'] },
			{ id: 'seguranca', title: 'Seguranca', items: ['Pacote de assistencia a condução com multiplos alertas', 'Controle avancado de estabilidade', 'Assistente de frenagem e tracao', 'Mais confianca em manobras de alta velocidade'] },
			{ id: 'tecnologia', title: 'Tecnologia', items: ['Central com foco em conectividade e entretenimento', 'Painel digital configuravel', 'Integracao com smartphone e comandos rapidos', 'Recursos de assistencia inteligente ao volante'] },
			{ id: 'conforto', title: 'Conforto', items: ['Cabine com pegada premium esportiva', 'Bancos com acabamento refinado', 'Climatizacao automatica eficiente', 'Experiencia mais silenciosa e estavel em viagem'] },
		],
	},
	'2': {
		id: '2',
		brand: 'Ford',
		name: 'Bronco',
		image: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/bronco1.png',
		summary: 'O Bronco apresenta maior torque e foco off-road, com comportamento robusto para diferentes terrenos.',
		specs: [
			{ id: 'motor', label: 'Motor', value: '2.3L EcoBoost', icon: 'engine-outline' },
			{ id: 'potencia', label: 'Potencia', value: '300 cv', icon: 'horse-variant-fast' },
			{ id: 'tipo', label: 'Tipo', value: 'SUV', icon: 'shape-outline' },
			{ id: 'consumo', label: 'Consumo', value: '9.6 km/L', icon: 'gas-station-outline' },
		],
		sections: [
			{ id: 'performance', title: 'Performance', items: ['Desempenho equilibrado para cidade e estrada', 'Tracao e resposta adaptadas ao uso off-road', 'Suspensao preparada para diferentes terrenos', 'Condução robusta com boa dirigibilidade'] },
			{ id: 'consumo', title: 'Consumo', items: ['Media pensada para um SUV de maior porte', 'Modo de condução para eficiencia em deslocamentos', 'Monitoramento de consumo em tempo real', 'Verificacao inteligente de autonomia'] },
			{ id: 'seguranca', title: 'Seguranca', items: ['Pacote de assistencia para trilhas e estrada', 'Controle de estabilidade e tracao aprimorado', 'Alertas de manobra e ponto cego', 'Projetado para maior controle em trajetos exigentes'] },
			{ id: 'tecnologia', title: 'Tecnologia', items: ['Tela com foco em navegacao e conectividade', 'Sistema multimidia com resposta rapida', 'Integracao facil com o celular', 'Recursos inteligentes para apoio ao motorista'] },
			{ id: 'conforto', title: 'Conforto', items: ['Cabine espacosa com posicao elevada', 'Acabamento voltado ao uso aventureiro premium', 'Climatizacao eficiente para longos trajetos', 'Conforto pensado para quem viaja com frequencia'] },
		],
	},
	'3': {
		id: '3',
		brand: 'Ford',
		name: 'Maverick',
		image: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/carro.png',
		summary: 'A Maverick equilibra praticidade e desempenho com proposta versatil para rotina e trabalho.',
		specs: [
			{ id: 'motor', label: 'Motor', value: '2.0L Turbo', icon: 'engine-outline' },
			{ id: 'potencia', label: 'Potencia', value: '250 cv', icon: 'horse-variant-fast' },
			{ id: 'tipo', label: 'Tipo', value: 'Picape', icon: 'shape-outline' },
			{ id: 'consumo', label: 'Consumo', value: '12 km/L', icon: 'gas-station-outline' },
		],
		sections: [
			{ id: 'performance', title: 'Performance', items: ['Conjunto voltado para uso urbano e estrada', 'Resposta rapida com foco em versatilidade', 'Bom equilibrio entre carga e dirigibilidade', 'Condução confortavel mesmo com uso misto'] },
			{ id: 'consumo', title: 'Consumo', items: ['Eficiencia pensada para rotina de trabalho e lazer', 'Gerenciamento de combustivel mais inteligente', 'Indicadores para condução economica', 'Autonomia favoravel para uso diario'] },
			{ id: 'seguranca', title: 'Seguranca', items: ['Assistentes para frenagem e estabilidade', 'Sensores de apoio em manobras', 'Boa visibilidade e controle de cabine', 'Sistema pensado para uso diario seguro'] },
			{ id: 'tecnologia', title: 'Tecnologia', items: ['Sistema conectado com recursos praticos', 'Tela com leitura rapida de informacoes', 'Integracao com smartphone e mapas', 'Tecnologia util para trabalho e lazer'] },
			{ id: 'conforto', title: 'Conforto', items: ['Cabine confortavel para uso prolongado', 'Bancos com foco em ergonomia', 'Acabamento funcional e moderno', 'Boa acomodacao para ocupantes e carga'] },
		],
	},
	'4': {
		id: '4',
		brand: 'Ford',
		name: 'Expedition',
		image: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/expedtion.png',
		summary: 'A Expedition traz espaco, conforto e presenca para viagens longas com a familia.',
		specs: [
			{ id: 'motor', label: 'Motor', value: '3.0L V6', icon: 'engine-outline' },
			{ id: 'potencia', label: 'Potencia', value: '400 cv', icon: 'horse-variant-fast' },
			{ id: 'tipo', label: 'Tipo', value: 'SUV grande', icon: 'shape-outline' },
			{ id: 'consumo', label: 'Consumo', value: '8.5 km/L', icon: 'gas-station-outline' },
		],
		sections: [
			{ id: 'performance', title: 'Performance', items: ['Forca para viajar com seguranca e presenca', 'Resposta consistente mesmo em veiculo maior', 'Conjunto ideal para familia e longas distancias', 'Direcao estavel para diferentes cenarios de uso'] },
			{ id: 'consumo', title: 'Consumo', items: ['Consumo compativel com porte e proposta do modelo', 'Otimizacao eletronica para viagem', 'Informacoes de consumo visiveis ao condutor', 'Gestao eficiente para deslocamentos maiores'] },
			{ id: 'seguranca', title: 'Seguranca', items: ['Pacote completo de assistencia e protecao', 'Sistemas eletronicos de estabilidade e frenagem', 'Bom nivel de visibilidade e controle', 'Solucoes para trajetos urbanos e rodoviarios'] },
			{ id: 'tecnologia', title: 'Tecnologia', items: ['Sistema multimidia completo', 'Painel moderno com multiplas informacoes', 'Conectividade para toda a familia', 'Recursos de assistencia de alto nivel'] },
			{ id: 'conforto', title: 'Conforto', items: ['Cabine ampla e confortavel', 'Acabamento premium para longas viagens', 'Climatizacao e ergonomia de destaque', 'Proposta pensada para conforto familiar'] },
		],
	},
};

export function getCarModel(modelId) {
	return CAR_MODELS[String(modelId)] || CAR_MODELS['1'];
}

export function getComparisonSummary(firstId, secondId) {
	const firstCar = getCarModel(firstId);
	const secondCar = getCarModel(secondId);

	return `${secondCar.name} has a more focused profile, while ${firstCar.name} stands out in ${firstCar.sections[0]?.title?.toLowerCase() || 'performance'}.`;
}

export { CAR_MODELS };
