export const getExpirationDate = (jwtToken) => {
	if (!jwtToken) {
		return null;
	}

	const jwt = JSON.parse(atob(jwtToken.split('.')[1]));

	// multiply by 1000 to convert seconds into milliseconds
	return (jwt && jwt.exp && jwt.exp * 1000) || null;
};