import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';

const EmailConfirmation = () => {
	const [status, setStatus] = useState('not_confirmed');
	const { token } = useParams();

	useEffect(() => {
		fetch(`/students/email-confirmation/${token}`)
			.then(res => res.json())
			.then(res => {
				console.log(res)
				if(res.status === "confirmed") {
					setStatus(res.status)
				}
			})
			.catch(err => console.log(err))
	}, [])

	return (
		<div className="email_conf_wrapper">
			{ status === "confirmed" && <h2 style={{ textAlign: "center" }}>Congrats, your email is successfully confirmed</h2> }
		</div>
	)
}

export default EmailConfirmation;