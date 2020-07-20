import React, { Component } from 'react';
import { EmitterSubscription, Keyboard, View } from 'react-native';
import { KeyboardAwareWarning } from './KeyboardAwareWarning';

export interface KeyboardAwareProps {

}

export interface KeyboardAwareState {
	keyboardShown: boolean;
}

export class KeyboardAware extends Component<KeyboardAwareProps, KeyboardAwareState> {
	state: KeyboardAwareState = {
		keyboardShown: false,
	};

	showHandler?: EmitterSubscription;
	hideHandler?: EmitterSubscription;

	componentDidMount() {
		this.showHandler = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
		this.hideHandler = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
	}

	componentWillUnmount() {
		this.showHandler && this.showHandler.remove();
		this.hideHandler && this.hideHandler.remove();
	}

	handleKeyboardDidShow = () => {
		this.setState({
			keyboardShown: true,
		});
	};

	handleKeyboardDidHide = () => {
		this.setState({
			keyboardShown: false,
		});
	};

	render() {
		const { keyboardShown } = this.state;

		if (!keyboardShown) {
			return (
				<View />
			);
		}

		return (
			<KeyboardAwareWarning />
		);
	}
}
