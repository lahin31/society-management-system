import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../../contexts/auth-context';
import fetchAuthUser from '../../api/fetch-authenticated-user';
import './ContactUs.scss'

const ContactUs = () => {
	const [student, setStudent] = useState({});
	const context = useContext(AuthContext);

	useEffect(() => {
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
	}, []);

	return (
		<div className="contact_us_wrapper" id="contact_us_wrapper">
			<div className="title">
				<h2>Contact us</h2>
			</div>
			{Object.keys(student).length !== 0 && student.constructor === Object && (
				<div className="fields">
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
					<textarea rows="6" className="msg_field" placeholder="Message" />
					<div className="btn_wrap">
						<button className="send_msg_btn">Send Message</button>
					</div>
				</div>
			)}
		</div>
	)
}

export default ContactUs;