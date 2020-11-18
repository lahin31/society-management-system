import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import Loader from '../../../components/loader/Loader';
import AuthContext from '../../../contexts/auth-context';
import { genAccessToken } from '../../../helpers/GenAccessToken';

import './SocietyDetails.scss';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <>
					{children}
				</>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
	},
	table: {
    minWidth: 650,
  },
}));

const SocietyDetails = () => {
	const classes = useStyles();
	const [society, setSociety] = useState({});
	const [members, setMembers] = useState([]);
	const { society_id } = useParams();
	const [value, setValue] = useState(0);
	const [loading, setLoading] = useState(false);
	const context = useContext(AuthContext);

	useEffect(() => {
    genAccessToken();
  }, []);

	useEffect(() => {
		setLoading(true);
		document.title = '';
		let isMounted = true;
		fetch('/society/get_details', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + context.token,
			},
			body: JSON.stringify({
        society_id
			})
		})
		.then(res => res.json())
		.then(res => {
			if(isMounted) {
				setMembers(res.members);
				setSociety(res.society);
				document.title = `${res.society.name}`;
			}
		})
		.catch(err => console.error(err))
		.finally(() => {
			setLoading(false);
		})

		return () => {
			isMounted = false;
		}
	}, [society_id, context])

	const handleChange = (_, newValue) => {
    setValue(newValue);
  };

	return (
		<div className="society_details_wrapper">
			{loading &&
      Object.keys(society).length === 0 &&
      society.constructor === Object ? (
        <div className="loader_wrap">
          <Loader width={140} height={140} />
        </div>
      ): (
				<>
					<div className="society_info">
						<h1 className="society_title">{society.name}</h1>
						<p className="society_description">{society.description}</p>
					</div>
					<div className="society_details">
						<div className={classes.root}>
							<AppBar position="static">
								<Tabs value={value} onChange={handleChange} aria-label="simple tabs example" className="tabs">
									<Tab label="Events" {...a11yProps(0)} />
									<Tab label="Notices" {...a11yProps(1)} />
									<Tab label="Members" {...a11yProps(1)} />
								</Tabs>
							</AppBar>
							<TabPanel value={value} index={0}>
								<div className="events">
									{Object.keys(society).length && society.events.map(event => {
										return (
											<div className="event" key={event._id}>
												<div className="content_title">
													<h2 className="event_title">
														{event.title}
													</h2>
												</div>
												<div className="content_published_time">
													<span style={{ color: 'gray' }}>
														{new Intl.DateTimeFormat(
															'en-GB'
														).format(
															new Date(
																event.date
															)
														)}{' '}
														{event.time.substr(
															11,
															8
														)}
													</span>
												</div>
												<div className="content_description">
													<p>
														{event.description.substr(
															0,
															event.description
																.length / 2
														)}
														...
													</p>
												</div>
											</div>
										)
									})}
									{Object.keys(society).length && society.events.length <= 0 && <p>No event found</p> }
								</div>
							</TabPanel>
							<TabPanel value={value} index={1}>
								<div className="notices">
									{Object.keys(society).length && society.notices.map(notice => {
										return (
											<div className="notice" key={notice._id}>
												<div className="content_title">
													<h2 className="notice_title">
														{notice.title}
													</h2>
												</div>
												<div className="content_description">
													<p className="notice_description">
														{notice.description.substr(
															0,
															notice.description
																.length / 2
														)}
														...
													</p>
												</div>
											</div>
										)
									})}
									{Object.keys(society).length && society.notices.length <= 0 && <p>No notice found</p> }
								</div>
							</TabPanel>
							<TabPanel value={value} index={2}>
								<TableContainer component={Paper}>
									<Table className={classes.table} aria-label="simple table">
										<TableHead>
											<TableRow>
												<TableCell>Name</TableCell>
												<TableCell align="left">Email</TableCell>
												<TableCell align="left">Batch</TableCell>
												<TableCell align="left">ID</TableCell>
												<TableCell align="left">Department</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{members && members.length > 0 && members.map((member) => (
												<TableRow key={member._id}>
													<TableCell component="th" scope="member">
														{member.name}
													</TableCell>
													<TableCell align="left">{member.email}</TableCell>
													<TableCell align="left">{member.batch}</TableCell>
													<TableCell align="left">{member.std_id}</TableCell>
													<TableCell align="left">{member.department}</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
          			</TableContainer>
							</TabPanel>
						</div>
					</div>
				</>
			)}
		</div>
	)
}

export default SocietyDetails;