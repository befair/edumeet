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

export function getRoomUrl(roomId)
{
	const port =
		process.env.NODE_ENV !== 'production' ?
			window.config.developmentPort
			:
			window.config.productionPort;

	const url =
		(port != '443' && port != '80') ?
			`https://${window.location.hostname}:${port}/${roomId}`
			:
			`https://${window.location.hostname}/${roomId}`;

	return url;
}

export function getPrivilegedUrl(roomId, authToken)
{
	return getRoomUrl(roomId) + `?token=${authToken}`;
}
