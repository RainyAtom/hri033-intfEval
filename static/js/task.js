/*
 * Requires:
 *     psiturk.js
 *     utils.js
 */

// Initalize psiturk object
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);

// Task object to keep track of the current phase
var currentview;

var mycondition = condition;  // these two variables are passed by the psiturk server process

var roundCounter = 1; // track round to determine gif/video to show

var c0Vids = ["1_practice", "1_s1", "1_s2", "3_practice", "3_s1", "3_s2"];
var c1Vids = ["3_practice", "3_s1", "3_s2", "1_practice", "1_s1", "1_s2"];
var c2Vids = ["2_practice", "2_s1", "2_s2", "3_practice", "3_s1", "3_s2"];
var c3Vids = ["3_practice", "3_s1", "3_s2", "2_practice", "2_s1", "2_s2"];


// All pages to be loaded
var pages = [
    "demographics.html",
    "check_video.html",
    "instruct-1.html",
	"instruct-2.html",
	"instruct-2_1.html",
    "thankyou.html",
    "free_response.html",
	"free_response_1.html",
	"round.html"
];


// t remove
// psiTurk.preloadPages(pages);
// t try
const init = (async () => {
    await psiTurk.preloadPages(pages);
})()
/////

window.resizeTo(screen.width, screen.height);
var instructionPages = ["instruct-1.html"];



/*****************************
 * Demographic Questionnaire *
 *****************************/

var DemoQuestionnaire = function() {
    
    psiTurk.finishInstructions();
    
    var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your demographic information. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

    record_responses = function() {

        psiTurk.recordUnstructuredData("condition", mycondition);

		psiTurk.recordTrialData({'phase':'demoquestionnaire', 'status':'submit'});
		
		$('input[name=gender]').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);
		});
		
		$('input[name=age]').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);
		});
		
		$('input[name=occupation_FoS]').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);
		});

		$('input[name=languages]').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);
		});
		
		$('input[name=prolific_id]').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);
		});

		var radio_groups = {}
		$(":radio").each(function(i, val){
			radio_groups[this.name] = true;
		})

	    for(group in radio_groups){
	        psiTurk.recordUnstructuredData(group,$(":radio[name='"+group+"']:checked").val());
	    }

    };

    prompt_resubmit = function() {
	replaceBody(error_message);
	$("#resubmit").click(resubmit);
    };

    resubmit = function() {
	replaceBody("<h1>Trying to resubmit...</h1>");
	reprompt = setTimeout(prompt_resubmit, 10000);
	
	psiTurk.saveData({
	    success: function() {
		clearInterval(reprompt); 
                
	    }, 
	    error: prompt_resubmit
	});
    };
    
    // Load the questionnaire snippet 
    psiTurk.showPage('demographics.html');
    window.scrollTo(0, 0);
    psiTurk.recordTrialData({'phase':'demoquestionnaire', 'status':'begin'});

    var r1, r2, r3, r4, r5, r6, r7 = false;

    (function() {
		var empty = true;
		$('#age').keyup(function() {

			empty = false;
			$('#age').each(function() {
				if ($(this).val() == '') {
					empty = true;
				}
			});

			if (empty || $('input[name=age]').val() < 18) {
				r1 = false;
				checkenable();
			} else {
				r1 = true;
				checkenable();
			}
		});
    })()
    
	$("input[name=age]").change(function(){
		if ($('input[name=age]').val()  == '' || $('input[name=age]').val() < 18) {
			r1 = false;
			checkenable();
		} else {
			r1 = true;
			checkenable();
		}
    });
	
	$("input[name=gender]").change(function(){
	r2=true;
	checkenable();
    });
	
	$("input[name=occupation_FoS]").change(function(){
	r3=true;
	checkenable();
    });
	
	$("input[name=languages]").change(function(){
	r4=true;
	checkenable();
    });
	
    $("input[name=experience]").change(function(){
	r5=true;
	checkenable();
    });
	
	$("input[name=experience1]").change(function(){
	r6=true;
	checkenable();
    });
	
	$("input[name=prolific_id]").change(function(){
	r7=true;
	checkenable();
    });
    
    function checkenable(){
	if (r1 && r2 && r3 && r4 && r5 && r6 && r7){
	    $('#next').removeAttr('disabled');
	}
	else {
	    $('#next').prop('disabled', true);
	}
    }
    
    $("#next").click(function () {
    	record_responses();
	currentview = new VidCheck();
    }); 
};


/***************
 * Video Check *
 ***************/

var VidCheck = function() {

    var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your information. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

    var ppcounter = 0;
    var rscounter = 0;

    record_responses = function() {
        psiTurk.recordTrialData({'phase':'vidcheck', 'status':'submit'});
    };

    prompt_resubmit = function() {
        replaceBody(error_message);
        $("#resubmit").click(resubmit);
    };

    resubmit = function() {
        replaceBody("<h1>Trying to resubmit...</h1>");
        reprompt = setTimeout(prompt_resubmit, 10000);
        psiTurk.saveData({
            success: function() {
                clearInterval(reprompt);
            },
            error: prompt_resubmit
        });
    };

    // Load the questionnaire snippet
    psiTurk.showPage('check_video.html');
    window.scrollTo(0, 0);
    psiTurk.recordTrialData({'phase':'vidcheck', 'status':'begin'});

    var r1, r2, r3 = false;

    function checkenable(){
        if (r1 && r3){
            $('#next').removeAttr('disabled');
        }
        else {
            $('#next').prop('disabled', true);
        }
    }

    $("input[name=seeword]").keyup(function(){
        var word = $("input[name=seeword]").val();
        word = word.toLowerCase();
        r1 = false;
        if (word.includes("amazing")) {
            r1=true;
        }
        checkenable();
    });

    $("#video1").on('ended', function() {
        psiTurk.recordTrialData({'phase':'vidcheck', 'status':'video ended'});
        r3 = true;
        checkenable();
    });

    $("#ppbutton").click(function () {
        psiTurk.recordTrialData({'phase':'vidcheck', 'status':'play/pause clicked: '+ppcounter});
        ppcounter += 1;
    });

    $("#rsbutton").click(function () {
        psiTurk.recordTrialData({'phase':'vidcheck', 'status':'restart clicked: '+rscounter});
        rscounter += 1;
    });

    $("#next").click(function () {
        record_responses();
        currentview = new DetailedInstruct();
    });
};
// end videocheck


/***************
 * Detailed Instructions*
 ***************/
var DetailedInstruct = function(){
	
	var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your information. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

    record_responses = function() {
        psiTurk.recordTrialData({'phase':'detailedInstruct', 'status':'submit'});
    };

    prompt_resubmit = function() {
        replaceBody(error_message);
        $("#resubmit").click(resubmit);
    };

    resubmit = function() {
        replaceBody("<h1>Trying to resubmit...</h1>");
        reprompt = setTimeout(prompt_resubmit, 10000);
        psiTurk.saveData({
            success: function() {
                clearInterval(reprompt);
            },
            error: prompt_resubmit
        });
    };
	
	// check condition
	// default to condition 0 and 2 vals
	var pageToShow = 'instruct-2.html';
	if (mycondition == 1 || mycondition == 3){
		pageToShow = 'instruct-2_1.html';
	}
		
	// Load the questionnaire snippet
    psiTurk.showPage(pageToShow);
    window.scrollTo(0, 0);
    psiTurk.recordTrialData({'phase':'detailedInstruct', 'status':'begin'});
	
	 $("#next").click(function () {
        record_responses();
        currentview = new Round();
    });
};

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------

var Round = function(){
   //console.log("condition " + mycondition);
   //console.log("round " + roundCounter);
   var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your information. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

    var ppcounter = 0;
    var rscounter = 0;

	record_responses = function() {
        psiTurk.recordTrialData({'phase':curr_video, 'status':'submit'});

		psiTurk.recordUnstructuredData(curr_video+ "_notice", $("input[name=noticeYesNo").val());	
		psiTurk.recordUnstructuredData(curr_video+ "_disconnectComps", $("input[name=disconnectComps").val());
		psiTurk.recordUnstructuredData(curr_video+ "_connectComps", $("input[name=connectComps").val());
		
		
		var sameRobots = ["","", "", ""];
		if(document.getElementById("robotSameA").checked){
			sameRobots[0] = "A";
		}
		if(document.getElementById("robotSameB").checked){
			sameRobots[1] = "B";
		}
		if(document.getElementById("robotSameC").checked){
			sameRobots[2] = "C";
		}
		if(document.getElementById("robotSameD").checked){
			sameRobots[3] = "D";
		}
		
		psiTurk.recordUnstructuredData(curr_video+ "_sameRobots", sameRobots.toString());
		psiTurk.recordUnstructuredData(curr_video+ "_FR", $("textarea[name=intfComments").val());
		psiTurk.recordUnstructuredData(curr_video+ "_aCount", $("input[name=aCount").val());
    };

    prompt_resubmit = function() {
        replaceBody(error_message);
        $("#resubmit").click(resubmit);
    };

    resubmit = function() {
        replaceBody("<h1>Trying to resubmit...</h1>");
        reprompt = setTimeout(prompt_resubmit, 10000);
        psiTurk.saveData({
            success: function() {
                clearInterval(reprompt);
            },
            error: prompt_resubmit
        });
    };
    
    // Load the questionnaire snippet 
    psiTurk.showPage('round.html');
    window.scrollTo(0, 0);
    psiTurk.recordTrialData({'phase':'round', 'status':'begin'});
    
	// change header text based on round
	var roundTxt = document.getElementById('roundNumber');
	if(roundCounter == 1 || roundCounter == 4){
		roundTxt.textContent = "Round " + roundCounter.toString() + " - Practice";
	} else{
		roundTxt.textContent = "Round " + roundCounter.toString();
	}
	
	// select video to show by condition
	// if my condition = 0
	var curr_video = c0Vids[roundCounter-1];
	if (mycondition == 1){
		curr_video = c1Vids[roundCounter-1];
	} else if (mycondition == 2){
		curr_video = c2Vids[roundCounter-1];
	} else if (mycondition == 3){
		curr_video = c3Vids[roundCounter-1];
	}

	var video_loc = "/static/videos/" + curr_video + ".mp4";
	$("#mp4src").attr("src", video_loc)
	psiTurk.recordTrialData({'phase':'round', 'status':"showing video "+curr_video});	
	
	var vid_watched = false;
    $("#roundVideo").load();
    
    $("#roundVideo").on('ended', function() {
        psiTurk.recordTrialData({'phase':'roundVideo', 'status':'video ended'});
		vid_watched = true;
		checkenable();
    });
    
    $("#ppbutton").click(function () {
        psiTurk.recordTrialData({'phase':'roundVideo', 'status':'play/pause clicked: '+ppcounter});
        ppcounter += 1;
    });
	
	var text_loc = "/static/images/" + roundCounter.toString() + ".png";
	$("#sampleText").attr("src", text_loc)
    
	
	var r1, r2, r3, r5, r6 = false;
    function checkenable(){
		if(vid_watched && r1 && r2 && r3 && r5 && r6){
			$('#next').removeAttr('disabled');
		}
		else {
			$('#next').attr('disabled', 'disabled');
		}
    }// end of checkenable
	
	
	$("input[name=noticeYesNo]").change(function(){
		r1=true;
		checkenable();
    });
	
	$("input[name=disconnectComps]").change(function(){
		r2=true;
		checkenable();
    });
	
	$("input[name=connectComps]").change(function(){
		r3=true;
		checkenable();
    });
	
	$("input[name=robotSame]").change(function(){
		checkenable();
    });
	
	$("textarea[name=intfComments]").change(function(){
		r5=true;
		checkenable();
    });
	
	$("input[name=aCount]").change(function(){
		r6=true;
		checkenable();
    });
	
	
    
    $("#next").click(function () {
        record_responses();
		roundCounter++;
		
		currentview = new Round();
		if(roundCounter > 6){
			currentview = new FinalFR();
		}
				
	});
}; // end video1



/*****************************
 * Final FR*
 *****************************/
// TODO adjust videos shown by condition
var FinalFR = function() {
    var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your information. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";
	
    record_responses = function() {

        psiTurk.recordUnstructuredData("condition", mycondition);

		psiTurk.recordTrialData({'phase':'feedback', 'status':'submit'});

		$('textarea[name=context]').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);
		});

    };

    prompt_resubmit = function() {
	replaceBody(error_message);
	$("#resubmit").click(resubmit);
    };

    resubmit = function() {
	replaceBody("<h1>Trying to resubmit...</h1>");
	reprompt = setTimeout(prompt_resubmit, 10000);

	psiTurk.saveData({
	    success: function() {
		clearInterval(reprompt);

	    },
	    error: prompt_resubmit
	});
    };

		// check condition
	// default to condition 0 and 2 vals
	var pageToShow = 'free_response.html';
	if (mycondition == 1 || mycondition == 3){
		pageToShow = 'free_response_1.html';
	}
	
    // Load the questionnaire snippet
    psiTurk.showPage(pageToShow);
    window.scrollTo(0, 0);
    psiTurk.recordTrialData({'phase':'feedback', 'status':'begin'});

    document.getElementById("context").addEventListener("input", checkenable);
 
    function WordCount(str) {
      return str.split(" ").length;
      }

    function checkenable(){
		var c1 = $("textarea[name=context]").val().toString();
        $('#next').removeAttr('disabled');
    }
    var current_checkenable = setInterval(checkenable, 1000)
	

    $("#next").click(function () {
    	record_responses();
		psiTurk.saveData({
            success: function(){
                psiTurk.completeHIT();
                // psiTurk.computeBonus('compute_bonus', function() { 
                //     psiTurk.completeHIT(); // when finished saving compute bonus, the quit
                // }); 
            }, 
            error: prompt_resubmit});
    }); 
    };


/************
 * Run Task *
 ************/
$(window).on('load', async () => {
    await init
    psiTurk.doInstructions(
    	instructionPages, // a list of pages you want to display in sequence
    	function() { currentview = new DemoQuestionnaire(); } // what you want to do when you are done with instructions		
    );
});


