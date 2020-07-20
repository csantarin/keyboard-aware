import React, { Component, FunctionComponent } from 'react';
import { EmitterSubscription, Keyboard, View } from 'react-native';
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

// export interface KeyboardAwareProps {

// }

// export interface KeyboardAwareState {
// 	keyboardShown: boolean;
// }

// export class KeyboardAware extends Component<KeyboardAwareProps, KeyboardAwareState> {
// 	state: KeyboardAwareState = {
// 		keyboardShown: false,
// 	};

// 	showHandler?: EmitterSubscription;
// 	hideHandler?: EmitterSubscription;

// 	componentDidMount() {
// 		this.showHandler = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
// 		this.hideHandler = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
// 	}

// 	componentWillUnmount() {
// 		this.showHandler && this.showHandler.remove();
// 		this.hideHandler && this.hideHandler.remove();
// 	}

// 	handleKeyboardDidShow = () => {
// 		this.setState({
// 			keyboardShown: true,
// 		});
// 	};

// 	handleKeyboardDidHide = () => {
// 		this.setState({
// 			keyboardShown: false,
// 		});
// 	};

// 	render() {
// 		const { keyboardShown } = this.state;

// 		if (!keyboardShown) {
// 			return (
// 				<View />
// 			);
// 		}

// 		return (
// 			<KeyboardAwareWarning />
// 		);
// 	}
// }
