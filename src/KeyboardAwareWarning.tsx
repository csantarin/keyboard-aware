import React, { FunctionComponent } from 'react';
import { Text, View } from 'react-native';

export const KeyboardAwareWarning: FunctionComponent = (props) => {
	return (
		<View style={{ top: 100 }}>
			<View>
				<Text>This is a Keyboard Aware Warning.</Text>
			</View>
		</View>
	);
};
