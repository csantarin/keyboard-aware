import { renderHook, act } from '@testing-library/react-hooks';
import { Keyboard } from 'react-native';
import { useKeyboardAwareState } from './useKeyboardAwareState';

test('Listens to the native keyboard show / hide events', () => {
	const renderedHook = renderHook(() => useKeyboardAwareState(false, {
		when: 'did',
		onShow(event, setKeyboardShown) {
			setKeyboardShown(true);
		},
		onHide(event, setKeyboardShown) {
			setKeyboardShown(false);
		},
	}));

	const { result } = renderedHook;
	expect(result.current[0]).toEqual(false);

	act(() => result.current[1]((value) => !value));
	expect(result.current[0]).toEqual(true);

	act(() => result.current[1]((value) => !value));
	expect(result.current[0]).toEqual(false);

	act(() => Keyboard.emit('keyboardDidShow'));
	expect(result.current[0]).toEqual(true);

	act(() => Keyboard.emit('keyboardDidHide'));
	expect(result.current[0]).toEqual(false);
});
