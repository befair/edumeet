export function getSignalingUrl(peerId, roomId, authToken)
{
	const port =
		process.env.NODE_ENV !== 'production' ?
			window.config.developmentPort
			:
			window.config.productionPort;

	const url = `wss://${window.location.hostname}:${port}/?peerId=${peerId}&roomId=${roomId}&authToken=${authToken}`;

	return url;
}
