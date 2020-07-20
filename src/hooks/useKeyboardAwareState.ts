import { useEffect, useRef, useState, Dispatch, SetStateAction } from 'react';
import { Keyboard, KeyboardEvent, KeyboardEventListener, KeyboardEventName } from 'react-native';

export interface KeyboardAwareStateOptions {
	/**
	 * Determines which events the handlers will be attached to.
	 *
	 * - `will` maps to `keyboardWill*` events.
	 * - `did` maps to `keyboardDid*` events.
	 */
	when?: 'will' | 'did';
	/**
	 * Handles the `keyboardWillShow`/`keyboardDidShow` event. Provides the keyboard event object and the state dispatcher which allows the callback to update the state.
	 *
	 * @param {KeyboardEvent} event The React Native keyboard event object.
	 * @param {Dispatch<SetStateAction<boolean>>} setKeyboardShown The React state dispatcher which updates the keyboardShown state variable. Invoke the dispatcher to explicitly update the state.
	 */
	onShow?: (event: KeyboardEvent, setKeyboardShown: Dispatch<SetStateAction<boolean>>) => void;
	/**
	 * Handles the `keyboardWillHide`/`keyboardDidHide` event. Provides the keyboard event object and the state dispatcher which allows the callback to update the state.
	 *
	 * @param {KeyboardEvent} event The React Native keyboard event object.
	 * @param {Dispatch<SetStateAction<boolean>>} setKeyboardShown The React state dispatcher which updates the keyboardShown state variable. Invoke the dispatcher to explicitly update the state.
	 */
	onHide?: (event: KeyboardEvent, setKeyboardShown: Dispatch<SetStateAction<boolean>>) => void;
}

/**
 * Returns a stateful boolean value indicating the visibility of the native keyboard, and a function to update it.
 * Attaches handlers to the native keyboard event upon component mount, which are deattached when the component unmounts.
 *
 * @param {boolean} [intialState=false] Starting value.
 * @param {KeyboardAwareStateOptions} options Listener options.
 */
export const useKeyboardAwareState = (intialState: boolean = false, options: KeyboardAwareStateOptions = {}) => {
	const {
		when = 'did',
		onShow,
		onHide,
	} = options;

	const SHOW_EVENT: KeyboardEventName = when === 'did' ? 'keyboardDidShow' : 'keyboardWillShow';
	const HIDE_EVENT: KeyboardEventName = when === 'did' ? 'keyboardDidHide' : 'keyboardWillHide';

	// Update the handler references upon every component update.
	// This allows this hook to invoke the newest iteration of the handler.
	const onShowRef = useRef(onShow);
	const onHideRef = useRef(onHide);
	onShowRef.current = onShow;
	onHideRef.current = onHide;

	const [ keyboardShown, setKeyboardShown ] = useState(intialState);

	// Offer a utility function to perform a simple boolean flip.
	const toggleKeyboardShown = () => {
		setKeyboardShown(state => !state);
	};

	// Handle the incoming event, regardless of whether or not a handler has been provided.
	const handleShow: KeyboardEventListener = (event) => {
		if (!onShowRef.current) {
			return;
		}

		onShowRef.current(event, setKeyboardShown);
	};
	const handleHide: KeyboardEventListener = (event) => {
		if (!onHideRef.current) {
			return;
		}

		onHideRef.current(event, setKeyboardShown);
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
		toggleKeyboardShown,
	] as [
		boolean,
		Dispatch<SetStateAction<boolean>>,
		() => void,
	];
};
