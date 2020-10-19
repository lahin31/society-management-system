import React, { useState, useEffect } from 'react';
import './ContactUs.scss'

const ContactUs = () => {
	return (
		<div className="contact_us_wrapper" id="contact_us_wrapper">
			<div className="title">
				<h2>Contact us</h2>
			</div>
			<div className="fields">
				<input
					type="text"
					placeholder="ID"
					disabled
					className="id_field"
				/>
				<textarea rows="6" className="msg_field" placeholder="Message" />
				<div className="btn_wrap">
					<button className="send_msg_btn">Send Message</button>
				</div>
			</div>
		</div>
	)
}

export default ContactUs;