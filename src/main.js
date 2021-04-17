const {
	app,
	BrowserWindow,
	ipcMain,
	session,
	Notification,
	Menu,
	autoUpdater,
	dialog,
} = require("electron");
const { fileStore } = require("./fileStore");
const Config = require("electron-config");
const config = new Config();
const log = require("electron-log");
const os = require("os");
const path = require("path");
const modules = require("./modules/modules.js").default;
import { Worker } from "worker_threads";
const Store = require("electron-store");
const open = require("open");

// install Extensions
const ReactDevTools = path.join(
	os.homedir(),
	"/Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.10.1_0"
);
const ReduxDevTools = path.join(
	os.homedir(),
	"/Library/Application Support/Google/Chrome/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/2.17.0_0"
);
const installExtensions = async () => {
	return Promise.all([
		session.defaultSession.loadExtension(ReactDevTools, {
			allowFileAccess: true,
		}),
		session.defaultSession.loadExtension(ReduxDevTools, {
			allowFileAccess: true,
		}),
	]);
};

const isDev = process.env.NODE_ENV === "development";

// log console to logfile
console.log = log.log;

console.log(isDev ? "Running in dev-mode" : "Running in production-mode");

console.log("User Data is saved in this location: ", app.getPath("userData"));

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
	const windowConfig = {
		width: 900,
		height: 800,
		show: false,
		backgroundColor: "#5C747A",
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			webSecurity: false,
		},
	};

	Object.assign(windowConfig, config.get("winBounds"));

	const mainWindow = new BrowserWindow(windowConfig);

	// and load the index.html of the app.
	mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
	// load dev tools
	if (isDev) {
		mainWindow.webContents.addListener("did-frame-finish-load", () => {
			mainWindow.webContents.openDevTools();
		});
	}
	// show window gracefully
	mainWindow.once("ready-to-show", () => {
		mainWindow.show();
	});

	mainWindow.webContents.on("new-window", function (event, url) {
		event.preventDefault();
		open(url);
	});

	mainWindow.on("close", () => {
		config.set("winBounds", mainWindow.getBounds());
	});
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
	if (isDev) {
		await installExtensions().then(() => {
			createWindow();
		}).catch(err => {
			console.log("couldn't load dev extensions. ", err);
			createWindow();
		});
	} else {
		createWindow();
	}
});

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
		label: "Edit",
		submenu: [
			{
				label: "Undo",
				accelerator: "CmdOrCtrl+Z",
				role: "undo",
			},
			{
				label: "Redo",
				accelerator: "Shift+CmdOrCtrl+Z",
				role: "redo",
			},
			{
				type: "separator",
			},
			{
				label: "Cut",
				accelerator: "CmdOrCtrl+X",
				role: "cut",
			},
			{
				label: "Copy",
				accelerator: "CmdOrCtrl+C",
				role: "copy",
			},
			{
				label: "Paste",
				accelerator: "CmdOrCtrl+V",
				role: "paste",
			},
			{
				label: "Select All",
				accelerator: "CmdOrCtrl+A",
				role: "selectall",
			},
		],
	},
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
	const result = fileStore(
		arg.store,
		arg.method,
		arg.obj,
		app.getPath("userData")
	);
	event.reply(arg.reqId, result);
});

// Module Service

ipcMain.on("service", (event, arg) => {
	const Modules = modules();
	const sourceModule = arg.sourceModule;

	const service = Modules.getService(sourceModule);
	service(arg.method, arg.obj).then((res) => {
		event.reply(arg.reqId, res);
	});
});

let reconciliationService;
const unpackedDir = isDev
	? path.resolve(__dirname, "rec")
	: path.resolve(
			app.getAppPath(),
			"..",
			"app.asar.unpacked/.webpack/main/rec/"
	  );

ipcMain.on("startReconciliationServer", (event, arg) => {
	const data = new Store({
		name: arg.projectName,
	});
	reconciliationService = new Worker(
		path.resolve(unpackedDir, "reconciliationService.js"),
		{
			workerData: {
				path: unpackedDir,
				port: arg.config.port || 1234,
				data: data.get("data"),
				SearchColumn: data.get("config.reconcParams.searchColumn"),
				IDColumn: data.get("config.reconcParams.idColumn"),
			},
		}
	);
	reconciliationService.on("exit", () => {
		console.log("Service Stopped");
	});
	event.reply(arg.reqId, { status: "ok" });
});

ipcMain.on("stopReconciliationServer", (event, arg) => {
	reconciliationService.terminate();
});
