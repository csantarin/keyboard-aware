import { useEffect, useRef, useState } from 'react';
import { Keyboard, KeyboardEventListener, KeyboardEventName } from 'react-native';

export interface KeyboardAwareStateOptions {
	/**
	 * Determines which events the handlers will be attached to. Defaults to `'did'` in `useKeyboardAwareState()`
	 *
	 * - `will` maps to `keyboardWill*` events. (**NOTE:** [Unavaialble in Android.](https://reactnative.dev/docs/keyboard#addlistener))
	 * - `did` maps to `keyboardDid*` events.
	 */
	when?: 'will' | 'did';
	/**
	 * Handles the `keyboardWillShow`/`keyboardDidShow` event. Provides the keyboard event object.
	 *
	 * @param {KeyboardEvent} event The React Native keyboard event object.
	 */
	onShow?: KeyboardEventListener;
	/**
	 * Handles the `keyboardWillHide`/`keyboardDidHide` event. Provides the keyboard event object.
	 *
	 * @param {KeyboardEvent} event The React Native keyboard event object.
	 */
	onHide?: KeyboardEventListener;
}

/**
 * Returns a stateful boolean value indicating the visibility of the native keyboard.
 * Attaches handlers to the native keyboard events upon component mount, which are deattached when the component unmounts.
 *
 * @param {KeyboardAwareStateOptions} options Listener options.
 */
export const useKeyboardAwareState = (options: KeyboardAwareStateOptions = {}) => {
	const {
		when = 'did',
		onShow = () => {},
		onHide = () => {},
	} = options;

	const SHOW_EVENT: KeyboardEventName = when === 'did' ? 'keyboardDidShow' : 'keyboardWillShow';
	const HIDE_EVENT: KeyboardEventName = when === 'did' ? 'keyboardDidHide' : 'keyboardWillHide';

	// Update the handler references upon every component update.
	// This allows this hook to invoke the newest iteration of the handler.
	const onShowRef = useRef(onShow);
	const onHideRef = useRef(onHide);
	onShowRef.current = onShow;
	onHideRef.current = onHide;

	const [ keyboardShown, setKeyboardShown ] = useState(false);

	// Handle the incoming event, regardless of whether or not a handler has been provided.
	const handleShow: KeyboardEventListener = (event) => {
		setKeyboardShown(state => !state);
		onShowRef.current(event);
	};
	const handleHide: KeyboardEventListener = (event) => {
		setKeyboardShown(state => !state);
		onHideRef.current(event);
	};

	// Do listener attach and detach during didMount and willUnmount only.
	useEffect(() => {
		const showEmitterSubscription = Keyboard.addListener(SHOW_EVENT, handleShow);
		const hideEmitterSubscription = Keyboard.addListener(HIDE_EVENT, handleHide);

		return () => {
			showEmitterSubscription.remove();
			hideEmitterSubscription.remove();
		};
	}, []);

	return [
		keyboardShown,
		setKeyboardShown,
	] as [
		boolean,
		typeof setKeyboardShown
	];
};

export default useKeyboardAwareState;
