import React from 'react';
import { connect } from 'react-redux';
import * as appPropTypes from '../appPropTypes';
import { withStyles } from '@material-ui/core/styles';
import * as roomActions from '../../actions/roomActions';
import * as settingsActions from '../../actions/settingsActions';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { useIntl, FormattedMessage } from 'react-intl';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import { withRoomContext } from '../../RoomContext';

const styles = (theme) =>
	({
		setting :
		{
			padding : theme.spacing(2)
		},
		formControl :
		{
			display : 'flex'
		},
		switchLabel : {
			justifyContent : 'space-between',
			flex           : 'auto',
			display        : 'flex',
			padding        : theme.spacing(1),
			marginRight    : 0
		}
	});

const AppearanceSettings = (props) =>
{
	const {
		room,
		settings,
		onTogglePermanentTopBar,
		onToggleHiddenControls,
		onToggleButtonControlBar,
		onToggleShowNotifications,
		onToggleDrawerOverlayed,
		handleChangeMode,
		classes
	} = props;

	const intl = useIntl();

	const modes = [ {
		value : 'democratic',
		label : intl.formatMessage({
			id             : 'label.democratic',
			defaultMessage : 'Democratic view'
		})
	}, {
		value : 'filmstrip',
		label : intl.formatMessage({
			id             : 'label.filmstrip',
			defaultMessage : 'Filmstrip view'
		})
	} ];

	return (
		<React.Fragment>
			<form className={classes.setting} autoComplete='off'>
				<FormControl className={classes.formControl}>
					<Select
						value={room.mode || ''}
						onChange={(event) =>
						{
							if (event.target.value)
								handleChangeMode(event.target.value);
						}}
						name={intl.formatMessage({
							id             : 'settings.layout',
							defaultMessage : 'Room layout'
						})}
						autoWidth
						className={classes.selectEmpty}
					>
						{ modes.map((mode, index) =>
						{
							return (
								<MenuItem key={index} value={mode.value}>
									{mode.label}
								</MenuItem>
							);
						})}
					</Select>
					<FormHelperText>
						<FormattedMessage
							id='settings.selectRoomLayout'
							defaultMessage='Select room layout'
						/>
					</FormHelperText>
				</FormControl>
			</form>
			{!window.config.hideUserSetting.permanentTopBar &&
				<FormControlLabel
					className={classnames(classes.setting, classes.switchLabel)}
					control={
						<Switch checked={settings.permanentTopBar} onChange={onTogglePermanentTopBar} value='permanentTopBar' />}
					labelPlacement='start'
					label={intl.formatMessage({
						id             : 'settings.permanentTopBar',
						defaultMessage : 'Permanent top bar'
					})}
				/>
			}
			{!window.config.hideUserSetting.hiddenControls &&
				<FormControlLabel
					className={classnames(classes.setting, classes.switchLabel)}
					control={<Switch checked={settings.hiddenControls} onChange={onToggleHiddenControls} value='hiddenControls' />}
					labelPlacement='start'
					label={intl.formatMessage({
						id             : 'settings.hiddenControls',
						defaultMessage : 'Hidden media controls'
					})}
				/>
			}
			{!window.config.hideUserSetting.buttonControlBar &&
				<FormControlLabel
					className={classnames(classes.setting, classes.switchLabel)}
					control={<Switch checked={settings.buttonControlBar} onChange={onToggleButtonControlBar} value='buttonControlBar' />}
					labelPlacement='start'
					label={intl.formatMessage({
						id             : 'settings.buttonControlBar',
						defaultMessage : 'Separate media controls'
					})}
				/>
			}
			{!window.config.hideUserSetting.drawerOverlayed &&
				<FormControlLabel
					className={classnames(classes.setting, classes.switchLabel)}
					control={<Switch checked={settings.drawerOverlayed} onChange={onToggleDrawerOverlayed} value='drawerOverlayed' />}
					labelPlacement='start'
					label={intl.formatMessage({
						id             : 'settings.drawerOverlayed',
						defaultMessage : 'Side drawer over content'
					})}
				/>
			}
			{!window.config.hideUserSetting.showNotifications &&
				<FormControlLabel
					className={classnames(classes.setting, classes.switchLabel)}
					control={<Switch checked={settings.showNotifications} onChange={onToggleShowNotifications} value='showNotifications' />}
					labelPlacement='start'
					label={intl.formatMessage({
						id             : 'settings.showNotifications',
						defaultMessage : 'Show notifications'
					})}
				/>
			}
		</React.Fragment>
	);
};

AppearanceSettings.propTypes =
{
	roomClient          				  : PropTypes.any.isRequired,
	isMobile                  : PropTypes.bool.isRequired,
	room                      : appPropTypes.Room.isRequired,
	settings                  : PropTypes.object.isRequired,
	onTogglePermanentTopBar   : PropTypes.func.isRequired,
	onToggleHiddenControls    : PropTypes.func.isRequired,
	onToggleButtonControlBar  : PropTypes.func.isRequired,
	onToggleShowNotifications : PropTypes.func.isRequired,
	onToggleDrawerOverlayed   : PropTypes.func.isRequired,
	onToggleMirrorOwnVideo    : PropTypes.func.isRequired,
	handleChangeMode          : PropTypes.func.isRequired,
	handleChangeAspectRatio   : PropTypes.func.isRequired,
	classes                   : PropTypes.object.isRequired,
	intl                      : PropTypes.object.isRequired,
	locale                    : PropTypes.object.isRequired,
	localesList               : PropTypes.object.isRequired
};

const mapStateToProps = (state) =>
	({
		isMobile   	: state.me.browser.platform === 'mobile',
		room        : state.room,
		settings    : state.settings,
		locale      : state.intl.locale,
		localesList : state.intl.list
	});

const mapDispatchToProps = {
	onTogglePermanentTopBar   : settingsActions.togglePermanentTopBar,
	onToggleHiddenControls    : settingsActions.toggleHiddenControls,
	onToggleShowNotifications : settingsActions.toggleShowNotifications,
	onToggleButtonControlBar  : settingsActions.toggleButtonControlBar,
	onToggleDrawerOverlayed   : settingsActions.toggleDrawerOverlayed,
	onToggleMirrorOwnVideo    : settingsActions.toggleMirrorOwnVideo,
	handleChangeMode          : roomActions.setDisplayMode,
	handleChangeAspectRatio   : settingsActions.setAspectRatio
};

export default withRoomContext(connect(
	mapStateToProps,
	mapDispatchToProps,
	null,
	{
		areStatesEqual : (next, prev) =>
		{
			return (
				prev.me.browser === next.me.browser &&
				prev.room === next.room &&
				prev.settings === next.settings &&
				prev.intl.locale === next.intl.locale &&
				prev.intl.localesList === next.intl.localesList
			);
		}
	}
)(withStyles(styles)(AppearanceSettings)));