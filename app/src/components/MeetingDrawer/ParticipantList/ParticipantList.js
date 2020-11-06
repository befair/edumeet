import React from 'react';
import { connect } from 'react-redux';
import {
	participantListSelector,
	makePermissionSelector
} from '../../Selectors';
import { permissions } from '../../../permissions';
import classnames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Flipper, Flipped } from 'react-flip-toolkit';
import { FormattedMessage } from 'react-intl';
import ListPeer from './ListPeer';
import ListMe from './ListMe';
import ListModerator from './ListModerator';
import Volume from '../../Containers/Volume';
import Button from '@material-ui/core/Button';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import FileCopyIcon from '@material-ui/icons/FileCopy';

const styles = (theme) =>
	({
		root :
		{
			width     : '100%',
			overflowY : 'auto',
			padding   : theme.spacing(1)
		},
		list :
		{
			listStyleType   : 'none',
			padding         : theme.spacing(1),
			boxShadow       : '0 2px 5px 2px rgba(0, 0, 0, 0.2)',
			backgroundColor : 'rgba(255, 255, 255, 1)'
		},
		listheader :
		{
			fontWeight : 'bolder'
		},
		listItem :
		{
			width                : '100%',
			overflow             : 'hidden',
			cursor               : 'pointer',
			'&:not(:last-child)' :
			{
				borderBottom : '1px solid #CBCBCB'
			}
		}
	});

class ParticipantList extends React.PureComponent
{
	componentDidMount()
	{
		this.node.scrollTop = this.node.scrollHeight;
	}

	getSnapshotBeforeUpdate()
	{
		return this.node.scrollTop
			+ this.node.offsetHeight === this.node.scrollHeight;
	}

	componentDidUpdate(prevProps, prevState, shouldScroll)
	{
		if (shouldScroll)
		{
			this.node.scrollTop = this.node.scrollHeight;
		}
	}

	render()
	{
		const {
			advancedMode,
			isModerator,
			participants,
			spotlights,
			selectedPeers,
			classes
		} = this.props;

		return (
			<div className={classes.root} ref={(node) => { this.node = node; }}>
				{ isModerator &&
					<ul className={classes.list}>
						<li className={classes.listheader}>
							<FormattedMessage
								id='room.moderatoractions'
								defaultMessage='Moderator actions'
							/>
						</li>
						<ListModerator />
					</ul>
				}
				{ isModerator &&
					<ul className={classes.list}>
						<li className={classes.listheader}>
							<FormattedMessage
								id='room.privilegedjoinlink'
								defaultMessage='Link to join as moderator'
							/>
						</li>
						<li>
							<Button
								aria-label='Show/Hide'
								variant='contained'
								color='secondary'
								onClick={() =>
								{
									const el = document.getElementById('auth');

									el.hidden = !el.hidden;
								}}
							>
								<FormattedMessage
									id='room.showhide'
									defaultMessage='Show/Hide'
								/>
							</Button>
							<div id='auth' hidden>
								<OutlinedInput
									id='modLink'
									value={roomClient._shareModLink}
									variant='outlined'
									margin='normal'
									disabled
									fullWidth
									endAdornment={
										<InputAdornment position='end'>
											<FileCopyIcon
												onClick={() =>
												{
													const el = document.getElementById('modLink');

													navigator.clipboard.writeText(el.value);
												}}
											/>
										</InputAdornment>
									}
								/>
							</div>
						</li>
					</ul>
				}
				<ul className={classes.list}>
					<li className={classes.listheader}>
						<FormattedMessage
							id='room.joinlink'
							defaultMessage='Link to join'
						/>
					</li>
					<li>
						<OutlinedInput
							id='roomLink'
							value={roomClient._roomLink}
							variant='outlined'
							margin='normal'
							disabled
							fullWidth
							endAdornment={
								<InputAdornment position='end'>
									<FileCopyIcon
										onClick={() =>
										{
											const el = document.getElementById('roomLink');

											navigator.clipboard.writeText(el.value);
										}}
									/>
								</InputAdornment>
							}
						/>
					</li>
				</ul>
				<ul className={classes.list}>
					<li className={classes.listheader}>
						<FormattedMessage
							id='room.me'
							defaultMessage='Me'
						/>
					</li>
					<ListMe />
				</ul>
				<ul className={classes.list}>
					<li className={classes.listheader}>
						<FormattedMessage
							id='label.participants'
							defaultMessage='Participants'
						/>
					</li>
					<Flipper
						flipKey={participants}
					>
						{ participants.map((peer) => (
							<Flipped key={peer.id} flipId={peer.id}>
								<li
									key={peer.id}
									className={classnames(classes.listItem)}
								>
									<ListPeer
										id={peer.id}
										advancedMode={advancedMode}
										isModerator={isModerator}
										spotlight={spotlights.includes(peer.id)}
										isSelected={selectedPeers.includes(peer.id)}
									>
										<Volume small id={peer.id} />
									</ListPeer>
								</li>
							</Flipped>
						))}
					</Flipper>
				</ul>
			</div>
		);
	}
}

ParticipantList.propTypes =
{
	advancedMode  : PropTypes.bool,
	isModerator   : PropTypes.bool.isRequired,
	participants  : PropTypes.array.isRequired,
	spotlights    : PropTypes.array.isRequired,
	selectedPeers : PropTypes.array.isRequired,
	classes       : PropTypes.object.isRequired
};

const makeMapStateToProps = () =>
{
	const hasPermission = makePermissionSelector(permissions.MODERATE_ROOM);

	const mapStateToProps = (state) =>
	{
		return {
			isModerator   : hasPermission(state),
			participants  : participantListSelector(state),
			spotlights    : state.room.spotlights,
			selectedPeers : state.room.selectedPeers
		};
	};

	return mapStateToProps;
};

const ParticipantListContainer = connect(
	makeMapStateToProps,
	null,
	null,
	{
		areStatesEqual : (next, prev) =>
		{
			return (
				prev.room.spotlights === next.room.spotlights &&
				prev.room.selectedPeers === next.room.selectedPeers &&
				prev.me.roles === next.me.roles &&
				prev.peers === next.peers
			);
		}
	}
)(withStyles(styles)(ParticipantList));

export default ParticipantListContainer;
