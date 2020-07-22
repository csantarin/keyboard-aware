import { renderHook, act } from '@testing-library/react-hooks';
import { useState } from 'react';
import { Keyboard, KeyboardEvent, KeyboardEventName } from 'react-native';

import { useKeyboardAwareState } from './useKeyboardAwareState';

const setUpRenderedHook = (when?: 'will' | 'did') => renderHook(() => useKeyboardAwareState({
	when: when,
}));

describe('useKeyboardAwareState', () => {
	it('should be able to set values imperatively', () => {
		const renderedHook = setUpRenderedHook();

		const { result } = renderedHook;
		const { current } = result;
		const [ _, setKeyboardShown ] = current;

		act(() => setKeyboardShown((value) => !value));
		expect(result.current[0]).toEqual(true);

		act(() => setKeyboardShown((value) => !value));
		expect(result.current[0]).toEqual(false);
	});

	it('should handle emitted events when its holding component has been mounted', () => {
		const testDidEvent = () => {
			const didEventRenderedHook = setUpRenderedHook();

			act(() => Keyboard.emit('keyboardDidShow' as KeyboardEventName));
			expect(didEventRenderedHook.result.current[0]).toEqual(true);

			act(() => Keyboard.emit('keyboardDidHide' as KeyboardEventName));
			expect(didEventRenderedHook.result.current[0]).toEqual(false);
		};
		testDidEvent();

		const testWillEvent = () => {
			const willEventRenderedHook = setUpRenderedHook('will');

			act(() => Keyboard.emit('keyboardWillShow' as KeyboardEventName));
			expect(willEventRenderedHook.result.current[0]).toEqual(true);

			act(() => Keyboard.emit('keyboardWillHide' as KeyboardEventName));
			expect(willEventRenderedHook.result.current[0]).toEqual(false);	
		};
		testWillEvent();
	});

	it('should subscribe to the native keyboard events', () => {
		// Create mock listeners: https://stackoverflow.com/questions/52766963/mocking-monitoring-keyboard-events-with-jest-in-react-native
		// Spy on event to detect whether it has been called: https://github.com/facebook/jest/issues/9102
		// How to mock events in case this stops working: https://github.com/facebook/react-native/issues/26579
		const mockListener = {
			remove: jest.fn(),
		};
		const originalAddListener = Keyboard.addListener;
		const mockAddListener = jest.fn().mockReturnValue(mockListener);

		Keyboard.addListener = mockAddListener;

		const addListenerSpy = jest.spyOn<typeof Keyboard, keyof typeof Keyboard>(Keyboard, 'addListener');
		const removeListenerSpy = jest.spyOn(mockListener, 'remove');
		const renderedHook = setUpRenderedHook();

		expect(addListenerSpy).toHaveBeenCalled();

		renderedHook.unmount();

		expect(removeListenerSpy).toHaveBeenCalled();

		Keyboard.addListener = originalAddListener;
	});

	it('should handle only emitted events it was subscribed to', () => {
		const renderedHook = setUpRenderedHook();

		act(() => Keyboard.emit('keyboardWillShow' as KeyboardEventName));
		expect(renderedHook.result.current[0]).toEqual(false);

		act(() => Keyboard.emit('keyboardWillHide' as KeyboardEventName));
		expect(renderedHook.result.current[0]).toEqual(false);
	});

	it('should not handle emitted events when its holding component has been unmounted', () => {
		const renderedHook = setUpRenderedHook();

		// Unmount the hook's holding component to deregister the listeners.
		renderedHook.unmount();

		act(() => Keyboard.emit('keyboardDidShow' as KeyboardEventName));
		expect(renderedHook.result.current[0]).toEqual(false);

		act(() => Keyboard.emit('keyboardDidHide' as KeyboardEventName));
		expect(renderedHook.result.current[0]).toEqual(false);
	});

	it('should generate the event object in each event handler', () => {
		let event: Partial<KeyboardEvent> | undefined = undefined;

		const showEvent: KeyboardEvent = {
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
		const hideEvent: KeyboardEvent = {
			isEventFromThisApp: true,
			duration: 250,
			easing: 'keyboard',
			startCoordinates: {
				height: 336,
				screenX: 0,
				screenY: 476,
				width: 375,
			},
			endCoordinates: {
				height: 336,
				screenX: 0,
				screenY: 812,
				width: 375,
			},
		};

		renderHook(() => useKeyboardAwareState({
			onShow(e) {
				event = e;
			},
			onHide(e) {
				event = e;
			}
		}));

		expect(event).toBeUndefined();

		act(() => Keyboard.emit('keyboardDidShow' as KeyboardEventName, showEvent));
		expect(event).toBeDefined();
		expect(event!.endCoordinates!.screenY).toEqual(476);

		event = undefined;
		expect(event).toBeUndefined();

		act(() => Keyboard.emit('keyboardDidHide' as KeyboardEventName, hideEvent));
		expect(event).toBeDefined();
		expect(event!.endCoordinates!.screenY).toEqual(812);
	});

	it('should update its callback when its holding component\'s props and state has changed', () => {
		class SideEffect {
			value: number = 0;
			setValueWithIncrement(value: number, increment: number) {
				this.value = value + increment;
			}
		}
 
		const sideEffect = new SideEffect();
		const increment = 10;

		const renderedHook = renderHook((props) => {
			const [ count, setCount ] = useState(0);
			const [ keyboardShown, setKeyboardShown ] = useKeyboardAwareState({
				onShow() {
					// `count` refers to count returned from useState. Normally, it's supposed to be a dependency.
					setCount(count + 1);
					sideEffect.setValueWithIncrement(props.value, increment);
				},
				onHide() {
					// `count` refers to count returned from useState. Normally, it's supposed to be a dependency.
					setCount(count + 1);
					sideEffect.setValueWithIncrement(props.value, increment);
				},
			});

			return {
				count,
				setCount,
				keyboardShown,
				setKeyboardShown,
			};
		}, {
			initialProps: {
				value: 0,
			},
		});

		act(() => Keyboard.emit('keyboardDidShow' as KeyboardEventName));
		expect(renderedHook.result.current.count).toStrictEqual(1);
		expect(sideEffect.value).toStrictEqual(10);

		renderedHook.rerender({
			value: 2,
		});

		act(() => Keyboard.emit('keyboardDidHide' as KeyboardEventName));
		expect(renderedHook.result.current.count).toStrictEqual(2);
		expect(sideEffect.value).toStrictEqual(12);

		renderedHook.rerender({
			value: 4,
		});

		act(() => Keyboard.emit('keyboardDidShow' as KeyboardEventName));
		expect(renderedHook.result.current.count).toStrictEqual(3);
		expect(sideEffect.value).toStrictEqual(14);

		renderedHook.rerender({
			value: 6,
		});

		act(() => Keyboard.emit('keyboardDidHide' as KeyboardEventName));
		expect(renderedHook.result.current.count).toStrictEqual(4);
		expect(sideEffect.value).toStrictEqual(16);

		sideEffect.setValueWithIncrement(8, increment);

		// The value of sideEffect.value should still be `6`
		// since it's still not passed to props at this time.
		act(() => Keyboard.emit('keyboardDidShow' as KeyboardEventName));
		expect(renderedHook.result.current.count).toStrictEqual(5);
		expect(sideEffect.value).toStrictEqual(16);
	});
});
