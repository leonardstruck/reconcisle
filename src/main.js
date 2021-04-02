const {
	app,
	BrowserWindow,
	ipcMain,
	Menu,
	autoUpdater,
	dialog,
} = require("electron");
const { service } = require("./service");
const { fileStore } = require("./fileStore");
const log = require("electron-log");

const isDev = process.env.NODE_ENV === "development";

// log console to logfile
console.log = log.log;

console.log(isDev ? "Running in dev-mode" : "Running in production-mode");

//Updates
if (!isDev) {
	const server = "https://update-server-reconcisle.vercel.app";
	const feed = `${server}/update/${process.platform}/${app.getVersion()}`;

	autoUpdater.setFeedURL(feed);

	setInterval(() => {
		autoUpdater.checkForUpdates();
	}, 10 * 60 * 1000);

	autoUpdater.on("update-downloaded", (event, releaseNotes, releaseName) => {
		const dialogOpts = {
			type: "info",
			buttons: ["Restart", "Later"],
			title: "Application Update",
			message: process.platform === "win32" ? releaseNotes : releaseName,
			detail:
				"A new version has been downloaded. Restart the application to apply the updates.",
		};

		dialog.showMessageBox(dialogOpts).then((returnValue) => {
			if (returnValue.response === 0) autoUpdater.quitAndInstall();
		});
	});

	autoUpdater.on("error", (message) => {
		console.error("There was a problem updating the application");
		console.error(message);
	});

	autoUpdater.on("update-available", (message) => {
		console.log("Update available, downloading now");
	});
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
	// eslint-disable-line global-require
	app.quit();
}

const createWindow = () => {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 900,
		height: 800,
		show: false,
		backgroundColor: "#5C747A",
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
	});

	// and load the index.html of the app.
	mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
	// Open the DevTools.
	if (isDev) {
		mainWindow.webContents.openDevTools();
	}
	mainWindow.once("ready-to-show", () => {
		mainWindow.show();
	});
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

//Menu
const template = [
	{
		label: "Help",
		submenu: [
			{
				label: "Check for updates",
				click() {
					autoUpdater.checkForUpdates();
					new Notification({
						title: "🔎 Checking for updates",
						silent: true,
					}).show();

					autoUpdater.on("update-not-available", () => {
						new Notification({
							title: "No update available",
							silent: true,
						}).show();
					});
					autoUpdater.on("update-available", () => {
						new Notification({
							title: "New Update",
							body: "🎉 Update available. Downloading ⌛️",
							sound: "Breeze",
						}).show();
					});
				},
			},
		],
	},
];

if (process.platform == "darwin") {
	template.unshift({
		label: "reconcIsle",
		submenu: [
			{
				label: "About reconcIsle",
				role: "about",
			},
			{
				type: "separator",
			},
			{
				label: "Services",
				role: "services",
				submenu: [],
			},
			{
				type: "separator",
			},
			{
				label: "Hide reconcIsle",
				accelerator: "Command+H",
				role: "hide",
			},
			{
				label: "Hide Others",
				accelerator: "Command+Alt+H",
				role: "hideOthers",
			},
			{
				label: "Show All",
				role: "unhide",
			},
			{
				type: "separator",
			},
			{
				label: "Quit",
				accelerator: "Command+Q",
				click() {
					app.quit();
				},
			},
		],
	});
}

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.on("fileStore", (event, arg) => {
	const result = fileStore(arg.store, arg.method, arg.obj);
	event.reply(arg.reqId, result);
});

ipcMain.on("service", async (event, arg) => {
	const result = await service(arg.service, arg.method, arg.obj);
	event.reply(arg.reqId, result);
});
