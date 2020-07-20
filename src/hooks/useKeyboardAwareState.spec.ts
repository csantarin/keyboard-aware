import { renderHook, act } from '@testing-library/react-hooks';
import { Key, useState } from 'react';
import { Keyboard, KeyboardEventName } from 'react-native';
import { useKeyboardAwareState } from './useKeyboardAwareState';

const setUpRenderedHook = (when?: 'will' | 'did', initialValue?: boolean) => renderHook(() => useKeyboardAwareState(initialValue, {
	when: when,
	onShow(event, setKeyboardShown) {
		setKeyboardShown(true);
	},
	onHide(event, setKeyboardShown) {
		setKeyboardShown(false);
	},
}));

describe('useKeyboardAwareState', () => {
	it('should be initializable', () => {
		const testFalseInitial = () => {
			const initialFalseRenderedHook = setUpRenderedHook('did', false);
			expect(initialFalseRenderedHook.result.current[0]).toEqual(false);
		};
		testFalseInitial();

		const testTrueInitial = () => {
			const initialTrueRenderedHook = setUpRenderedHook('did', true);
			expect(initialTrueRenderedHook.result.current[0]).toEqual(true);
		};
		testTrueInitial();
	});

	it('should be able to set values imperatively', () => {
		const renderedHook = setUpRenderedHook('did', false);

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
			const didEventRenderedHook = setUpRenderedHook('did', false);

			act(() => Keyboard.emit('keyboardDidShow' as KeyboardEventName));
			expect(didEventRenderedHook.result.current[0]).toEqual(true);

			act(() => Keyboard.emit('keyboardDidHide' as KeyboardEventName));
			expect(didEventRenderedHook.result.current[0]).toEqual(false);
		};
		testDidEvent();

		const testWillEvent = () => {
			const willEventRenderedHook = setUpRenderedHook('will', false);

			act(() => Keyboard.emit('keyboardWillShow' as KeyboardEventName));
			expect(willEventRenderedHook.result.current[0]).toEqual(true);

			act(() => Keyboard.emit('keyboardWillHide' as KeyboardEventName));
			expect(willEventRenderedHook.result.current[0]).toEqual(false);	
		};
		testWillEvent();
	});

	it('should handle only emitted events it was bound to', () => {
		const renderedHook = setUpRenderedHook('did', false);

		act(() => Keyboard.emit('keyboardWillShow' as KeyboardEventName));
		expect(renderedHook.result.current[0]).toEqual(false);

		act(() => Keyboard.emit('keyboardWillHide' as KeyboardEventName));
		expect(renderedHook.result.current[0]).toEqual(false);
	});

	it('should not handle emitted events when its holding component has been unmounted', () => {
		const renderedHook = setUpRenderedHook('did', false);

		// Unmount the hook's holding component to deregister the listeners.
		renderedHook.unmount();

		act(() => Keyboard.emit('keyboardDidShow' as KeyboardEventName));
		expect(renderedHook.result.current[0]).toEqual(false);

		act(() => Keyboard.emit('keyboardDidHide' as KeyboardEventName));
		expect(renderedHook.result.current[0]).toEqual(false);
	});

	it('should update its callback when its holding component\'s props and state has changed', () => {
		class SideEffect {
			value: number = 0;

			setValue(value: number) {
				this.value = value;
			}

			getValue() {
				return this.value;
			}
		}

		const sideEffect = new SideEffect();

		const renderedHook = renderHook((props) => {
			const [ count, setCount ] = useState(0);
			const [ keyboardShown, setKeyboardShown ] = useKeyboardAwareState(false, {
				when: 'did',
				onShow(event, setKeyboardShown) {
					// `count` refers to count returned from useState. Normally, it's supposed to be a dependency.
					setCount(count + 1);
					setKeyboardShown(true);
					sideEffect.setValue(props.value);
				},
				onHide(event, setKeyboardShown) {
					// `count` refers to count returned from useState. Normally, it's supposed to be a dependency.
					setCount(count + 1);
					setKeyboardShown(false);
					sideEffect.setValue(props.value);
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
		expect(sideEffect.getValue()).toStrictEqual(0);

		renderedHook.rerender({
			value: 2,
		});

		act(() => Keyboard.emit('keyboardDidHide' as KeyboardEventName));
		expect(renderedHook.result.current.count).toStrictEqual(2);
		expect(sideEffect.getValue()).toStrictEqual(2);

		renderedHook.rerender({
			value: 4,
		});

		act(() => Keyboard.emit('keyboardDidShow' as KeyboardEventName));
		expect(renderedHook.result.current.count).toStrictEqual(3);
		expect(sideEffect.getValue()).toStrictEqual(4);

		renderedHook.rerender({
			value: 6,
		});

		act(() => Keyboard.emit('keyboardDidHide' as KeyboardEventName));
		expect(renderedHook.result.current.count).toStrictEqual(4);
		expect(sideEffect.getValue()).toStrictEqual(6);

		sideEffect.setValue(8);

		// The value of sideEffect.value should still be `6`
		// since it's still not passed to props at this time.
		act(() => Keyboard.emit('keyboardDidShow' as KeyboardEventName));
		expect(renderedHook.result.current.count).toStrictEqual(5);
		expect(sideEffect.getValue()).toStrictEqual(6);
	});
});
