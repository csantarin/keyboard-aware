import React, { useEffect } from 'react';
import { Keyboard, View } from 'react-native';

export const MyComponent = () => {
    useEffect(() => {
        const listener = Keyboard.addListener('keyboardDidHide', () => {});

        return () => {
            listener.remove();
        };
    }, []);

    return (
		<View>...</View>
	);
};
