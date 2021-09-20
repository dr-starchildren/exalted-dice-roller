export function makeid(length) {
	var result = '';
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

export const APP_ID = import.meta.env.VITE_APP_ID;
export const KEY = import.meta.env.VITE_KEY;
export const SECRET = import.meta.env.VITE_SECRET;
export const CLUSTER = import.meta.env.VITE_CLUSTER;
