export const getPrivateKey = (): string => {
	// Private ket must not be accessible client-side
	// Using JSON to handle newline problems when storing the key as a secret in Vercel. See:
	// https://github.com/vercel/vercel/issues/749#issuecomment-707515089
	// If in next.js development mode, don't use JSON.parse
	try {
		const privateKey =
			process.env.NODE_ENV === "development" && typeof window !== "undefined"
				? process.env.FIREBASE_PRIVATE_KEY
				: JSON.parse(process.env.FIREBASE_PRIVATE_KEY as string);
		if (!privateKey) return "";
		return privateKey;
	} catch (error) {
		if (!process.env.FIREBASE_PRIVATE_KEY) return "";
		return process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");
	}
};