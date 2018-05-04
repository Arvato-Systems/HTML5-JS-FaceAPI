var PageController = (function() {
    var drawtimer;
    var analysetimer;
    var redrawTimeoutOnCanvas = 20;
    var video;
    var canvas;

    function draw(){
        var context=canvas.getContext('2d');
        context.beginPath();
        context.clearRect(0, 0, 640, 480);
        context.drawImage(video,0,0,640,480);

        if((FaceAnalyse.getFaces() === undefined) || (FaceAnalyse.getFaces() == null)) return;
        for(i=0; i<FaceAnalyse.getFaces().length; i++){
            var face = FaceAnalyse.getFaces()[i];
            context.beginPath();
            context.fillStyle = 'yellow';
            context.font = '14pt Calibri';
            context.fillText("Age " + face.faceAttributes.age, face.faceRectangle.left + 10, face.faceRectangle.top + 14);
            context.fillText(face.faceAttributes.gender, face.faceRectangle.left + 10, face.faceRectangle.top + 28);
            context.stroke();
            context.beginPath();
            context.lineWidth="3";
            context.strokeStyle="red";
            context.rect(face.faceRectangle.left, face.faceRectangle.top, face.faceRectangle.width, face.faceRectangle.height);
            context.stroke();
        }
    };

    return {
        startcam : function(){
            video = document.querySelector("#videoElement");
            canvas=document.querySelector('#canvas');
            navigator.mediaDevices.getUserMedia({video:{width:640, height:480}})
                .then(handleVideo)
                .catch(videoError);
        
            function handleVideo(stream) {
                video.srcObject = stream;
                video.play();
                drawtimer = setInterval(draw, redrawTimeoutOnCanvas);
            }
        
            function videoError(e) {
                alert(e);
            }
        },
        
        stopcam : function(){
            clearInterval(drawtimer);
            video.pause();
        },

        startanalyse : function(){
            PageController.stopanalyse();
            var timerval = document.querySelector("#timeframe").value;
            var apiurl = document.querySelector("#apiurl").value;
            var apikey = document.querySelector("#apikey").value;
            analysetimer = setInterval(function(){FaceAnalyse.analyzeSnapshot(canvas, apiurl, apikey);}, timerval);
        },
        
        stopanalyse : function(){
            clearInterval(analysetimer);
        }
    }
})();