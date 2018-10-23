(function() {
	// Get some required handles
	var audio = document.getElementById('v');
	var recStatus = document.getElementById('recStatus');
	var startRecBtn = document.getElementById('startRecBtn');
	var stopRecBtn = document.getElementById('stopRecBtn');

	// Define a new speech recognition instance
	var rec = null;
	try {
		rec = new webkitSpeechRecognition();
	} 
	catch(e) {
    	document.querySelector('.msg').setAttribute('data-state', 'show');
    	startRecBtn.setAttribute('disabled', 'true');
    	stopRecBtn.setAttribute('disabled', 'true');
    }
    if (rec) {
		rec.continuous = true;
		rec.interimResults = false;
		rec.lang = 'en';

		// Define a threshold above which we are confident(!) that the recognition results are worth looking at 
		var confidenceThreshold = 0.5;

		// Simple function that checks existence of s in str
		var userSaid = function(str, s) {
			return str.indexOf(s) > -1;
		}

		// Highlights the relevant command that was recognised in the command list for display purposes
		var highlightCommand = function(cmd) {
			var el = document.getElementById(cmd); 
			el.setAttribute('data-state', 'highlight');
			setTimeout(function() {
				el.setAttribute('data-state', '');
			}, 3000);
		}

		// Process the results when they are returned from the recogniser
		rec.onresult = function(e) {
			// Check each result starting from the last one
			for (var i = e.resultIndex; i < e.results.length; ++i) {
				// If this is a final result
	       		if (e.results[i].isFinal) {
	       			// If the result is equal to or greater than the required threshold
	       			if (parseFloat(e.results[i][0].confidence) >= parseFloat(confidenceThreshold)) {
		       			var str = e.results[i][0].transcript;
		       			console.log('Recognised: ' + str);
		       			// If the user said 'audio' then parse it further
		       			if (userSaid(str, 'hotline')) {
		       				
                            // Replay the audio
		       				if (userSaid(str, 'replay')) {
		       					audio.currentTime = 0;
		       					audio.play();
		       					highlightCommand('audReplay');
		       				}
		       				// Play the audio
		       				else if (userSaid(str, 'bling')) {
		       					audio.play();
                                var element = document.getElementById("lyricspan");
                                element.classList.add("foundlyrics");
		       				}
		       				// Stop the audio
		       				else if (userSaid(str, 'stop')) {
		       					audio.pause();
		       					highlightCommand('audStop');
		       				}
		       				// If the user said 'volume' then parse it even further
		       				else if (userSaid(str, 'volume')) {
		       					// Check the current volume setting of the audio
		       					var vol = Math.floor(audio.volume * 10) / 10;
		       					// Increase the volume
		       					if (userSaid(str, 'increase')) {
		       						if (vol >= 0.9) audio.volume = 1;
		       						else audio.volume += 0.1;
		       						highlightCommand('audVolInc');
		       					}
		       					// Decrease the volume
		       					else if (userSaid(str, 'decrease')) {
		       						if (vol <= 0.1) audio.volume = 0;
		       						else audio.volume -= 0.1;
		       						highlightCommand('audVolDec');
		       					}
		       					// Turn the volume off (mute)
		       					else if (userSaid(str, 'of')) {
		       						audio.muted = true;
		       						highlightCommand('audVolOff');
		       					}
		       					// Turn the volume on (unmute)
		       					else if (userSaid(str, 'on')) {
		       						audio.muted = false;
		       						highlightCommand('audVolOn');
		       					}
		       				}
		       			}
	       			}
	        	}
	    	}
		};

		// Start speech recognition
		var startRec = function() {
			rec.start();
			recStatus.innerHTML = 'recognising';
            var element = document.getElementById("startRecBtn");
            element.classList.add("buttonhidden");
            var sound = document.getElementById("buttonsound");
            sound.play();
		}
		// Stop speech recognition
		var stopRec = function() {
			rec.stop();
			recStatus.innerHTML = 'not recognising';
            
		}
		// Setup listeners for the start and stop recognition buttons
		startRecBtn.addEventListener('click', startRec, false);
		stopRecBtn.addEventListener('click', stopRec, false);
	}
})();