import React, { FunctionComponent } from 'react';
import { View } from 'react-native';
import { useKeyboardAwareState } from './hooks';
import { KeyboardAwareWarning } from './KeyboardAwareWarning';

export const KeyboardAware: FunctionComponent = (props) => {
	const [ keyboardShown ] = useKeyboardAwareState(false, {
		onShow(event, setKeyboardShown) {
			setKeyboardShown(true);
		},
		onHide(event, setKeyboardShown) {
			setKeyboardShown(false);
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
