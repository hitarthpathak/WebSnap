document.getElementById("screenshot-button").addEventListener("click", () => {

    chrome.tabs.captureVisibleTab(null, { format: 'png' }, function (dataUrl) {

        let link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'screenshot.png';
        link.click();

    });

});

// ------------------------------------------------------------------------------------------------

let media_recorder;
let recorded_chunks = [];
let screen_stream;

document.getElementById("screenrecord-button").addEventListener("click", async () => {

    if (media_recorder && media_recorder.state === "recording") {

        media_recorder.stop();
        screen_stream.getTracks().forEach((track) => track.stop());

        document.getElementById("screenrecord-button").textContent = "Start Screen Recording";
        return;
    }

    try {

        screen_stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });

        media_recorder = new MediaRecorder(screen_stream);

        media_recorder.ondataavailable = (event) => {

            recorded_chunks.push(event.data);

        };

        media_recorder.onstop = () => {

            let blob = new Blob(recorded_chunks, { type: "video/webm" });
            let video_URL = URL.createObjectURL(blob);

            recorded_chunks = [];

            let download_link = document.createElement("a");
            download_link.href = video_URL;
            download_link.download = "screen_recording.webm";
            download_link.click();

        };

        media_recorder.start();
        document.getElementById("screenrecord-button").textContent = "Stop Recording";

    } catch (err) {

        console.error("Error starting screen recording:", err.name || err.message);

    }

});