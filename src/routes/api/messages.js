import Pusher from 'pusher';

import { APP_ID, KEY, SECRET, CLUSTER } from '$lib/utils';

let appId, key, secret, cluster;

if (process.env.NODE_ENV === 'production') {
	// For production
	appId = process.env.APP_ID;
	key = process.env.KEY;
	secret = process.env.SECRET;
	cluster = process.env.CLUSTER;
} else {
	// For development
	appId = APP_ID;
	key = KEY;
	secret = SECRET;
	cluster = CLUSTER;
}

const pusher = new Pusher({
	appId: appId,
	key: key,
	secret: secret,
	cluster: cluster,
	useTLS: true
});

export const post = async (req) => {
	await pusher.trigger(req.body.roomcode, 'message', {
		username: req.body.username,
		results: req.body.results,
		success: req.body.success
	});
	// send back the result
	return {
		status: 200,
		body: []
	};
};
