# Rocket League Overlay 3D-Gaming
<p style="margin-top: 0; margin-bottom: 2rem">Rocket League Overlay commissioned by 3D-Gaming</p>

# Setup:

## Must be installed:
<ul style="margin-bottom: 2rem">
    <li><a href="https://www.rocketleague.com/">Rocket League</a></li>
    <li><a href="https://www.bakkesmod.com/">Bakkesmod</a></li>
    <li><a href="https://nodejs.org/en/">Node.js & NPM</a></li>
    <li><a href="https://gitlab.com/bakkesplugins/sos/sos-plugin">SOS-Plugin</a></li>
    <li><a href="https://gitlab.com/bakkesplugins/sos/sos-ws-relay">Web-Socket-Server</a></li>
    <li><a href="https://github.com/marcelnoehre/rl-overlay-3dg">Overlay Files</a></li>
</ul>

## Download Overlay:
1) Open https://github.com/marcelnoehre/rl-overlay-3dg/archive/refs/heads/master.zip in the browser
2) Extract the .zip file and save it where you can find it again.

<p style="margin-bottom: 4rem">
P.S. You can find a tutorial to install the SOS-Plugin and the Web-Socket-Server 
<a href="https://www.youtube.com/watch?v=QE816DBuwI4&t">here</a>
</p>

# Launch Server:

## Launch Socket Server:
1) Start Bakkesmod as administrator
2) Start Rocket League
3) Open the Command Prompt (cmd)
4) Navigate into the folder of the Web-Socket-Server (cd {route})
5) Type "node ws-relay" 

If you see the green "SUCESS: Connected to Rocket League on localhost:{port}" the Socket Server is running.

**Do not click into the console, the web socket server will then pause to update the game information!**
<p  style="margin-bottom: 2rem"></p>

## Launch Overlay:
1) Open the Command Prompt (cmd)
2) Navigate into the folder of the Overlay (cd {route})
3) Type "npm run overlay"

<p  style="margin-bottom: 2rem">If you see the "✔ Compiled successfully." the server is running.</p>


## Restart Server:
1) Open the console that contains the server
2) Type ctrl + c
3) Type start command
<p style="margin-bottom: 4rem"></p>

# Streamer Information:

## Ingame Settings:
To make sure the Rocket League interface fits into the Overlay, you have to adjust the interface settings:
1) INTERFACE SCALE => 100%
2) DISPLAY SCALE => 100%
3) Hide ingame overlay
<p style="margin-bottom: 2rem"></p>

## Stream Settings:
1) Set the resolution to: 1920x1080
2) Add a fullscreen Game Capture as the background layer
3) Add "http://127.0.0.1:8080" as the front layer
4) Add "http://127.0.0.1:8080/control-panel" as a hidden element with the size 1920 x 1080
5) Right click the control element and select interact

**If the Overlay doesn't work as expected, hide and show it again to refresh the application!**