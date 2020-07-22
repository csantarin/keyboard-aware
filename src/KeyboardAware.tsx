import React, { FunctionComponent } from 'react';
import { View } from 'react-native';
import { useKeyboardAwareState } from './hooks';
import { KeyboardAwareWarning } from './KeyboardAwareWarning';

export const KeyboardAware: FunctionComponent = (props) => {
	// onShow and onHide event objects should look like this:
	/**
	{
		isEventFromThisApp: true,
		duration: 250,
		easing: 'keyboard',
		startCoordinates: {
			height: 233,
			screenX: 0,
			screenY: 812,
			width: 375,
		},
		endCoordinates: {
			height: 336,
			screenX: 0,
			screenY: 476,
			width: 375,
		},
	};
	*/

	const [ keyboardShown, setKeyboardShown ] = useKeyboardAwareState({
		onShow(event) {
			console.log('onShow', event);
		},
		onHide(event) {
			console.log('onHide', event);
		},
	});

	if (!keyboardShown) {
		return (
			<View />
		);
	}

	return (
		<KeyboardAwareWarning />
	);
};
