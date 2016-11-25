Material = require "material"
# Import file "assets"
sk = Framer.Importer.load("imported/assets@1x")
# Use desktop cursor
document.body.style.cursor = "auto"

Framer.Defaults.Animation =
	time: .35
	curve: "ease"

backgroundA = new BackgroundLayer
	backgroundColor: "rgba(255,255,255,1)"

button = new Layer
	width: 190
	height: 44
	borderRadius: 4
	backgroundColor: "rgba(21,124,252,1)"
	clip: true

button.center()

sk.assets.backgroundColor = "rgba(0,0,0,0)"
sk.assets.superLayer = button
sk.firstAssets.states.add
	hidden:
		opacity: 0
		y: sk.firstAssets.y - 10

sk.loadingAssets.states.add
	hidden:
		opacity: 0
		y: sk.loadingAssets.y + 10
		
sk.loadedAssets.states.add
	hidden:
		opacity: 0
		y: sk.loadedAssets.y + 10

sk.loadingAssets.states.switchInstant("hidden")
sk.loadedAssets.states.switchInstant("hidden")

hoverbg1 = "rgba(255,255,255,.15)"
hoverbg2 = "rgba(0,0,0,.05)"

goodspinner = new Material.Spinner
	size: 24
	thickness: 11
	color: "#ffffff"
	changeColor: no

goodspinner.parent = sk.loadingAssets
goodspinner.x = sk.spinner.x
goodspinner.y = sk.spinner.y


firstAction = new Layer
	x: 0
	y: 0
	width: button.width
	height: button.height
	superLayer: button
	backgroundColor: ""
	opacity: 0

firstActionBg = new Layer
	parent: firstAction
	width: firstAction.width
	height: firstAction.height
	backgroundColor: hoverbg1

firstAction.states.add
	hover:
		opacity: 1.00

fileAction = new Layer
	x: 0
	y: 0
	width: 326 - 95
	height: button.height
	superLayer: button
	backgroundColor: ""
	opacity: 0

fileActionBg = new Layer
	parent: fileAction
	width: fileAction.width
	height: fileAction.height
	backgroundColor: hoverbg1

fileAction.states.add
	hover:
		opacity: 1.00

fileAction.visible = false

cancelWrapper = new Layer
	x: button.width - button.height
	y: 0
	width: button.height
	height: button.height
	superLayer: button
	backgroundColor: "rgba(0,0,0,0)"
	opacity: 1

cancelAction = new Layer
	x: 0
	y: 0
	width: button.height
	height: button.height
	superLayer: cancelWrapper
	backgroundColor: ""
	opacity: 0

cancelActionBg = new Layer
	parent: cancelAction
	width: cancelAction.width
	height: cancelAction.height
	backgroundColor: hoverbg1


cancelAction.states.add
	hover:
		opacity: 1.00

cancelAction.visible = false

progressBar = new Layer
	x: -button.width
	y: button.height - 4
	width: button.width
	height: 4 
	superLayer: button
	backgroundColor: "rgba(0,0,0,.15)"
	opacity: 0

globalState = 0

firstAction.onMouseOver ->
	if globalState == 0
		@.states.switch("hover")

firstAction.onMouseOut ->
	if globalState == 0
		@.states.switch("default")

progressBar.onAnimationEnd ->
	if globalState == 1
		@.animate
			properties:
				opacity:0
		sk.loadingAssets.states.next()
		sk.loadedAssets.states.next()
		goodspinner.stop()
		button.animate
			properties:
				width: 326
				backgroundColor: "#F0F0F0"
				#x: button.x - 42
		cancelWrapper.x = 326 - 95
		globalState = 2
		fileAction.visible = true
		fileActionBg.backgroundColor = hoverbg2
		cancelActionBg.backgroundColor = hoverbg2
		cancelAction.width = 95
		cancelAction.states.default.width = 95
		cancelAction.states.hover.width = 95
		cancelActionBg.width = 95

firstAction.onClick ->
	if globalState == 0
		cancelAction.visible = true
		@.states.next()
		globalState = 1
		sk.firstAssets.states.next()
		sk.loadingAssets.states.next()
		goodspinner.start()
		
		progressBar.animate
			time: 2
			curve: "linear"
			properties:
				x: 0
		
		sk.spinner.animate
			time: 2
			curve: "linear"
			properties:
				rotation: 560

fileAction.onMouseOver ->
	@.states.next()

fileAction.onMouseOut ->
	@.states.next()
	
cancelAction.onMouseOver ->
	@.states.next()

cancelAction.onMouseOut ->
	@.states.next()
	

