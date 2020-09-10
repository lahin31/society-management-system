import {
	getExpirationDate
} from './GetExpirationDate';
import {
	isExpired
} from './IsExpired';

export const genAccessToken = () => {
	const accessToken = JSON.parse(
		localStorage.getItem('accessToken')
	);
	if (isExpired(getExpirationDate(accessToken))) {
		const refreshToken = JSON.parse(
			localStorage.getItem('refreshToken')
		);
		fetch('/token/generate-access-token', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					refreshToken,
				}),
			})
			.then((res) => res.json())
			.then((res) => {
				if (res.message === 'success') {
					localStorage.setItem(
						'accessToken',
						JSON.stringify(res.accessToken)
					);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}
}