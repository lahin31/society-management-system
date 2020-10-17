export const isExpired = (exp) => {
	if (!exp) {
		return false;
	}

	return Date.now() > exp;
};