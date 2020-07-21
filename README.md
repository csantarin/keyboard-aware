# keyboard-aware

A prepared sandbox for writing keyboard-awareness visbility state management in React Native **v0.63.0** using function components and Hooks.

## Setup

1. Clone the repository

```
git clone https://github.com/csantarin/keyboard-aware.git
cd keyboard-aware
```

2. Install its dependencies.

```sh
yarn
```

3. Install a preferred debugging utility:
	- [Chrome Developer Tools](https://developers.google.com/web/tools/chrome-devtools) (for simple console logs only).
	- [React Developer Tools](https://reactnative.dev/docs/debugging#react-developer-tools) from the official React Native docs.
	- [React Native Debugger](https://github.com/jhen0409/react-native-debugger) **v0.11** or later.

4. Add the Android (root: [`/android`](./android)) and iOS (root: [`/ios`](./ios)) projects to Android Studio and Xcode, respectively. Additional troubleshootings:
	- **Xcode**: ["Failed to set plugin placeholders" when loading the iOS project into Xcode.](https://programmingwithswift.com/easily-fix-failed-to-set-plugin-placeholders-in-xcode/)

		1. Clean (`Shift+Cmd+K`) the project.
		2. On the Project navigator, choose **KeyboardAware**. You will see a panel with tabs such as Info, Build Settings, Swift Packages.
		3. On the same screen, choose **Targets** > **KeyboardAware**. You will see a panel with tabs starting with General, Capabilities, Resource Tags, etc.
		4. On those tabs, choose **Build Phases**. You will see a list of dropdowns on the panel.
		5. On those dropdowns, choose **Embed App Extensions** to open it.
		6. Under the Embed App Extensions dropdown, check **Copy only when installing**.

	- **Android Studio**: No known issues yet.


## Running

1. Spin up the bundler.

```sh
yarn start
```

2. Hook up to an Android or iOS emulator.

3. Debug on your preferred utility. On Chrome Developer Tools, check the console out at http://localhost:8081/debugger-ui.

## Testing

To see the automated tests:

```sh
yarn test
```

>**Note:** Additional test cases are encouraged. Please create your pull request to offer suggestions.
