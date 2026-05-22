import axios from 'axios';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY || '';

function extractJson(text) {
	const cleaned = text
		.replace(/```json/g, '')
		.replace(/```/g, '')
		.trim();

	const firstBrace = cleaned.indexOf('{');
	const lastBrace = cleaned.lastIndexOf('}');

	if (firstBrace === -1 || lastBrace === -1) {
		throw new Error('A IA não retornou um JSON válido.');
	}

	return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
}

export async function interpretarBuscaVeiculo(consulta) {
  if (!consulta || !consulta.trim()) {
    throw new Error('Informe o nome do veículo para buscar.');
  }

  if (!GROQ_API_KEY) {
    throw new Error('Chave da Groq não configurada.');
  }

  const prompt = `
Você é um extrator de veículos.

Analise a consulta do usuário e retorne SOMENTE um objeto JSON válido.
Não use markdown.
Não adicione explicações.

Schema obrigatório:
{
  "marca": "",
  "modelo": "",
  "versao": "",
  "ano": "",
  "nivel_confianca": ""
}

Regras:
- Extraia a marca, modelo, versão e ano mais prováveis.
- Se um campo não existir, use "".
- "ano" deve ser uma string com quatro dígitos quando houver ano explícito.
- "nivel_confianca" deve ser "alto", "médio" ou "baixo".
- Priorize a forma mais compatível para busca de listings e fotos.
- Consulte apenas o texto do usuário, sem inventar dados que não estejam sugeridos.

Consulta: ${consulta}
`;

  const response = await axios.post(
    GROQ_API_URL,
    {
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      max_tokens: 300,
    },
    {
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    }
  );

  const rawText = response.data?.choices?.[0]?.message?.content;

  if (!rawText) {
    throw new Error('Resposta vazia da IA.');
  }

  return extractJson(rawText);
}

export async function getFichaTecnica(marca, modelo, versao = '') {
	if (!marca || !modelo) {
		throw new Error('Marca e modelo são obrigatórios.');
	}

	if (!GROQ_API_KEY) {
		throw new Error('Chave da Groq não configurada.');
	}

const prompt = `
Você é um especialista em fichas técnicas automotivas.

Retorne SOMENTE um objeto JSON válido.
Não use markdown.
Não explique nada.
Não adicione texto antes ou depois.

Schema obrigatório:
{
  "marca": "",
  "modelo": "",
  "versao": "",
  "ano": "",
  "resumo": "",
  "descricao_detalhada": "",

  "resumo_rapido": {
    "motor": "",
    "potencia": "",
    "tipo": "",
    "consumo": ""
  },

  "performance": {
    "motor": "",
    "potencia": "",
    "torque": "",
    "cambio": "",
    "tracao": "",
    "zero_a_cem": "",
    "velocidade_maxima": ""
  },

  "consumo": {
    "combustivel": "",
    "cidade": "",
    "estrada": "",
    "autonomia_aproximada": "",
    "capacidade_tanque": ""
  },

  "seguranca": {
    "airbags": "",
    "freios": "",
    "controle_estabilidade": "",
    "controle_tracao": "",
    "assistencias": []
  },

  "tecnologia": {
    "central_multimidia": "",
    "painel_digital": "",
    "conectividade": "",
    "assistente_conducao": "",
    "itens": []
  },

  "conforto": {
    "bancos": "",
    "ar_condicionado": "",
    "porta_malas": "",
    "espaco_interno": "",
    "itens": []
  }
}

Regras:
- Use dados reais sempre que possível.
- "resumo" deve ser um parágrafo curto, natural e útil para apresentação do carro.
- "descricao_detalhada" deve ter 2 a 4 frases com contexto de uso, proposta e diferenciais.
- Se não souber algum campo, use exatamente "Não disponível".
- Arrays devem ter no máximo 5 itens.
- "tipo" em resumo_rapido deve ser algo como "Combustão", "Híbrido", "Elétrico" ou "Flex".
- "consumo" em resumo_rapido deve vir resumido, exemplo: "11 km/L".
- "imagem_sugerida" deve ser uma URL DIRETA e válida de imagem do veículo.
- Retorne SOMENTE links públicos que terminem em .png, .jpg, .jpeg ou .webp.
- Preferencialmente use imagens oficiais de imprensa/montadora.
- Nunca retorne descrição textual.
- Se não encontrar imagem confiável, use exatamente "Não disponível".
- NÃO adicione campos extras.

Veículo: ${marca} ${modelo} ${versao}
`;

	const response = await axios.post(
		GROQ_API_URL,
		{
			model: 'llama-3.3-70b-versatile',
			messages: [
				{
					role: 'user',
					content: prompt,
				},
			],
			temperature: 0.1,
			max_tokens: 1000,
		},
		{
			headers: {
				Authorization: `Bearer ${GROQ_API_KEY}`,
				'Content-Type': 'application/json',
			},
			timeout: 20000,
		}
	);

	const rawText = response.data?.choices?.[0]?.message?.content;

	if (!rawText) {
		throw new Error('Resposta vazia da IA.');
	}

	return extractJson(rawText);
}

export async function compararCarros(carroA, carroB) {
	if (!carroA || !carroB) {
		throw new Error('Informe dois carros para comparar.');
	}

	if (!GROQ_API_KEY) {
		throw new Error('Chave da Groq não configurada.');
	}

	const prompt = `
Você é um especialista em comparação automotiva.

Compare os dois veículos abaixo e retorne SOMENTE JSON válido.
Não use markdown.
Não adicione explicações fora do JSON.

Schema obrigatório:
{
  "titulo": "",
  "carro_a": {
    "nome": "",
    "marca": "",
    "modelo": "",
    "versao": "",
    "imagem_sugerida": ""
  },
  "carro_b": {
    "nome": "",
    "marca": "",
    "modelo": "",
    "versao": "",
    "imagem_sugerida": ""
  },
  "comparativo": {
    "motor": {
      "vencedor": "",
      "justificativa": ""
    },
    "potencia": {
      "vencedor": "",
      "justificativa": ""
    },
    "consumo": {
      "vencedor": "",
      "justificativa": ""
    },
    "espaco": {
      "vencedor": "",
      "justificativa": ""
    },
    "tecnologia": {
      "vencedor": "",
      "justificativa": ""
    },
    "custo_beneficio": {
      "vencedor": "",
      "justificativa": ""
    }
  },
  "resumo_final": "",
  "melhor_escolha": "",
  "nivel_confianca": ""
}

Regras:
- O vencedor deve ser "carro_a", "carro_b" ou "empate".
- Se faltar informação, use "Não disponível".
- Não invente dados técnicos se não tiver certeza.
- "nivel_confianca" deve ser "alto", "médio" ou "baixo".

Carro A:
${JSON.stringify(carroA)}

Carro B:
${JSON.stringify(carroB)}
`;

	const response = await axios.post(
		GROQ_API_URL,
		{
			model: 'llama-3.3-70b-versatile',
			messages: [
				{
					role: 'user',
					content: prompt,
				},
			],
			temperature: 0.1,
			max_tokens: 1200,
		},
		{
			headers: {
				Authorization: `Bearer ${GROQ_API_KEY}`,
				'Content-Type': 'application/json',
			},
			timeout: 20000,
		}
	);

	const rawText = response.data?.choices?.[0]?.message?.content;

	if (!rawText) {
		throw new Error('Resposta vazia da IA.');
	}

	return extractJson(rawText);
}