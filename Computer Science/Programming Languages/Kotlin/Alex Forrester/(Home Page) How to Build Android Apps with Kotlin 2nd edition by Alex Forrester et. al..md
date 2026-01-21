---
Source:
  - zotero://open-pdf/library/items/QG2Z93CB?page=2&annotation=TYYSQ9SW
Length: "704"
tags:
  - status/incomplete
  - type/textbook
Year: 2023-05-02
Supplement: https://github.com/PacktPublishing/How-to-Build-Android-Apps-with-Kotlin-Second-Edition
Reviewed: false
---
## Contributors
### Authors
- [[Alex Forrester]]
	- Software developer of 20 years for
		- Mobile development
		- Web development
		- content management systems
	- Built flagship apps for blue-chip companies such as
		- Sky
		- The Automobile Association
		- HSBC
		- Discover Channel
		- O2
		- #question what is meant by flagship apps
		- #question what are these companies known for? 
- [[Eran Boudjnah]]
	- Developer with 20 years of experience
		- Desktop applications
		- Websites
		- Interactive attractions
		- mobile applications
- [[Alexandru Dumbravan]]
	- Android developer with more than 10 years experience
		- Focused on fintech applications
			- #question what are fintech applications?
- [[Jomar Tigcal]]
	- Android developer with over 14 years of experience
		- Mobile development
		- Software development
### Reviewers
- [[Ed Holloway-George]]
	- Android developer and Google Developer Expert from Oxford, England
	- Android developer for over 10 years
	- Worked on well-known applications such as
		- National Trust
		- My Oxfam
		- Snoop
		- Carling Tap
- [[Guruprasad Bagade]]
	- Over a decade of experience in mobile and software development
	- Worked in banking domain for Barclays and Jp Morgan clients
		- #question what is the banking domain?
	- Has published technical research papers at the [[IEEE|Institute of Electrical and Electronics Engineers]]
	- Contributes to open source projects
	- Keeps up with latest technologies for spare time
## Preface
- “[[Android]] has ruled the app market for the past decade, and developers are increasingly looking to start building their own Android apps” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=16&annotation=GDXJYGTE))
- Will learn 
	- Android Studio
	- [[integrated development environments|integrated development environment]] for Android
	- [[Kotlin]] programming language for app development
- Will learn how to create apps and run them on virtual devices
- “structuring an app to building out the UI with activities, fragments, and various navigation patterns.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=16&annotation=TWVSY63G))
- “Android's [[RecyclerView]] to make the most of displaying lists of data” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=16&annotation=LGNXYBT5))
- “fetching data from a web service and handling images.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=16&annotation=FB5SZV4Z))
- “mapping, location services, and the permissions model before working with notifications and how to persist data.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=16&annotation=DRH4VUKS))
- “build user interfaces using [[Jetpack Compose]].” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=16&annotation=XKPG2EVG))
- “[[test pyramid]]” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=16&annotation=G7BC4WKR))
- “[[Android Architecture Components]] (AAC) is used to cleanly structure your code and explore various architecture patterns and the benefits of [[dependency injection]].” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=16&annotation=U9NGEQYN))
- “[[Coroutines]] and the [[Flow API]] are covered for [[asynchronous programming]].” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=16&annotation=TEX4F66S))
- In the [[user interface|UI]], will learn
	- “how to add motion and transitions when users interact with your apps” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=16&annotation=6RF4SR8G))
- End goal
	- “retrieve and display popular movies from a movie database, and then see how to publish your apps on Google Play.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=16&annotation=87PTUDUN))

### Get the most out of book
- Minimum hardware requirements
	- Processor: Intel Core i5 or higher
	- Memory: 8GB Ram or more
	- Storage: 8 GB available space minimum
- Software requirements
	- OS 64-bit Windows, macOS, or 64-bit Linux
	- [[Android Studio Electric Eel]] or higher
		- This is the software we will be using throughout the chapters
		- #question what is it exactly though?
- Don't need to send usage statistics to Google
- Click "standard" to install the recommended settings
- Select UI Theme to either Light or Darcula (dark theme)
- Example code files can be downloaded here:
	- https://github.com/PacktPublishing/How-to-Build-Android-Apps-with-Kotlin-Second-Edition
	- Can also use this for more information
		- https://github.com/PacktPublishing/ #resource
- Colored images can be found here (not needed for my pdf)
	- https://static.packt-cdn.com/downloads/9781837634934_ColorImages.pdf
- Bolded lines in a code block is where we want our particular attention to be drawn to

### Installation and setup
- Download Android Studio from https://developer.android.com/studio

### Get in touch
- “If you are interested in becoming an author: If there is a topic that you have expertise in and you are interested in either writing or contributing to a book, please visit authors.packtpub.com.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=24&annotation=WNJDTQZI))
- With every Packt book, you get a DRM-free PDF version of the book at no cost
	- #question what does DRM-free PDF mean? 

## Part 1: Android Foundation
- [[Android Studio]]
	- The integrated development environment (IDE) used for android development
- Teaches the Android framework. Will work through guided exercises
### (1) Creating Your First App
- Description
	- Use android studio to build first app
	- Learn to build and deploy virtual device
	- Will learn structure of android app
- Will learn the importance of [[AndroidManifest.xml]] file
- “Gradle build tool to configure your app and implement [[user interface]] (UI) elements from Material Design.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=28&annotation=8NTFMCTV))
	- #question what is material design
	- #question what is the gradle build tool?
- “[[Android]] is the most widely used mobile phone operating system in the world, with over three billion active devices.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=28&annotation=6EDGQKX9))
- “[[Android Studio]] provides all the tooling for application development but not the knowledge.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=28&annotation=YSBYFW8L))
- Topics covered in this chapter
	- Creating an Android project with Android Studio
	- Setting up a virtual device and running your app
	- The Android Manifest
	- Using Gradle to build, configure, and manage app dependencies
	- Android application structure
#### (1.1) Technical requirements
- Complete code can be found within supplement given above
#### (1.2) Creating an Android project with Android Studio
- Become confident with [[Android Studio]]
	- “This is the official integrated development environment ([[integrated development environments|IDE]]) for [[Android development]], built on [[JetBrains]]' [[IntelliJ IDEA IDE]] and developed by the Android Studio team at [[Google]].” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=29&annotation=5E39ZTEK))
- “development of Android Studio has followed the development of the IntelliJ IDEA IDE.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=29&annotation=24LDW8VL))
	- IDE enables you to optimize code through suggestions, shortcuts, and standard refactoring
- Will use [[Kotlin]]. Previous standard language for Android apps was [[Java]]
	- “Since [[Google]] I/O 2017 (the annual Google developer conference), this has been Google's preferred language for Android app development.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=29&annotation=NHCGGJGI))
	- [[Kotlin]] created by [[JetBrains]] (company that created [[IntelliJ IDEA]], the software Android Studio is built on.)
		- Therefore, you will get established and evolving first-class support for Kotlin
- Kotlin was created to address shortcomings of Java in terms of verbosity, handling null types, and adding more functional programming techniques
##### (1.2.1) Exercise 1.01 - creating an Android Studio project for your app
- Will use the template-drive approach
- Select "Create New Project"
- “The word displayed in most of the project types is [[Activity]].” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=30&annotation=YSB36JY5))
	- “In Android, an Activity is a page or screen. The options you can choose from all create this initial screen differently.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=30&annotation=DPSGMMNB))
- Select "Empty Activity" from the template
- Options
	- Name: Will be name of your project, app, and on Google Play
	- Package name
		- “This uses the standard reverse domain name pattern to create a name” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=31&annotation=B99JZD44))
		- “address identifier for source code and assets in your app.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=31&annotation=7LPF97HI))
		- Make name as clear and descriptive and as closely aligned with the purpose of your app as possible
			- Best to change this to use one or more sub-domains
				- “`com.sample.shop.myshop`)” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=31&annotation=GN3GPSH3))
		- “Name value of the app (in lowercase with spaces removed) is appended to the domain.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=31&annotation=A2CJNLDD))
	- Save Location
	- Language: Use Kotlin
	- Minimum SDK
		- There is a "Help Me Choose" link “to a dialog that explains the feature set that you have access to with a view to development on different versions of Android and the current percentage of devices worldwide running each Android version.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=32&annotation=QJETJLGJ))
	- Use legacy android.support libraries:
		- Leave unchecked. Will be using [[AndroidX libraries]]
			- “replacement for the support libraries that were designed to make features on newer versions of Android backward compatible with older versions” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=32&annotation=IJJBQCKJ))
			- Also contains new android components like [[Jetpack]]
				- “boosts your Android development and provide a host of rich features you will want to use in your app, thereby simplifying common operations.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=32&annotation=6X2PMRWC))
	- We see the activity `MainActivity` created and the layout used for the screen in the other tab `activity_main.xml`. Application structure folders are in left panel
	- “This [[template-driven approach]] has shown you the core options you need to configure for your app.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=33&annotation=9KW6Y4IR))
	- In next section, will set up virtual device and see app run for first time
#### (1.3) Setting up a virtual device and running your app
- You already downloaded the latest Android [[software development kit]] (SDK) components
	- These included a [[base emulator]] which will be configured to create a [[virtual device]] to run Android apps on
- “An [[emulator]] mimics the hardware and software features and configuration of a real device.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=33&annotation=MH8V5IKZ))
	- “benefit is that you can make changes and quickly see them on your desktop while developing your app.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=33&annotation=VMIX7YCD))
	- Virtual devices typically do not have all the features of a real device
	- “feedback cycle is often quicker than going through the steps of connecting a real device.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=33&annotation=WTIQE2SH))
- You can standardize your app by targeting a specific device by downloading a [[device profile]] (“even if you don't have a real device if this is a requirement of your project.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=33&annotation=9J58JVAH)))
- Let's take a look at the SDK components that are installed and how the virtual device fits in
	- [[Android Emulator]]: “This is the base emulator, which we will configure to create virtual devices of different Android makes and models.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=34&annotation=R94IRGSL))
	- [[Android SDK Build-Tools]]: “Android Studio uses the build tools to build your app. This process involves compiling, linking, and packaging your app to prepare it for installation on a device.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=34&annotation=US7Y7UAR))
	- [[Android SDK Platform]]: “This is the version of the Android platform that you will use to develop your app. The platform refers to the API level.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=34&annotation=K7RVASXV))
	- [[Android SDK Platform-Tools]]: “These are tools you can use, ordinarily, from the command line, to interact with and debug your app.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=34&annotation=RHT6L76S))
	- [[Android SDK Tools]]: “In contrast to the platform tools, these are tools that you use predominantly from within Android Studio in order to accomplish certain tasks, such as the virtual device for running apps and the SDK manager to download and install platforms and other components of the SDK.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=34&annotation=PX7HHNVJ))
	- [[Intel x86 Emulator Accelerator (HAXM installer)]]: “If your OS provides it, this is a feature at the hardware level of your computer you will be prompted to enable, which allows your emulator to run more quickly.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=34&annotation=AZ44YQZS))
	- [[SDK Patch Applier v4]]: “As newer versions of Android Studio become available, this enables patches to be applied to update the version you are running.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=34&annotation=ZT72SIL2))
##### (1.3.1) Exercise 1.02 - setting up a virtual device and running your app on it
- It is possible to run app on real device but will be using a virtual device in this exercise
- “should ensure you run your app on multiple devices to verify that its look and behavior are consistent.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=34&annotation=R7FX94ZD))
- “app is the configuration of the app that we will run. As we haven't set up a virtual device yet, it says No devices.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=35&annotation=V92L4URP))
- Go to `tools` $\to$ `device manager
- ![[Screenshot 2024-10-01 at 12.08.13 PM.png]]
	- Use this to create a virtual device
- “The real (non-virtual device) Pixel range of devices is developed by Google and has access to the most up-to-date versions of the Android platform.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=36&annotation=L4I6IWS2))
	- So we will use the [[pixel 6]] device
- ![[Screenshot 2024-10-01 at 12.10.09 PM.png]]
	- “The [[Tiramisu]] name displayed here is the initial code/release name for [[Android 13]].” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=37&annotation=DXWVBW24))
		- “Select the latest [[system image]] available” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=37&annotation=4UDF69GZ))
		- “The Target column might also show (Google Play) or (Google APIs) in the name. [[Google APIs]] mean that the system image comes pre-installed with [[Google Play Services]].” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=37&annotation=TUMNVW5K))
		- I set up the Pixel 6 API 33
- “On first running the app, you will see apps such as Maps and Chrome instead of a plain emulator image.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=37&annotation=8UAFM32A))
- “A [[Google Play system image]] means that, in addition to the Google APIs, the [[Google Play app]] will also be installed.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=37&annotation=5LCJJTBM))
- Should develop app with latest version of Android platform to benefit from latest features
	- Click the download link next to the latest `Release Name` and then select `Next` to see the virtual device you have set up.
- [[Android Virtual Device]] (AVD)
- When selecting "Finish", now setup the device to Pixel 6 and press the play arrow under the `Actions` column to run the virtual device. Below is the result for me
	- ![[Screenshot 2024-10-01 at 12.20.51 PM.png]]
		- Says my Gradle build finished in 1 minute 34 seconds
- “You will then see the virtual device running within Android Studio in the [[Emulator]] tool window.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=40&annotation=M2KVTFNQ))
- To run your app, press the green button below or "Control + R"
	- ![[Screenshot 2024-10-01 at 12.21.56 PM.png]]
	- The result is just a "Hello World" at the top left of the screen
- “The [[Android Virtual Device Manager]], which you have used to do this, enables you to create the device (or range of devices) you would like to target your app for.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=41&annotation=KH3GFL9J))
	- “allows a quick feedback cycle to verify how a new feature development behaves and that it displays the way you expect it to.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=41&annotation=4WB3AW26))
		- Ensures behavior and appearance
- “will explore the [[AndroidManifest.xml]] file of your project, which contains the information and configuration of your app.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=41&annotation=EDJ5C6BJ))
#### (1.4) The Android manifest
- “The app is driven from the AndroidManifest.xml file, a [[manifest file]] that details the contents of your app” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=41&annotation=YDK3U47T))
	- Located at `app|manifests|AndroidManifest.xml`
```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <application
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.MyApplication"
        tools:targetApi="31">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:label="@string/app_name"
            android:theme="@style/Theme.MyApplication">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />

                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
```
- This is identical to the one in the book
- “A typical [[manifest file]], in general terms, is a top-level file that describes the enclosed files or other data and associated metadata that forms a group or unit.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=42&annotation=743KBAN5))
	- “The [[Android manifest]] applies this concept to your Android app as an [[XML file]].” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=42&annotation=3DQ5H7Q8))
- “Every Android app has an application class that allows you to configure the app.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=42&annotation=SD8KD9UP))
- “After the `<application>` element opens, you define your app's components.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=42&annotation=7AQSG42D))
	- The [[application (element)|<application>]]
	- “only contains the first screen shown in the following code” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=42&annotation=IE6ZY7N3))
		- `<activity android:name=".MainActivity">`
	- The next child XML node specified is as follows
		- [[intent-filter (element)|<intent-filter>]]
			- “Android uses [[intents]] as a mechanism for interacting with apps and system components.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=42&annotation=V4328USG))
			- “Intents get sent, and the intent filter registers your app's capability to react to these intents.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=42&annotation=GZYEKEST))
		- `<action android:name="android.intent.action.MAIN" />`
			- This is the main entry point into your app.
			- Since it appears in the enclosing XML of `.MainActivity`, it specifies that this screen will be started when the app is launched.
		- `<category android:name="android.intent.category.LAUNCHER" />`
			- States that your app will appear in the launcher of your user's device
- “As you have created your app from a template, it has a basic manifest that will launch the app and display an initial screen at startup through an Activity component.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=42&annotation=U9WSSN2J))
	- Depending on features, may need to add permissions in Android manifest file
- “Permissions are grouped into three different categories: [[normal]], [[signature]], and [[dangerous]]:” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=42&annotation=F6QUC27L))
	- Normal: 
		- “These permissions include accessing the [[network state]], [[Wi-Fi]], the [[internet]], and [[Bluetooth]]. These are usually permitted without asking for the user's consent at runtime.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=42&annotation=P79GU6F9))
	- Signature:
		- “These permissions are shared by the same group of apps that must be signed with the same certificate. This means these apps can share data freely, but other apps can't get access.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=42&annotation=M2BAPM47))
	- Dangerous:
		- “These permissions are centered around the user and their privacy, such as sending SMS, access to accounts and location, and reading and writing to the filesystem and contacts.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=42&annotation=K5VLKVQP))
- “These permissions have to be listed in the manifest, and in the case of dangerous permissions, from Android Marshmallow API 23 (Android 6 Marshmallow) onward, you must also ask the user to grant the permissions at [[runtime]].” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=42&annotation=92EL3KF2))
- Deleted documentation of the [[Android Manifest]] can be found here
	- https://developer.android.com/guide/topics/manifest/manifest-intro
##### (1.4.1) Exercise 1.03 - Configuring the Android manifest internet permission
- “The key permission that most apps require is access to the internet.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=43&annotation=DJN46MFK))
	- Not added by default
	- Will fix that in this exercise and “load a [[WebView]], which enables the app to show web pages.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=43&annotation=BQVY4CD8))
		- #comment I think this is what apps like TikTok and reddit use so you can search the internet while within the app?
		- “use case is very common in Android app development as most commercial apps will display a privacy policy, terms and conditions, and so on.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=43&annotation=WEUQ59B4))
			- These documents usually are displayed by loading a web page
- Most commonly used displays of view window for Android Studio development is Project and Android
- Just open the `MainActivity.kt` class
```kotlin
package com.example.myapplication 

import androidx.appcompat.app.AppCompatActivity 
import android.os.Bundle 

class MainActivity : AppCompatActivity() { 
	override fun onCreate(savedInstanceState: Bundle?) 
	{ 
		super.onCreate(savedInstanceState) 
		setContentView(R.layout.activity_main) 
	}
}
```
- #comment My startup code is a little different
- “setContentView(R.layout.activity_main) statement sets the layout of the UI you saw when you first ran the app in the virtual device.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=44&annotation=DZUHU7UM))
```kotlin
package com.example.myapplication 

import androidx.appcompat.app.AppCompatActivity 
import android.os.Bundle 
import android.webkit.WebView 

class MainActivity : AppCompatActivity() { 
	override fun onCreate(savedInstanceState: Bundle?){ 
		super.onCreate(savedInstanceState) 
		val webView = WebView(this) 
		webView.settings.javaScriptEnabled = true 
		setContentView(webView) 
		webView.loadUrl("https://www.google.com") 
	}
}
```
- #comment
	- Seems to have added the `import android.webkit.WebView `
	- It appears that `AppCompatActivity()` was the default name but my code shows `ComponentActivity()`
	- I'm getting a warning for `webView.settings.javaScriptEnabled = true`
		- States that it can introduce [[XSS vulnerabilities]] in my application
- “So, you are replacing the layout file with WebView. The val keyword is a read-only property reference, which can't be changed once it has been set. JavaScript needs to be enabled in WebView to execute JavaScript.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=44&annotation=BM8LTMNW))
- Not setting type but [[Kotlin]] has [[type inference]], so will infer type if possible
	- “So, specifying the type explicitly with val webView: WebView = WebView(this) is not necessary.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=45&annotation=DAVF4LSW))
		- “Kotlin follows Pascal notation, that is, \[parameter] name followed by type.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=45&annotation=NY6PVUWY))
- ![[Screenshot 2024-10-01 at 1.21.27 PM.png]]
	- We get this error because there is no INTERNET permission added to your AndroidManifest.xml file.
		- “If you get the net::ERR_CLEARTEXT_NOT_PERMITTED error, this is because the URL you are loading into WebView is not [[HTTPS]], and non-HTTPS traffic is disabled from API level 28, Android 9.0 Pie and above).” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=46&annotation=HT9SATI7))
- Adding INTERNET permission to manifest
	- `<uses-permission android:name="android.permission.INTERNET"/>`
	- “can find the full Android manifest file with the permission added here: https:// packt.link/smzpl” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=46&annotation=V6GKE2FV))
- Uninstall the app from virtual device before running app again. do this because [[app permissions]] can sometimes get [[cache|cached]].
	- Uninstall it by either
		- long pressing $\to$ info $\to$ uninstall
		- dragging app icon to trash bin (upper right corner)
- ![[Screenshot 2024-10-01 at 1.26.58 PM.png|200]]
	- Now it's running correctly. The web page is now appearing in [[WebView]]
- Summary
	- Learned how to add a [[permission]] to the [[manifest]]
	- “The [[Android Manifest]] can be thought of as a table of contents of your app.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=47&annotation=64IIPWEU))
		- Lists all components and permissions your app uses
		- Provides entry points to app
	- Next section will explore the [[Android build system]], which uses the [[Gradle build tool]] to get you app running
#### (1.5) Using Gradle to build, configure, and manage app dependencies
- To create project, mainly used the [[Android platform SDK]]
- Necessary [[Android libraries]] downloaded when installed [[Android Studio]]
- To configure and build your Android project, a build tool called [[Gradle]] is used
	- “Gradle is a multi-purpose build tool that Android Studio uses to build your app.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=47&annotation=WRZZMMQT))
	- By default, Android Studio uses [[Groovy]], a dynamically typed [[Java virtual machine]] (JVM) language, to configure the build process and allows easy dependency management so you can add libraries to your project and specify the versions.
- [[Android Studio]] can also be configured to use Kotlin to configure builds
- The files that this build and configuration information is stored in are named [[build.gradle]]
	- There are two build.gradle files when creating app
		- root/top level of project
		- One specific to app in the app module folder
##### (1.5.1) The project-level build.gradle file
- Project-level build.gradle file
- Set up all the root project setting which can be applied to sub-modules/projects

My Version (found in `Gradle Scripts/build.gradle.kts (Project: My_Application)`)
```kotlin
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
}
```

Their Version
```kotlin
plugins { 
	id 'com.android.application' version '7.4.2' apply false 
	id 'com.android.library' version '7.4.2' apply false 
	id 'org.jetbrains.kotlin.android' version '1.8.0' apply false 
}
```
- [[Gradle]] works on a [[plugin system]] so you can write your own plugin that does a task or series of tasks and plug it into your [[build pipeline]]
	- [[com.android.application]]: “This adds support to create an Android application” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=48&annotation=2PPZCDTS))
	- [[com.android.library]]: “This enables sub-projects/modules to be Android libraries” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=48&annotation=I4QY2ZG3))
	- [[org.jetbrains.kotlin.android]]: “This provides integration and language support for Kotlin in the project” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=48&annotation=9JWSNKZC))
- The `apply false` statement enables these plugins only to sub-projects/modules, and not the project's root level. The version `7.3.1` specifies the plugin version, which is applied to all sub-projects/modules
##### (1.5.2) The app-level build.gradle file
- Found in `Gradle Scripts/build.gradle.kts (Module :app)`

My Version
```kotlin
plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
}

android {
    namespace = "com.example.myapplication"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.example.myapplication"
        minSdk = 21
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
    kotlinOptions {
        jvmTarget = "1.8"
    }
    buildFeatures {
        compose = true
    }
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.1"
    }
    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
}

dependencies {

    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.ui.graphics)
    implementation(libs.androidx.ui.tooling.preview)
    implementation(libs.androidx.material3)
    testImplementation(libs.junit)
    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)
    androidTestImplementation(platform(libs.androidx.compose.bom))
    androidTestImplementation(libs.androidx.ui.test.junit4)
    debugImplementation(libs.androidx.ui.tooling)
    debugImplementation(libs.androidx.ui.test.manifest)
}
```

Their version
```kotlin
plugins { 
	id 'com.android.application' 
	id 'org.jetbrains.kotlin.android' 
	} 
android { 
	namespace 'com.example.myapplication' 
	compileSdk 33 
	defaultConfig { 
		applicationId "com.example.myapplication" 
		minSdk 24 
		targetSdk 33 
		versionCode 1 
		versionName "1.0" 
		testInstrumentationRunner 
			"androidx.test.runner.AndroidJUnitRunner"} 
	buildTypes { 
		release { 
			minifyEnabled false 
			proguardFiles getDefaultProguardFile('proguardandroid-
			optimize.txt'), 'proguard-rules.pro' 
		} 
	}
	compileOptions { 
		sourceCompatibility JavaVersion.VERSION_1_8 
		targetCompatibility JavaVersion.VERSION_1_8 
	} 
	kotlinOptions { 
		jvmTarget = '1.8' 
	} 
} 
dependencies {...}		
```
- “The plugins for Android and Kotlin, detailed in the root build.gradle file, are applied to your project here by ID in the plugins lines.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=49&annotation=TYBM77QJ))
- “The android block, provided by the com.android.application plugin, is where you configure your Android-specific configuration settings:” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=49&annotation=95B7Z3PK))
	- [[namespace]]: Set from package name specified when creating project. Used for generating build and resource identifiers
	- [[compileSdk]]: Defines the API level the app has been compiled with, and the app can use the features of this API and lower
	- [[defaultConfig]]: base configuration of app
	- [[applicationId]]: Set to app's package and is the app identifier that is used on [[Google Play]] to uniquely identify your app. It can be changed to be different from the package name if required
	- [[minSdk]]: The minimum API level your app supports. This will filter out your app from being displayed in Google Play for devices that are lower than this
	- [[targetSdk]]: The API level you are targeting. This is the API level your built app is intended to work and has been tested with
	- [[versionCode]]: Specifies version code of your app. Every time an update needs to be made to the app, the version code needs to be increased by one or more
	- [[VersionName]]: A user-friendly version name that usually follows semantic versioning of X.Y.Z, where X is the major version, Y is the minor version, and Z is the patch version, for example, 1.0.3
	- [[testInstrumentationRunner]]: Test runner to use for you UI tests
	- [[buildTypes]]: Under buildTypes, a release is added that configures your app to create a release build. The [[minifyEnabled]] value, if set to true, will shrink your app size by removing any unused code, as well as [[obfuscating]] your app. This obfuscation step changes the name of the source code references to values such as a.b.c(). This makes your code less prone to [[reverse engineering]] and further reduces the size of the built app.
	- [[compileOptions]]: This is the language level of the Java source code ([[sourceCompatibility]]) and byte code ([[targetCompatibility]])
	- [[kotlinOptions]]: This is the jvm library the kotlin gradle plugin should use
- The dependencies block specifies the libraries your app uses no top of the Android platform SDK
```kotlin
dependencies { 
// Kotlin extensions, jetpack component with Android Kotlin language features 
implementation 'androidx.core:core-ktx:1.7.0' 
// Provides backwards compatible support libraries and jetpack components 
implementation 'androidx.appcompat:appcompat:1.6.1' 
// Material design components to theme and style your app 
implementation 'com.google.android.material:material:1.8.0' 
// The ConstraintLayout ViewGroup updated separately from main Android sources 
implementation 'androidx.constraintlayout:constraintlayout:2.1.4' 
// Standard Test library for unit tests 
testImplementation 'junit:junit:4.13.2' 
// UI Test runner 
androidTestImplementation 'androidx.test.ext:junit:1.1.5' 
// Library for creating Android UI tests 
androidTestImplementation 'androidx.test.espresso:espresso-core:3.5.1' }
```
- Implementations
	- [[androidx.core]]: Kotlin extensions, jetpack component with Android Kotlin language features
	- [[androidx.appcompat]]: Provides backwards compatible support libraries and jetpack components
	- [[com.google.android.material]]: Material design components to theme and style your app
	- [[androidx.constraintlayout]]: The ConstraintLayout ViewGroup updated separately from main Android sources
	- [[junit]]: Standard test library for [[unit test|unit tests]]
	- [[androidx.test.ext]]: UI Test runner
	- [[androidx.test.espresso]]: Library for creating Android UI tests
- The dependencies follow the Maven [[Project Object Model]] (POM) convention of `groupId`, `artifactId`, and `versionId` separated by :. So, as an example, the compatible support library specified earlier is shown as
	- `androidx.appcompat:appcompat:1.6.1`
		- [[groupId]]: `androidx.appcompat`
		- [[artifactId]]: `appcompat`
		- [[versionId]]: `1.5.1`
- “The build system locates and downloads these dependencies to build the app from the `repositories` block detailed in the [[settings.gradle]] file explained in the following section.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=51&annotation=JC4IQPUA))
- “The [[implementation]] notation for adding these libraries means that their internal dependencies will not be exposed to your app, making compilation faster.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=51&annotation=9J43H4L6))
- “the [[androidx]] components are added as dependencies rather than in the Android platform source.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=51&annotation=JRMWMSRF)) 
	- “This is so that they can be updated independently from Android versions.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=51&annotation=WH9T4DTN))
- “[[androidx]] contains the suite of Android Jetpack libraries and the repackaged support library.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=51&annotation=JBS7X97F))

[[settings.gradle]]
```kotlin
pluginManagement { 
	repositories { 
		google() 
		mavenCentral() 
		gradlePluginPortal() 
	} 
} 
dependencyResolutionManagement { repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS) 
	repositories { 
		google() 
		mavenCentral() 
	} 
} 
rootProject.name = "My Application" 
include ':app'
```
- When you first create a project in [[Android Studio]], there will only be one module, app, but when you add more features, you can add new modules that are dedicated to containing the source of a feature rather than packaging it in the main app module
	- These are called [[feature modules]], and you can supplement them with other types of modules, such as [[shared modules]], which are used by all other modules, like a [[networking module]]. This file also contains the repositories of the plugins and dependencies to download from in separate blocks for plugins and dependencies
- [[RepositoriesMode.FAIL_ON_PROJECT_REPOS]] ensures all dependencies repositories are defined here; otherwise, a build error will be triggered
##### (1.5.3) Exercise 1.04 - exploring how Material Design is used to theme an app
- Google's new design language, [[Material Design]] and use it to load a Material Design-themed app. 
	- A design language created by Google that adds enriched UI elements based on real-world effects such as lighting, depth, shadows, and animations.
- To use material design, find this implementation in the dependencies block of `build.gradle.kts (:app)` for material3
- There is a [[themes.xml (android)|themes.xml]] file in the values-night folder used for a dark mode
- 
#### (1.6) Android application structure
##### (1.6.1) Exercise 1.05 - adding interactive UI elements to display a bepoke greeting to the user
##### (1.6.2) Accessing Views in layout files
##### (1.6.3) Further input validation
##### (1.6.4) Activity 1.01 - producing an app to create RGB colors
#### (1.7) Summary
### (2) Building User Screen Flows
- Learn about android ecosystem and building blocks of an Android application
- Activities, lifecycle, intents, and tasks introduced. 
- Restoring state + passing data between screens or activities
#### (2.1) Technical requirements
#### (2.2) The Activity lifecycle
##### (2.2.1) Exercise 2.01 - logging the Activity callbacks
#### (2.3) Saving and restoring the Activity state
##### (2.3.1) Exercise 2.02 - saving and restoring the state in layouts
##### (2.3.2) Exercise 2.03 - saving and restoring the state with Callbacks
#### (2.4) Activity interaction with Intents
##### (2.4.1) Exercise 2.04 - an introduction to Intents
##### (2.4.2) Exercise 2.05 - retrieving a result from an Activity
#### (2.5) Intents, Tasks, and Launch Modes
##### (2.5.1) Exercise 2.06 - setting the Launch Mode of an Activity
##### (2.5.2) Activity 2.01 - creating a login form
#### (2.6) Summary
### (3) Developing the UI with Fragments
- Fragments for user interface
	- Will use the Jetpack Navigation component
#### (3.1) Technical requirements
#### (3.2) The fragment lifecycle
##### (3.2.1) onAttach

##### (3.2.2) onCreate
##### (3.2.3) onCreateView
##### (3.2.4) onViewCreated
##### (3.2.5) on ActivityCreated
##### (3.2.6) onStart
##### (3.2.7) onResume
##### (3.2.8) onPause
##### (3.2.9) onStop
##### (3.2.10) onDestroyView
##### (3.2.11) onDestroy
##### (3.2.12) onDetach
##### (3.2.13) Exercise 3.01 - adding a basic fragment and the fragment lifecycle
##### (3.2.14) Exercise 3.02 - adding fragments statically to an activity
#### (3.3) Static fragments and dual-pane layouts
##### (3.3.1) Exercise 3.03 - dual-pane layouts with static fragments
#### (3.4) Dynamic fragments
##### (3.4.1) Exercise 3.04 - adding fragments dynamically to an activity
#### (3.5) Jetpack Navigation
##### (3.5.1) Exercise 3.05 - adding a Jetpack navigation graph
##### (3.5.2) Activity 3.01 - creating a quiz on the planets
#### (3.6) Summary
### (4) Building App Navigation
- Navigation drawers with sliding layouts, bottom navigation and tabbed navigation
#### (4.1) Technical Requirements
#### (4.2) Navigation overview
#### (4.3) Navigation drawer
##### (4.3.1) Exercise 4.01 - creating an App with a navigation drawer
#### (4.4) Bottom navigation
##### (4.4.1) Exercise 4.02 - adding bottom navigation to your app
#### (4.5) Tabbed navigation
##### (4.5.1) Exercise 4.03 - using tabs for app navigation
##### (4.5.2) Activity 4.01 - Building primary and secondary app navigation
#### (4.6) Summary
## Part 2: Displaying Network Calls
### (5) Essential Libraries: Retrofit, Moshi, and Glide
- “build apps that fetch data from a remote data source” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=17&annotation=TXH6A795))
	- For Retrofit library and Moshi library, can convert data into Kotlin objects
	- Glide library can load remote images into app
#### (5.1) Technical requirements
#### (5.2) Introducing REST, API, JSON, and XML
#### (5.3) Fetching data from a network endpoint
##### (5.3.1) Exercise 5.01 - reading data from an API
#### (5.4) Parsing a JSON response
##### (5.4.1) Exercise 5.02 - extracting the image URL from the API response
#### (5.5) Loading images from a remote URL
##### (5.5.1) Exercise 5.03 - loading the image from the obtained URL
##### (5.5.2) Activity 5.01 - displaying the current weather
#### (5.6) Summary
### (6)Adding and Interacting with Recycler View
- Builds lists and displaying them with help of RecyclerView widget
#### (6.1) Technical requirements
#### (6.2) Adding RecyclerView to our layout
##### (6.2.1) Exercise 6.01 - adding an empty Recycler View to your main activity
#### (6.3) Populating RecyclerView
##### (6.3.1) Exercise 6.02 - populating your RecyclerView
#### (6.4) Responding to clicks in Recycler View
##### (6.4.1) Exercise 6.03 - responding to clicks
#### (6.5) Supporting different Item types
##### (6.5.1) Exercise 6.04 - adding titles to RecyclerView
#### (6.6) Swiping to remove items
##### (6.6.1) Exercise 6.05 - adding swipe to delete functionality
#### (6.7) Adding items interactively
##### (6.7.1) Exercise 6.06 - implementing an ADD A Cat button
##### (6.7.2) Activity 6.01 - managing a list of Items
#### (6.8) Summary
### (7) Android Permissions and Google Maps
- How to get phone permissions from user and how to use Maps API
#### (7.1) Technical requirements
#### (7.2) Requesting permission from the user
##### (7.2.1) Exercise 7.01
#### (7.3) Showing a map of the user's location
##### (7.3.1) Exercise 7.02 - obtaining the user's current location
#### (7.4) Map clicks and custom markers
##### (7.4.1) Exercise 7.03 - adding a custom marker where the map was clicked
##### (7.4.2) Activity 7.01 - creating an app to find the location of a parked car
#### (7.5) Summary
### (8) Services, WorkManager, and Notifications
- Details background work in an Android app
- Have app execute tasks invisible to user
- Showing notifications
#### (8.1) Technical requirements
#### (8.2) Starting a background task using WorkManager
##### (8.2.1) Exercise 8.01 - executing background work with the WorkManager class
#### (8.3) Background operations noticeable to the user - using a Foreground Service
##### (8.3.1) Exercise 8.02 - tracking your SCA's work with a Foreground Service
##### (8.3.2) Activity 8.01 - reminder to drink water
#### (8.4) Summary
### (9) Building User Interfaces using Jetpack Compose
- Applying Jetpack Compose for styles and themes
- Layout files
#### (9.1) Technical requirements
#### (9.2) What is Jetpack Compose?
##### (9.2.1) Exercise 9.01 - first Compose screen
#### (9.3) Handling user actions
##### (9.3.1) Exercise 9.02 - handling user inputs
#### (9.4) Theming in Compose
##### (9.4.1) Exercise 9.03 - applying themes
#### (9.5) Adding Compose to existing projects
##### (9.5.1) Activity 9.01 - first Compose app
#### (9.6) Summary
## Part 3: Testing and Code Structure
### (10) Unit Tests and Integration Tests with JUnit, Mockito, and Espresso
- Types of tests for an android application
- Frameworks used for each type of test
- Concept of test-driven development
#### (10.1) Technical requirements
#### (10.2) Types of testing
#### (10.3) JUnit
#### (10.4) Android Studio testing tips
#### (10.5) Mockito
##### (10.5.1) Exercise 10.01 - testing the sum of numbers
#### (10.6) Integration tests
##### (10.6.1) Robolectric
##### (10.6.2) Espresso
##### (10.6.3) Exercise 10.02 - double integration
#### (10.7) UI tests
##### (10.7.1) Testing in Jetpack Compose
##### (10.7.2) Exercise 10.03 - random waiting times
#### (10.8) TDD
##### (10.8.1) Exercise 10.04 - using TDD to calculate the sum of numbers
##### (10.8.2) Activity 10.01 - developing with TDD
#### (10.9) Summary
### (11) Android Architecture Components
- “Android Jetpack libraries, such as ViewModel, which will help separate the business logic from the user interface code.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=17&annotation=PH5JPUIZ))
- “observable data streams such as LiveData to deliver data to the user interface.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=17&annotation=IVTZFUPK))
- “Room library to analyze how we can persist data.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=17&annotation=6SIA664H))
#### (11.1) Technical requirements
#### (11.2) Android components background
#### (11.3) ViewModel
##### (11.3.1) Exercise 11.01 - shared ViewModel
#### (11.4) Data streams
##### (11.4.1) LiveData
##### (11.4.2) Additional data streams
#### (11.5) Room
##### (11.5.1) Entities
##### (11.5.2) DAO
##### (11.5.3) Setting up the database
##### (11.5.4) Third-party frameworks
##### (11.5.5) Exercise 11.03 - making a little room
##### (11.5.6) Activity 11.01 - a shopping notes app
#### (11.6) Summary

### (12) Persisting Data
- “various ways to store data on a device, from SharedPreferences to files.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=17&annotation=NZV2PRTP))
- Repository concept
	- How to structure app in different layers
#### (12.1) Technical requirements
#### (12.2) Preferences and DataStore
##### (12.2.1) SharedPreferences
##### (12.2.2) Exercise 12.01 - wrapping SharedPreferences
##### (12.2.3) DataStore
##### (12.2.4) Exercise 12.02 - Preference DataStore
#### (12.3) Files
##### (12.3.1) Internal Storage
##### (12.3.2) External storage
##### (12.3.3) FileProvider
##### (12.3.4) The Storage Access Framework (SAF)
##### (12.3.5) Asset files
##### (12.3.6) Exercise 12.03 - copying files
#### (12.4) Scoped storage
##### (12.4.1) Camera and media storage
##### (12.4.2) Exercise 12.04 - taking photos
##### (12.4.3) Activity 12.01 - dog downloader
#### (12.5) Summary
### (13) Dependency Injection with Dagger, Hilt, and Koin
- Dagger, Hilt, and Koin can manage your dependencies
#### (13.1) Technical requirements
#### (13.2) The necessity of dependency injection
#### (13.3) Manual DI
##### (13.3.1) Exercise 13.01 - manual injection
#### (13.4) Dagger 2
##### (13.4.1) Consumers
##### (13.4.2) Providers
##### (13.4.3) Connectors
##### (13.4.4) Qualifiers
##### (13.4.5) Scopes
##### (13.4.6) Subcomponents
##### (13.4.7) Exercise 13.02 - Dagger injection
#### (13.5) Hilt
##### (13.5.1) Exercise 13.03 - Hilt injection
#### (13.6) Koin
##### (13.6.1) Exercise 13.04 - Koin injection
##### (13.6.2) Activity 13.01 - injected repositories
#### (13.7) Summary
## Part 4: Polishing and Publishing an App
### (14) Coroutines and Flow
- “background operations and data manipulations with coroutines and Flow.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=18&annotation=49783CCK))
- “manipulating and displaying data using Flow operators and LiveData transformation.” ([pdf](zotero://open-pdf/library/items/QG2Z93CB?page=18&annotation=UFXYLGV3))
#### (14.1) Technical requirements
#### (14.2) Using coroutines on Android
##### (14.2.1) Creating coroutines
##### (14.2.2) Adding coroutines to your project
##### (14.2.3) Exercise 14.01 - using coroutines in an Android app
#### (14.3) Transforming LiveData
##### (14.3.1) Exercise 14.02 - LiveData transformations
#### (14.4) Using Flow on Android
##### (14.4.1) Collecting Flows on Android
##### (14.4.2) Creating Flows with Flow Builders
##### (14.4.3) Using operators with Flows
##### (14.4.4) Exercise 14.03 using Flow in an Android application
##### (14.4.5) Activity 14.01 - creating a TV Guide app
#### (14.5) Summary
### (15) Architecture and Patterns
- The architecture patterns to structure Android projects to separate them into different components with distinct functionality
	- Easier to develop, test, and maintain code
#### (15.1) Technical requirements
#### (15.2) Getting started with MVVM
##### (15.2.1) Binding data on Android with data binding
##### (15.2.2) Exercise 15.01 - using data binding in an Android project
#### (15.3) Using Retrofit and Moshi
##### (15.3.1) Implementing the Repository pattern
##### (15.3.2) Exercise 15.02 - using Repository with Room in an Android project
#### (15.4) Using WorkManager
##### (15.4.1) Exercise 15.03 - adding WorkManager to an Android Project
##### (15.4.2) Activity 15.01 - revisiting the TV Guide app
#### (15.5) Summary
### (16) Animations and Transitions with CoordinatorLayout and MotionLayout
- Enhance apps with animations and transitions with [[CoordinatorLayout]] and [[MotionLayout]]
#### (16.1) Technical requirements
#### (16.2) Activity transitions
##### (16.2.1) Adding activity transitions through XML
##### (16.2.2) Adding activity transitions through code
##### (16.2.3) Starting an activity with an activity transition
##### (16.2.4) Exercise 16.01 - creating activity transitions in an app
##### (16.2.5) Adding a shared element transition
##### (16.2.6) Starting an activity with the shared element transition
##### (16.2.7) Exercise 16.02 - creating the shared element transition
#### (16.3) Animations with CoordinatorLayout
#### (16.4) Animations with MotionLayout
##### (16.4.1) Adding MotionLayout
##### (16.4.2) Creating animations with MotionLayout
##### (16.4.3) Exercise 16.03 - adding animations with MotionLayout
##### (16.4.4) The Motion Editor
##### (16.4.5) Debugging MotionLayout
##### (16.4.6) Modifying the MotionLayout path
##### (16.4.7) Exercise 16.04 - modifying the animation path with keyframes
##### (16.4.8) Activity 16.01 - Password Generator
#### (16.5) Summary
### (17) Launching Your App on Google Play
- Publish apps on Google Play, creating a developer account, and launching the app
#### (17.1) Preparing your apps for release
##### (17.1.1) Versioning apps
##### (17.1.2) Creating a keystore
##### (17.1.3) Exercise 17.01 - creating a keystore in Android studio
##### (17.1.4) Storing the keystore and passwords
##### (17.1.5) Signing your apps for release
##### (17.1.6) Exercise 17.02 - creating a signed APK 
##### (17.1.7) Android app bundle
##### (17.1.8) Exercise 17.03 - creating a signed app bundle
##### (17.1.9) App signing by Google Play
#### (17.2) Uploading an app to Google Play
##### (17.2.1) Creating a store listing
##### (17.2.2) Preparing the release
##### (17.2.3) Rolling out a release
#### (17.3) Managing app releases
##### (17.3.1) Release tracks
##### (17.3.2) Staged rollouts
##### (17.3.3) Managed publishing
##### (17.3.4) Activity 17.01 - publishing an app
#### (17.4) Summary
### (18) Index
### (19) Other Books You May Enjoy