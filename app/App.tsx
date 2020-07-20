import React, { FunctionComponent } from 'react';
import { View, Text, TextInput } from 'react-native';

import { KeyboardAware } from './KeyboardAware';

export const App: FunctionComponent = (props) => {
	return (
		<View style={{ top: 150 }}>
			<View>
				<KeyboardAware />
			</View>
			<Text>Here is some text.</Text>
			<TextInput style={{ height: 40, borderColor: 'gray', borderWidth: 1 }} />
		</View>
	);
};
