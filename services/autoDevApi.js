const autoDevApiKey =
	process.env.EXPO_PUBLIC_AUTODEV_API_KEY ||
	process.env.AUTODEV_API_KEY ||
	process.env.AUTO_DEV_API_KEY;

export function isVin(value) {
	return /^[A-HJ-NPR-Z0-9]{17}$/i.test(String(value || '').trim());
}

function getAutoDevApiKey() {
	if (!autoDevApiKey) {
		throw new Error(
			'Chave da API automotiva não configurada. Defina EXPO_PUBLIC_AUTODEV_API_KEY no .env.'
		);
	}

	return autoDevApiKey;
}

async function requestAutoDev(path) {
	const apiKey = getAutoDevApiKey();
	const response = await fetch(`https://api.auto.dev${path}`, {
		headers: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json',
		},
	});

	const payload = await response.json().catch(() => ({}));

	if (!response.ok) {
		const message = payload?.error || 'Falha ao consultar a API automotiva.';
		throw new Error(message);
	}

	return payload;
}

function buildListingsQuery(filters) {
	const searchParams = new URLSearchParams();

	const make = String(filters?.marca || filters?.make || '').trim();
	const model = String(filters?.modelo || filters?.model || '').trim();
	const trim = String(filters?.versao || filters?.trim || '').trim();
	const year = String(filters?.ano || filters?.year || '').trim();

	if (make) searchParams.set('vehicle.make', make);
	if (model) searchParams.set('vehicle.model', model);
	if (trim) searchParams.set('vehicle.trim', trim);
	if (year) searchParams.set('vehicle.year', year);

	searchParams.set('limit', '10');
	searchParams.set('sort', 'updatedAt.desc');
	searchParams.set('includeUnpriced', 'true');

	return searchParams;
}

async function searchListings(filters) {
	const query = buildListingsQuery(filters).toString();
	const payload = await requestAutoDev(`/listings?${query}`);
	return Array.isArray(payload?.data) ? payload.data : [];
}

function getListingVin(listing) {
	return (
		listing?.vin ||
		listing?.vehicle?.vin ||
		listing?.vehicle?.squishVin ||
		''
	);
}

function getVehicleFromListing(listing) {
	return listing?.vehicle || {};
}

function uniqueUrls(urls) {
	const seen = new Set();
	const result = [];

	for (const raw of (urls || [])) {
		const value = String(raw || '').trim();
		if (!value) continue;

		// canonicalize by stripping query and fragment so different size params don't duplicate
		let canonical = value;
		try {
			const u = new URL(value);
			canonical = `${u.origin}${u.pathname}`;
		} catch (e) {
			canonical = value.split(/[?#]/)[0];
		}

		if (seen.has(canonical)) continue;

		seen.add(canonical);
		result.push(value);
	}

	return result;
}

export async function fetchAutoDevVehicleByVin(vin) {
	const [decodeResponse, photosResponse] = await Promise.all([
		requestAutoDev(`/vin/${encodeURIComponent(vin)}`),
		requestAutoDev(`/photos/${encodeURIComponent(vin)}`),
	]);

	return {
		vehicle: decodeResponse?.data || decodeResponse || {},
		retailPhotos: photosResponse?.data?.retail || [],
	};
}

export async function resolveVehicleSearchToPhotos(parsedQuery) {
	const searchVariants = [
		parsedQuery,
		{ marca: parsedQuery?.marca, modelo: parsedQuery?.modelo, ano: parsedQuery?.ano },
		{ marca: parsedQuery?.marca, modelo: parsedQuery?.modelo },
		{ marca: parsedQuery?.marca },
	].filter((variant) => String(variant?.marca || '').trim());

	const seenVins = new Set();
	const resolvedVehicles = [];

	for (const variant of searchVariants) {
		const listings = await searchListings(variant);

		for (const listing of listings) {
			const vin = getListingVin(listing);
			if (!isVin(vin) || seenVins.has(vin)) {
				continue;
			}

			seenVins.add(vin);

			const photosPayload = await requestAutoDev(`/photos/${encodeURIComponent(vin)}`);
			const retailPhotos = photosPayload?.data?.retail || [];
			const primaryImage = listing?.retailListing?.primaryImage || '';
			const orderedPhotos = uniqueUrls(
				primaryImage
					? [primaryImage, ...retailPhotos]
					: retailPhotos
			);

			if (orderedPhotos.length === 0) {
				continue;
			}

			const vehicle = getVehicleFromListing(listing);
			const resolvedYear = vehicle?.year || parsedQuery?.ano || '';
			const resolvedBrand = vehicle?.make || parsedQuery?.marca || '';
			const resolvedModel = vehicle?.model || parsedQuery?.modelo || '';
			const resolvedVersion = vehicle?.trim || parsedQuery?.versao || '';

			resolvedVehicles.push({
				vin,
				marca: resolvedBrand,
				modelo: resolvedModel,
				versao: resolvedVersion,
				ano: String(resolvedYear || ''),
				imagem: orderedPhotos[0] || '',
				galeria: orderedPhotos,
				vehicle,
			});
		}

		if (resolvedVehicles.length >= 12) {
			break;
		}
	}

	if (resolvedVehicles.length === 0) {
		return [];
	}

	return resolvedVehicles;
}