import React, { useState, useEffect, useContext } from 'react';
import Alert from '@material-ui/lab/Alert';
import AuthContext from '../../contexts/auth-context';
import fetchAuthUser from '../../api/fetch-authenticated-user';
import './ContactUs.scss'

const ContactUs = () => {
	const [student, setStudent] = useState({});
	const [message, setMsg] = useState('');
	const [notification, setNotification] = useState('');
	const context = useContext(AuthContext);

	useEffect(() => {
		document.title = 'Contact us'
		let isMounted = true;

		fetchAuthUser(context)
      .then((student) => {
        if (student && isMounted) {
          setStudent(student);
        }
      })
      .catch((err) => {
        console.log(err)
      });
	}, [context]);

	const submitContactUs = e => {
		e.preventDefault();
		const info_with_message = {
			id: student._id,
			name: student.name,
			batch: student.batch,
			department: student.department,
			std_id: student.std_id,
			email: student.email,
			message
		}
		fetch('/students/contact_us', {
			method: 'POST',
			headers: { 
				'Content-Type': 'application/json',
        Authorization: 'Bearer ' + context.token,
			},
      body: JSON.stringify({
				infoWithMsg: info_with_message
      }),
		})
		.then(res => res.json())
		.then(res => {
			if(res.message === "Message sent") {
				setMsg('');
				setNotification(res.message)
			}
		})
		.catch(err => {
			console.error(err);
		})
	}

	return (
		<div className="contact_us_wrapper" id="contact_us_wrapper">
			{notification && (
        <Alert severity="success">
          {notification}
        </Alert>
      )}
			<div className="title">
				<h2>Contact us</h2>
			</div>
			{Object.keys(student).length !== 0 && student.constructor === Object && (
				<div className="fields">
					<form onSubmit={submitContactUs}>
						<input
							type="text"
							placeholder="ID"
							disabled
							className="id_field"
							value={student.std_id}
							onChange={e => {
								return;
							}}
						/>
						<textarea 
							rows="6" 
							className="msg_field" 
							placeholder="Message"
							value={message}
							onChange={e => setMsg(e.target.value)}
						/>
						<div className="btn_wrap">
							<button type="submit" className="send_msg_btn">Send Message</button>
						</div>
					</form>
				</div>
			)}
		</div>
	)
}

export default ContactUs;