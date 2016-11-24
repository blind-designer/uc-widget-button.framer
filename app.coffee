# Import file "assets"
sk = Framer.Importer.load("imported/assets@1x")
# Use desktop cursor
document.body.style.cursor = "auto"

Framer.Defaults.Animation =
	time: .35
	curve: "ease"

backgroundA = new BackgroundLayer
	backgroundColor: "rgba(221,221,221,1)"

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

firstAction = new Layer
	x: 0
	y: 0
	width: button.width
	height: button.height
	superLayer: button
	backgroundColor: "rgba(255,255,255,.15)"
	opacity: 0

firstAction.states.add
	hover:
		opacity: 1.00

fileAction = new Layer
	x: 0
	y: 0
	width: 274 - 44
	height: button.height
	superLayer: button
	backgroundColor: "rgba(255,255,255,.15)"
	opacity: 0

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
	backgroundColor: "rgba(255,255,255,.15)"
	opacity: 0

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
	opacity: 1

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
		button.animate
			properties:
				width: 274
				#x: button.x - 42
		cancelWrapper.x = 274 - 44
		globalState = 2
		fileAction.visible = true

firstAction.onClick ->
	if globalState == 0
		cancelAction.visible = true
		@.states.next()
		globalState = 1
		sk.firstAssets.states.next()
		sk.loadingAssets.states.next()
				
		progressBar.animate
			time: 2
			curve: "linear"
			properties:
				x: 0

fileAction.onMouseOver ->
	@.states.next()

fileAction.onMouseOut ->
	@.states.next()
	
cancelAction.onMouseOver ->
	@.states.next()

cancelAction.onMouseOut ->
	@.states.next()

